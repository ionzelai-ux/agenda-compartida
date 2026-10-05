/*** AGENDA COMPARTIDA ANDREA · JON — conector con Google Sheets (v2) ***/
/*** v2: checks de ejecución y validación. Además, cualquier campo nuevo que mande
    la agenda crea su columna automáticamente (no hará falta volver a tocar esto). ***/
/*** Pega este código COMPLETO en Extensiones > Apps Script de tu Google Sheet
     (sustituye lo que haya) y cambia la clave de abajo. ***/

var TOKEN = 'CAMBIA-ESTA-CLAVE';

// Columnas de las hojas Proyectos y Tareas (mismo esquema para las dos).
// Si en el futuro se añaden columnas nuevas, se crean solas al final de la hoja.
var COLS = [
  'id', 'proyecto_id', 'titulo', 'descripcion', 'urgencia', 'estado', 'responsable',
  'fecha_inicio', 'hora_inicio', 'duracion', 'fecha_revision', 'fecha_entrega', 'hora_entrega',
  'entrega_original', 'completada_en',
  'ejecutada', 'ejecutada_por', 'ejecutada_en', 'validada', 'validada_por', 'validada_en',
  'creado_por', 'creado_en', 'actualizado_por', 'actualizado_en', 'borrado',
  'comentarios', 'historial'
];
var COLS_JSON = { comentarios: true, historial: true };
var HOJAS = { proyectos: 'Proyectos', tareas: 'Tareas' };

// Ejecútala una vez desde el editor para crear las hojas y autorizar el script.
function configurar(){
  hoja_('proyectos');
  hoja_('tareas');
}

// ============================================================
//   ROUTER
// ============================================================
function doGet(e){
  var p = (e && e.parameter) || {};
  if(!p.token && !p.callback){
    return HtmlService.createHtmlOutput('<h2>Agenda compartida - backend activo</h2><p>El conector funciona correctamente.</p>');
  }
  var out;
  try{
    if(String(p.token) !== TOKEN) out = { ok: false, error: 'token' };
    else if(p.action === 'ping') out = { ok: true, libro: SpreadsheetApp.getActiveSpreadsheet().getName() };
    else out = { ok: true, proyectos: leer_('proyectos'), tareas: leer_('tareas'), ahora: new Date().toISOString() };
  }catch(err){ out = { ok: false, error: String(err) }; }
  return salida_(p, out);
}

function doPost(e){
  var lock = LockService.getScriptLock();
  try{ lock.waitLock(20000); }catch(err){ return salida_({}, { ok: false, error: 'ocupado' }); }
  var out;
  try{
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if(String(data.token) !== TOKEN){
      out = { ok: false, error: 'token' };
    } else {
      var n = 0;
      for(var k in HOJAS){ if(data[k] && data[k].length) n += guardar_(k, data[k]); }
      out = { ok: true, guardados: n };
    }
  }catch(err){ out = { ok: false, error: String(err) }; }
  finally{ lock.releaseLock(); }
  return salida_({}, out);
}

function salida_(p, o){
  var body = JSON.stringify(o);
  if(p && p.callback){
    return ContentService.createTextOutput(p.callback + '(' + body + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
//   HOJAS
// ============================================================
function hoja_(k){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName(HOJAS[k]);
  if(!s) s = ss.insertSheet(HOJAS[k]);
  if(s.getLastRow() === 0){
    s.getRange(1, 1, 1, COLS.length).setValues([COLS])
      .setFontWeight('bold').setBackground('#1E40AF').setFontColor('#FFFFFF');
    s.setFrozenRows(1);
    // Todo como texto: así Sheets no convierte fechas ni horas a su formato
    s.getRange(1, 1, s.getMaxRows(), COLS.length).setNumberFormat('@');
    return s;
  }
  var hdr = cabecera_(s);
  var falta = COLS.filter(function(c){ return hdr.indexOf(c) < 0; });
  if(falta.length) s.getRange(1, hdr.length + 1, 1, falta.length).setValues([falta]);
  return s;
}

function cabecera_(s){
  var lc = s.getLastColumn();
  return lc ? s.getRange(1, 1, 1, lc).getValues()[0].map(String) : [];
}

function leer_(k){
  var s = hoja_(k), lr = s.getLastRow();
  if(lr < 2) return [];
  var hdr = cabecera_(s), iId = hdr.indexOf('id');
  var vals = s.getRange(2, 1, lr - 1, hdr.length).getValues();
  var out = [];
  for(var i = 0; i < vals.length; i++){
    if(vals[i][iId]) out.push(filaAObj_(hdr, vals[i]));
  }
  return out;
}

// Alta o actualización por id. Gana la versión con "actualizado_en" más reciente,
// pero los comentarios y el historial de fechas se suman siempre (nunca se pierden).
function guardar_(k, lista){
  var s = hoja_(k), hdr = cabecera_(s), lr = s.getLastRow();
  var vals = lr > 1 ? s.getRange(2, 1, lr - 1, hdr.length).getValues() : [];
  // Campos que aún no tienen columna: se añaden al final
  var nuevas = [];
  lista.forEach(function(rec){
    for(var key in rec){
      if(/^[a-z0-9_]+$/.test(key) && hdr.indexOf(key) < 0 && nuevas.indexOf(key) < 0) nuevas.push(key);
    }
  });
  if(nuevas.length){
    s.getRange(1, hdr.length + 1, 1, nuevas.length).setValues([nuevas]);
    hdr = hdr.concat(nuevas);
    vals = vals.map(function(r){ while(r.length < hdr.length) r.push(''); return r; });
  }
  var iId = hdr.indexOf('id'), pos = {};
  for(var i = 0; i < vals.length; i++){ if(vals[i][iId]) pos[String(vals[i][iId])] = i; }
  var n = 0;
  lista.forEach(function(rec){
    if(!rec || !rec.id) return;
    var idx = pos[String(rec.id)];
    if(idx === undefined){
      vals.push(objAFila_(hdr, rec));
      pos[String(rec.id)] = vals.length - 1;
      n++;
      return;
    }
    var actual = filaAObj_(hdr, vals[idx]);
    var final = String(actual.actualizado_en || '') > String(rec.actualizado_en || '') ? actual : rec;
    final.comentarios = unir_(actual.comentarios, rec.comentarios);
    final.historial = unir_(actual.historial, rec.historial);
    vals[idx] = objAFila_(hdr, final);
    n++;
  });
  if(vals.length) s.getRange(2, 1, vals.length, hdr.length).setNumberFormat('@').setValues(vals);
  return n;
}

function filaAObj_(hdr, row){
  var o = {}, tz = Session.getScriptTimeZone();
  for(var i = 0; i < hdr.length; i++){
    var c = hdr[i];
    if(!c) continue;
    var v = row[i];
    // Por si alguien edita la hoja a mano y Sheets convierte el valor en fecha
    if(v instanceof Date){
      if(c.indexOf('hora') === 0) v = Utilities.formatDate(v, tz, 'HH:mm');
      else if(/_en$/.test(c)) v = v.toISOString();
      else v = Utilities.formatDate(v, tz, 'yyyy-MM-dd');
    }
    if(COLS_JSON[c]){
      try{ v = v ? JSON.parse(v) : []; }catch(e){ v = []; }
    } else {
      v = (v === null || v === undefined) ? '' : String(v);
    }
    o[c] = v;
  }
  return o;
}

function objAFila_(hdr, o){
  return hdr.map(function(c){
    var v = o[c];
    if(COLS_JSON[c]) return JSON.stringify(v || []);
    if(v === null || v === undefined) return '';
    return String(v);
  });
}

function unir_(a, b){
  var vistos = {}, out = [];
  (a || []).concat(b || []).forEach(function(x){
    if(x && x.id && !vistos[x.id]){ vistos[x.id] = true; out.push(x); }
  });
  out.sort(function(x, y){ return String(x.ts) < String(y.ts) ? -1 : 1; });
  return out;
}

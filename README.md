# Agenda compartida Â· Andrea y Jon

Agenda de proyectos y tareas para organizarnos entre los dos. Es una pÃ¡gina HTML
(`index.html`) que se publica en GitHub Pages y guarda los datos en un Google Sheet
de Drive a travÃ©s de Apps Script (`apps-script/Code.gs`).

## QuÃ© hace

- **Proyectos y tareas**: cada tarea pertenece a un proyecto (o queda como tarea suelta).
- **QuiÃ©n lo creÃ³**: todo lleva la marca de quiÃ©n lo creÃ³ y de quiÃ©n lo cambiÃ³ por Ãºltima vez (A = Andrea, J = Jon).
- **QuiÃ©n lo ejecuta** (obligatorio: Jon, Andrea o ambos) y **quiÃ©n lo valida** (opcional; si no se indica,
  valida la misma persona que ejecuta).
- **Por persona**: pantalla con lo que cada uno tiene que ejecutar, lo que tiene que validar y lo que ha
  ejecutado y espera la validaciÃ³n del otro. El filtro Todo / Jon / Andrea de las demÃ¡s pantallas muestra
  lo que le toca a esa persona segÃºn la fase (ejecutar o validar).
- **Urgencia**: Urgente, Media o Baja.
- **Estado con dos checks**: *EjecuciÃ³n* (completada) y *ValidaciÃ³n* (finalizada). SegÃºn los checks, cada tarea
  y cada proyecto estÃ¡ en **Pendiente de ejecuciÃ³n**, **Pendiente de validaciÃ³n** o **Terminados** (con los dos).
  Validar marca tambiÃ©n la ejecuciÃ³n; quitar la ejecuciÃ³n quita la validaciÃ³n. Se guarda quiÃ©n marcÃ³ cada check y cuÃ¡ndo.
  En *Tareas* las tres fases son columnas y se puede arrastrar una tarea de una a otra.
  El cumplimiento de plazo se mide con la fecha de ejecuciÃ³n frente a la de entrega.
- **Fechas**: cuÃ¡ndo empezar (con hora y tiempo previsto), fecha de entrega (con hora opcional) y fecha de revisiÃ³n.
  Cada fecha tiene botones **Hoy** y **MaÃ±ana** para no tener que abrir el calendario.
- **Tareas recurrentes** (campo Â«RepetirÂ»): cada semana, cada mes un dÃ­a fijo, el N.Âº dÃ­a hÃ¡bil o el Ãºltimo dÃ­a
  hÃ¡bil (lunes a viernes sin festivos nacionales). Al marcar la ejecuciÃ³n se crea sola la del periodo siguiente.
- **Hoy**: la agenda del dÃ­a por franjas horarias, lo vencido, lo que hay que entregar hoy, lo que toca empezar y lo de los prÃ³ximos 7 dÃ­as.
- **Calendario**: vista de dÃ­a, semana y mes. En dÃ­a y semana hay franjas de 30 minutos (07:00â€“21:00).
  Clic en un hueco = nueva tarea a esa hora. Las tareas se arrastran para cambiarlas de hora o de dÃ­a.
  En el lateral estÃ¡n las tareas sin programar, listas para arrastrarlas al calendario.
- **RevisiÃ³n semanal** (la de los lunes): proyectos abiertos con sus tareas pendientes, si se cumpliÃ³ la fecha o no
  (a tiempo, con retraso, vencida, sin empezar), cuÃ¡ntas veces se ha movido la entrega y la fecha inicial.
  Las fechas, la urgencia y la persona se cambian ahÃ­ mismo.
- **Aceptar lo nuevo**: lo que crea uno le aparece al otro en un aviso y una ventana para aceptarlo (una a una
  o todo), como acuse de recibo. Quien lo creÃ³ ve Â«â³ Sin aceptarÂ» hasta entonces y la campana le avisa cuando se acepta.
- **Comentarios** en cada tarea y proyecto, y un aviso de **novedades** (la campana) con lo que ha hecho la otra persona desde tu Ãºltima visita.
- Funciona tambiÃ©n sin conexiÃ³n: guarda en el navegador y sube los cambios cuando vuelve la conexiÃ³n.

## Puesta en marcha (una sola vez)

### 1. Google Sheet + Apps Script
1. En tu Drive crea un Google Sheet nuevo (por ejemplo, Â«Agenda Andrea-JonÂ»).
2. **Extensiones â†’ Apps Script**. Borra lo que haya y pega el contenido de `apps-script/Code.gs`.
3. Cambia `TOKEN = 'CAMBIA-ESTA-CLAVE'` por una clave tuya (por ejemplo, `agenda-7Hq2xP9m`).
4. Arriba, elige la funciÃ³n `configurar` y pulsa **Ejecutar**. Acepta los permisos. Se crean las pestaÃ±as *Proyectos* y *Tareas*.
5. **Implementar â†’ Nueva implementaciÃ³n â†’ AplicaciÃ³n web**:
   - Ejecutar como: **Yo**
   - QuiÃ©n tiene acceso: **Cualquier usuario**
6. Copia la URL que termina en `/exec`.

### 2. GitHub Pages
1. Crea el repositorio en GitHub (por ejemplo, `agenda-compartida`) y sube estos ficheros.
2. En el repositorio: **Settings â†’ Pages â†’ Deploy from a branch â†’ `main` / root**.
3. Al cabo de un minuto la agenda estarÃ¡ en `https://<tu-usuario>.github.io/agenda-compartida/`.

### 3. Conectar
1. Abre la agenda, elige **Jon** y, en la misma ventana, pega la URL `/exec` y la clave. Pulsa **Probar conexiÃ³n** y luego **Empezar**.
2. En Ajustes (tu cÃ­rculo arriba a la derecha) pulsa **Copiar enlace de acceso para Andrea** y envÃ­aselo.
   Ese enlace ya lleva la conexiÃ³n configurada y la identifica como Andrea.

> La URL y la clave no se guardan en el repositorio: cada navegador las guarda en su propio almacenamiento.

## Actualizar el Apps Script

Si cambia `Code.gs`, pÃ©galo de nuevo y ve a **Implementar â†’ Gestionar implementaciones â†’ editar (lÃ¡piz) â†’
VersiÃ³n: nueva versiÃ³n â†’ Implementar**. AsÃ­ la URL `/exec` se mantiene y no hay que reconfigurar nada.

## Datos

- Una fila por proyecto o tarea. Todas las celdas se guardan como texto para que Sheets no cambie fechas ni horas.
- Los borrados no eliminan la fila: la marcan con `borrado = true`.
- Si los dos cambiÃ¡is lo mismo a la vez, gana el Ãºltimo cambio, pero los comentarios de los dos se conservan siempre.
- Ajustes â†’ **Descargar copia (JSON)** guarda una copia de seguridad de todo.

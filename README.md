# Agenda compartida · Andrea y Jon

Agenda de proyectos y tareas para organizarnos entre los dos. Es una página HTML
(`index.html`) que se publica en GitHub Pages y guarda los datos en un Google Sheet
de Drive a través de Apps Script (`apps-script/Code.gs`).

## Qué hace

- **Proyectos y tareas**: cada tarea pertenece a un proyecto (o queda como tarea suelta).
- **Quién lo creó**: todo lleva la marca de quién lo creó y de quién lo cambió por última vez (A = Andrea, J = Jon).
- **Para quién**: Jon, Andrea o ambos.
- **Urgencia**: Urgente, Media o Baja.
- **Fechas**: cuándo empezar (con hora y tiempo previsto), fecha de entrega (con hora opcional) y fecha de revisión.
  Cada fecha tiene botones **Hoy** y **Mañana** para no tener que abrir el calendario.
- **Hoy**: la agenda del día por franjas horarias, lo vencido, lo que hay que entregar hoy, lo que toca empezar y lo de los próximos 7 días.
- **Calendario**: vista de día, semana y mes. En día y semana hay franjas de 30 minutos (07:00–21:00).
  Clic en un hueco = nueva tarea a esa hora. Las tareas se arrastran para cambiarlas de hora o de día.
  En el lateral están las tareas sin programar, listas para arrastrarlas al calendario.
- **Revisión semanal** (la de los lunes): proyectos abiertos con sus tareas pendientes, si se cumplió la fecha o no
  (a tiempo, con retraso, vencida, sin empezar), cuántas veces se ha movido la entrega y la fecha inicial.
  Las fechas, la urgencia y la persona se cambian ahí mismo.
- **Comentarios** en cada tarea y proyecto, y un aviso de **novedades** (la campana) con lo que ha hecho la otra persona desde tu última visita.
- Funciona también sin conexión: guarda en el navegador y sube los cambios cuando vuelve la conexión.

## Puesta en marcha (una sola vez)

### 1. Google Sheet + Apps Script
1. En tu Drive crea un Google Sheet nuevo (por ejemplo, «Agenda Andrea-Jon»).
2. **Extensiones → Apps Script**. Borra lo que haya y pega el contenido de `apps-script/Code.gs`.
3. Cambia `TOKEN = 'CAMBIA-ESTA-CLAVE'` por una clave tuya (por ejemplo, `agenda-7Hq2xP9m`).
4. Arriba, elige la función `configurar` y pulsa **Ejecutar**. Acepta los permisos. Se crean las pestañas *Proyectos* y *Tareas*.
5. **Implementar → Nueva implementación → Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
6. Copia la URL que termina en `/exec`.

### 2. GitHub Pages
1. Crea el repositorio en GitHub (por ejemplo, `agenda-compartida`) y sube estos ficheros.
2. En el repositorio: **Settings → Pages → Deploy from a branch → `main` / root**.
3. Al cabo de un minuto la agenda estará en `https://<tu-usuario>.github.io/agenda-compartida/`.

### 3. Conectar
1. Abre la agenda, elige **Jon** y, en la misma ventana, pega la URL `/exec` y la clave. Pulsa **Probar conexión** y luego **Empezar**.
2. En Ajustes (tu círculo arriba a la derecha) pulsa **Copiar enlace de acceso para Andrea** y envíaselo.
   Ese enlace ya lleva la conexión configurada y la identifica como Andrea.

> La URL y la clave no se guardan en el repositorio: cada navegador las guarda en su propio almacenamiento.

## Actualizar el Apps Script

Si cambia `Code.gs`, pégalo de nuevo y ve a **Implementar → Gestionar implementaciones → editar (lápiz) →
Versión: nueva versión → Implementar**. Así la URL `/exec` se mantiene y no hay que reconfigurar nada.

## Datos

- Una fila por proyecto o tarea. Todas las celdas se guardan como texto para que Sheets no cambie fechas ni horas.
- Los borrados no eliminan la fila: la marcan con `borrado = true`.
- Si los dos cambiáis lo mismo a la vez, gana el último cambio, pero los comentarios de los dos se conservan siempre.
- Ajustes → **Descargar copia (JSON)** guarda una copia de seguridad de todo.

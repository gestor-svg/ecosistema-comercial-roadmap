# Ecosistema Comercial — Hoja de Ruta (PWA)

App web instalable (PWA) que convierte la hoja de ruta del proyecto **Ecosistema Comercial Completo** en un checklist práctico:

- **Primeros 30 días** → una tarea por día.
- **Primer trimestre** → una tarea por semana (semanas 5–13).
- **Primer año** → una tarea por mes (meses 4–12).

Cada tarea que implica contactar a alguien (una asociación, un despacho, una cámara) incluye un botón **🔎 Buscar en Google** que abre una nueva pestaña con la búsqueda ya armada. El avance se guarda en el teléfono/computadora (localStorage) y, si se configura, se sincroniza con un **Google Sheet** propio — sin backend, sin servidor, sin costo.

## Usar la app

1. Abre la URL publicada (ver sección *Publicación* abajo) desde el celular o la computadora.
2. En **Safari/Chrome móvil**: menú → "Agregar a pantalla de inicio" / "Instalar app". Queda como una app normal, con ícono.
3. La primera vez, la app pide la fecha en que arranca el Día 1. A partir de ahí calcula sola qué tarea corresponde a hoy.
4. Pestaña **Hoy**: lo que ya deberías haber hecho (o toca hoy). Pestaña **Toda la hoja de ruta**: las 48 tareas completas, filtrables por horizonte.
5. En **Ajustes** (ícono ⚙️) puedes cambiar la fecha de inicio, la ciudad/plaza que se usa en las búsquedas de Google, y pegar la URL de sincronización con Sheets.

## Conectar con Google Sheets (opcional pero recomendado)

El archivo [`apps-script/Code.gs`](apps-script/Code.gs) trae el script completo y las instrucciones paso a paso dentro del mismo archivo (como comentario). En resumen:

1. Crea un Google Sheet nuevo y vacío.
2. Extensiones → Apps Script → pega el contenido de `Code.gs`.
3. Implementar → Nueva implementación → Aplicación web → Ejecutar como "Yo" → Acceso "Cualquier usuario".
4. Copia la URL que termina en `/exec`.
5. En la app, Ajustes → pega esa URL en "URL de Google Apps Script" → Guardar.

Desde ese momento, cada vez que marques o desmarques una tarea se sube una fila/actualización a la hoja "Progreso" de tu Sheet, con columnas: `taskId, title, horizon, period, date, done, timestamp`. Si abres la app en otro dispositivo con la misma URL de Apps Script configurada, el avance se sincroniza (gana el cambio más reciente por `timestamp`).

> El Sheet y el script son 100% tuyos — viven en tu cuenta de Google, no en este repositorio. Nadie más que tú (y quien tú invites al Sheet) puede ver el avance real.

## Publicación (GitHub Pages)

Este repositorio está pensado para publicarse directo con **GitHub Pages**:

1. En GitHub → Settings → Pages.
2. "Build and deployment" → Source: **Deploy from a branch**.
3. Branch: `main`, carpeta `/ (root)`.
4. Guardar. En 1-2 minutos la URL queda activa (GitHub la muestra en esa misma pantalla, algo como `https://<org>.github.io/<repo>/`).

No se necesita ningún build step: es HTML/CSS/JS plano.

## Estructura del proyecto

```
index.html          Shell de la app
styles.css           Estilos (claro/oscuro automático)
app.js               Lógica: fechas, checklist, búsqueda en Google, sync
data.js              Las 48 tareas de la hoja de ruta (editable)
manifest.webmanifest Metadatos de instalación PWA
sw.js                Service worker (cache offline)
icons/               Íconos de la PWA
apps-script/Code.gs  Script de Google para sincronizar con Sheets
docs/                Índice de documentos (whitepapers, kits, manuales) a redactar con Claude
```

## Documentos del plan (whitepapers, kits, manuales)

La hoja de ruta menciona decenas de documentos (manuales internos, whitepapers, kits comerciales). Ninguno se redacta por adelantado: cada uno se le pide a Claude justo cuando su tarea del checklist llega. El control de cuáles ya existen, cuáles faltan y el prompt exacto para pedir cada uno está en [`docs/INDICE-DOCUMENTOS.md`](docs/INDICE-DOCUMENTOS.md).

Los documentos internos (manuales, SOPs) se guardan en este repo, en `/docs`. Los documentos de cara a aliados y clientes (whitepapers, kits, casos de éxito, la identidad del Sello y del Índice Nacional) viven en una carpeta de Google Drive separada — el link está en ese mismo índice.

## Editar las tareas

Todo el contenido del checklist vive en `data.js`, en el arreglo `ROADMAP_TASKS`. Cada tarea tiene:

```js
{ id:"d03", horizon:"30dias", period:"Día 3", offset:2,
  title:"Buscar despachos contables medianos candidatos",
  desc:"...", search:"despacho contable mediano empresas pymes {plaza} contacto" }
```

- `offset`: días desde la fecha de inicio (Día 1 = offset 0).
- `search`: si existe, la tarea muestra el botón de búsqueda en Google. `{plaza}` se reemplaza por la ciudad configurada en Ajustes.
- `search: null`: la tarea no tiene búsqueda asociada (es una acción interna, no un contacto externo).

Puedes agregar, quitar o reordenar tareas libremente — la app recalcula fechas automáticamente a partir de `offset`.

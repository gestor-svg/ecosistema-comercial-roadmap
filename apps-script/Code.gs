/**
 * Ecosistema Comercial — Hoja de Ruta
 * Google Apps Script que conecta la PWA con un Google Sheet, sin backend propio.
 *
 * INSTALACIÓN (una sola vez):
 * 1. Crea un Google Sheet nuevo y vacío (el nombre no importa).
 * 2. Dentro del Sheet: Extensiones → Apps Script.
 * 3. Borra el contenido de Code.gs que aparece por defecto y pega TODO este archivo.
 * 4. Guarda (icono de disco o Ctrl/Cmd+S).
 * 5. Arriba a la derecha: Implementar → Nueva implementación.
 *    - Tipo: "Aplicación web".
 *    - Ejecutar como: "Yo" (tu cuenta).
 *    - Quién tiene acceso: "Cualquier usuario".
 * 6. Autoriza los permisos cuando Google te lo pida (es tu propio script, es seguro).
 * 7. Copia la URL que te da ("URL de la aplicación web", termina en /exec).
 * 8. Pégala en la app, en Ajustes → "URL de Google Apps Script".
 *
 * La primera vez que la app te mande o pida datos, este script crea automáticamente
 * una hoja llamada "Progreso" con las columnas correctas.
 */

const SHEET_NAME = "Progreso";
const COLUMNS = ["taskId", "title", "horizon", "period", "date", "done", "timestamp"];

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doGet(e) {
  const sheet = getOrCreateSheet();
  const rows = sheet.getDataRange().getValues();
  const header = rows.shift();
  const data = rows
    .filter((r) => r[0] !== "") // ignora filas vacías
    .map((r) => {
      const obj = {};
      header.forEach((h, i) => (obj[h] = r[i]));
      return obj;
    });
  return ContentService.createTextOutput(JSON.stringify({ ok: true, data: data })).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    const rows = sheet.getDataRange().getValues();
    const header = rows[0];
    const idCol = header.indexOf("taskId");

    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][idCol] === payload.taskId) {
        rowIndex = i;
        break;
      }
    }

    const newRow = header.map((h) => (payload[h] !== undefined ? payload[h] : ""));

    if (rowIndex === -1) {
      sheet.appendRow(newRow);
    } else {
      sheet.getRange(rowIndex + 1, 1, 1, newRow.length).setValues([newRow]);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Hoja de ruta: Ecosistema Comercial Completo
// Cada tarea: id único, horizonte, etiqueta de periodo, offset en días desde la fecha
// de inicio configurada por el usuario, título, descripción y (opcional) una
// consulta de búsqueda de Google. "{plaza}" se sustituye por la ciudad/región
// configurada en Ajustes, o por "México" si no se configuró ninguna.

const ROADMAP_TASKS = [
  // ===================== PRIMEROS 30 DÍAS (diario) =====================
  { id:"d01", horizon:"30dias", period:"Día 1",  offset:0,  title:"Redactar el Manual del Diagnóstico de Cartera", desc:"Documentar en un solo documento, paso a paso, cómo un contador aliado debe filtrar su propia cartera de clientes para encontrar candidatos (facturación +$10M, marca +5 años).", search:null },
  { id:"d02", horizon:"30dias", period:"Día 2",  offset:1,  title:"Documentar el Protocolo de Respuesta en 72 Horas", desc:"Escribir el SOP interno: qué se hace en las primeras 72 horas cuando llega un caso urgente (auditoría SAT, observación de regalías).", search:null },
  { id:"d03", horizon:"30dias", period:"Día 3",  offset:2,  title:"Buscar despachos contables medianos candidatos", desc:"Identificar 3 despachos con cartera de 50-200 clientes en tu plaza para la cohorte piloto.", search:"despacho contable mediano empresas pymes {plaza} contacto" },
  { id:"d04", horizon:"30dias", period:"Día 4",  offset:3,  title:"Buscar un auditor independiente/regional", desc:"Identificar 1 candidato para validar el tratamiento contable del activo (NIF C-8).", search:"auditor fiscal independiente despacho contable {plaza} contacto" },
  { id:"d05", horizon:"30dias", period:"Día 5",  offset:4,  title:"Buscar un corredor público de confianza", desc:"Necesario para formalizar cualquier aportación de capital en especie.", search:"corredor público directorio {plaza} contacto" },
  { id:"d06", horizon:"30dias", period:"Día 6",  offset:5,  title:"Diseñar el borrador del Kit del Contador Aliado v1", desc:"Guion de presentación + folleto de una página + calculadora simple de ahorro fiscal.", search:null },
  { id:"d07", horizon:"30dias", period:"Día 7",  offset:6,  title:"Revisión semanal 1", desc:"Ajustar la lista de contactos según lo encontrado. ¿Hay 3 despachos, 1 auditor y 1 corredor identificados?", search:null },

  { id:"d08", horizon:"30dias", period:"Día 8",  offset:7,  title:"Primer contacto: despacho contable candidato #1", desc:"Mensaje o llamada inicial explicando la alianza propuesta.", search:null },
  { id:"d09", horizon:"30dias", period:"Día 9",  offset:8,  title:"Primer contacto: despacho contable candidato #2", desc:"Mensaje o llamada inicial.", search:null },
  { id:"d10", horizon:"30dias", period:"Día 10", offset:9,  title:"Primer contacto: despacho contable candidato #3", desc:"Mensaje o llamada inicial.", search:null },
  { id:"d11", horizon:"30dias", period:"Día 11", offset:10, title:"Contactar al auditor independiente candidato", desc:"Explicar el Protocolo de Respuesta en 72 Horas y cómo encaja con su trabajo de dictamen.", search:null },
  { id:"d12", horizon:"30dias", period:"Día 12", offset:11, title:"Contactar al corredor público candidato", desc:"Explicar el tipo de actos que se le pedirá formalizar y la frecuencia esperada.", search:null },
  { id:"d13", horizon:"30dias", period:"Día 13", offset:12, title:"Preparar la presentación del Diagnóstico de Cartera", desc:"Versión lista para mostrar en la primera reunión real con un despacho.", search:null },
  { id:"d14", horizon:"30dias", period:"Día 14", offset:13, title:"Revisión semanal 2", desc:"¿Cuántas reuniones quedaron agendadas esta semana?", search:null },

  { id:"d15", horizon:"30dias", period:"Día 15", offset:14, title:"Primera reunión: despacho contable #1", desc:"Aplicar el Diagnóstico de Cartera en vivo.", search:null },
  { id:"d16", horizon:"30dias", period:"Día 16", offset:15, title:"Primera reunión: despacho contable #2", desc:"Aplicar el Diagnóstico de Cartera en vivo.", search:null },
  { id:"d17", horizon:"30dias", period:"Día 17", offset:16, title:"Primera reunión: despacho contable #3", desc:"Aplicar el Diagnóstico de Cartera en vivo.", search:null },
  { id:"d18", horizon:"30dias", period:"Día 18", offset:17, title:"Reunión con el auditor independiente", desc:"Presentar el Protocolo de 72 Horas con un caso hipotético.", search:null },
  { id:"d19", horizon:"30dias", period:"Día 19", offset:18, title:"Formalizar el primer acuerdo de alianza por escrito", desc:"Con el despacho que respondió mejor. Reglas claras de colaboración y, si aplica, comisión.", search:null },
  { id:"d20", horizon:"30dias", period:"Día 20", offset:19, title:"Aplicar los primeros 5 diagnósticos reales", desc:"Dentro de la cartera del despacho ya aliado.", search:null },
  { id:"d21", horizon:"30dias", period:"Día 21", offset:20, title:"Revisión semanal 3", desc:"¿Cuántos diagnósticos aplicados? ¿algún caso real detectado ya?", search:null },

  { id:"d22", horizon:"30dias", period:"Día 22", offset:21, title:"Dar seguimiento al primer caso detectado", desc:"Si existe, mover el caso a la etapa de valuación/formalización.", search:null },
  { id:"d23", horizon:"30dias", period:"Día 23", offset:22, title:"Formalizar el acuerdo con el corredor público", desc:"Documento de alianza firmado.", search:null },
  { id:"d24", horizon:"30dias", period:"Día 24", offset:23, title:"Buscar 1-2 despachos contables de respaldo", desc:"Para no depender solo de los 3 primeros.", search:"despacho contable mediano empresas pymes {plaza} contacto" },
  { id:"d25", horizon:"30dias", period:"Día 25", offset:24, title:"Preparar el primer caso como caso de éxito", desc:"Si cerró, documentarlo en texto/video corto (con consentimiento del cliente).", search:null },
  { id:"d26", horizon:"30dias", period:"Día 26", offset:25, title:"Ajustar el Manual del Diagnóstico de Cartera", desc:"Incorporar lo aprendido en las reuniones reales.", search:null },
  { id:"d27", horizon:"30dias", period:"Día 27", offset:26, title:"Preparar la versión 2 del Kit del Contador Aliado", desc:"Con los ajustes del mes 1.", search:null },
  { id:"d28", horizon:"30dias", period:"Día 28", offset:27, title:"Medir KPIs del mes 1", desc:"Diagnósticos aplicados, alianzas formalizadas, casos reales originados, tiempo de respuesta del primer caso urgente.", search:null },
  { id:"d29", horizon:"30dias", period:"Día 29", offset:28, title:"Documentar aprendizajes para el trimestre", desc:"Qué funcionó, qué no, qué se ajusta antes de escalar.", search:null },
  { id:"d30", horizon:"30dias", period:"Día 30", offset:29, title:"Cierre de los primeros 30 días", desc:"Definir los próximos aliados a reclutar para el Q1: más despachos, Instituto de la Empresa Familiar, una boutique de M&A.", search:null },

  // ===================== PRIMER TRIMESTRE (semanal) =====================
  { id:"w05", horizon:"trimestre", period:"Semana 5",  offset:28,  title:"Formalizar la Alianza de Despachos Estratégicos", desc:"Convertir la cohorte piloto en programa estructurado; diseñar la Academia del Despacho de Valor.", search:null },
  { id:"w06", horizon:"trimestre", period:"Semana 6",  offset:35,  title:"Buscar y contactar al Instituto de la Empresa Familiar México", desc:"Primer acercamiento institucional, no de venta: proponer co-diseñar el Semáforo de Riesgo Sucesorio.", search:"Instituto de la Empresa Familiar México contacto membresía" },
  { id:"w07", horizon:"trimestre", period:"Semana 7",  offset:42,  title:"Buscar despachos de M&A / banca de inversión boutique", desc:"Identificar 2-3 candidatos para co-diseñar el Filtro de Marca en Transacciones.", search:"banca de inversión boutique M&A {plaza} contacto" },
  { id:"w08", horizon:"trimestre", period:"Semana 8",  offset:49,  title:"Preparar la invitación de co-diseño", desc:"Documento de invitación (no propuesta de venta) para el Instituto y la boutique de M&A.", search:null },
  { id:"w09", horizon:"trimestre", period:"Semana 9",  offset:56,  title:"Primera sesión de co-diseño con el Instituto de la Empresa Familiar", desc:"Construir juntos el Semáforo de Riesgo Sucesorio.", search:null },
  { id:"w10", horizon:"trimestre", period:"Semana 10", offset:63,  title:"Primera sesión de co-diseño con la boutique de M&A", desc:"Construir juntos el Filtro de Marca en Transacciones.", search:null },
  { id:"w11", horizon:"trimestre", period:"Semana 11", offset:70,  title:"Reclutar 5 despachos contables adicionales", desc:"Ampliar la Alianza de Despachos Estratégicos de 3 a 8-10.", search:"despacho contable mediano empresas pymes {plaza} contacto" },
  { id:"w12", horizon:"trimestre", period:"Semana 12", offset:77,  title:"Documentar los primeros 10-15 casos bajo un estándar único", desc:"Mismo formato visual y mismos criterios — el embrión del futuro Sello Marca Protegida.", search:null },
  { id:"w13", horizon:"trimestre", period:"Semana 13", offset:84,  title:"Cierre de trimestre: medir KPIs", desc:"10-15 despachos activos, 60-80 diagnósticos acumulados, 8-12 casos cerrados, al menos 1 institución co-diseñando.", search:null },

  // ===================== PRIMER AÑO (mensual, meses 4-12) =====================
  { id:"m04", horizon:"año1", period:"Mes 4",  offset:90,  title:"Diseñar la identidad del Sello Marca Protegida México", desc:"Briefing a diseñador y primeros bocetos del sello/certificación unificada.", search:"diseñador gráfico identidad de marca freelance {plaza}" },
  { id:"m05", horizon:"año1", period:"Mes 5",  offset:120, title:"Buscar una cámara empresarial para distribuir el Sello", desc:"COPARMEX, CANACO o CANACINTRA local como canal de visibilidad.", search:"COPARMEX CANACO CANACINTRA {plaza} contacto membresía" },
  { id:"m06", horizon:"año1", period:"Mes 6",  offset:150, title:"Buscar universidad o colegio profesional validador de la Academia", desc:"Para dar reconocimiento formal a la certificación del Despacho de Valor.", search:"colegio de contadores públicos {plaza} contacto" },
  { id:"m07", horizon:"año1", period:"Mes 7",  offset:180, title:"Lanzar la Academia del Despacho de Valor (versión pública)", desc:"Abrir la certificación a cualquier despacho, no solo a la cohorte piloto.", search:null },
  { id:"m08", horizon:"año1", period:"Mes 8",  offset:210, title:"Diseñar la metodología del Índice Nacional de Marcas Capitalizadas", desc:"Criterios de inclusión, metodología de cálculo, formato de publicación anual.", search:null },
  { id:"m09", horizon:"año1", period:"Mes 9",  offset:240, title:"Iniciar la conversación exploratoria con SAT/IMPI (moonshot)", desc:"Explorar un posible programa piloto de regularización voluntaria. No se espera cerrar este año — abrir la puerta ya es la victoria.", search:"IMPI SAT vinculación institucional propiedad industrial contacto" },
  { id:"m10", horizon:"año1", period:"Mes 10", offset:270, title:"Publicar la primera edición del Índice Nacional", desc:"Lanzamiento con nota de prensa y distribución a medios especializados.", search:"medios especializados negocios {plaza} contacto prensa" },
  { id:"m11", horizon:"año1", period:"Mes 11", offset:300, title:"Escalar la Alianza de Despachos a 30-40 despachos", desc:"Expandir el reclutamiento a nuevas plazas.", search:"despacho contable mediano empresas pymes {plaza} contacto" },
  { id:"m12", horizon:"año1", period:"Mes 12", offset:330, title:"Cierre de año 1: medir KPIs finales y planear año 2", desc:"Sello, Academia, Índice y al menos un ecosistema estratégico (Legado Vivo o Cierre Blindado) con pipeline propio. Planear expansión por sector y plaza.", search:null },
];

const HORIZON_LABELS = {
  "30dias": "Primeros 30 días",
  "trimestre": "Primer trimestre",
  "año1": "Primer año",
};

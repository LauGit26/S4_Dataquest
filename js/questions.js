/**
 * DataQuest — Banco de preguntas
 * Curso: Economía Internacional — Análisis de datos y fuentes de información
 * (IA responsable, fuentes oficiales y análisis correcto de cifras)
 *
 * CÓMO EDITAR / AGREGAR PREGUNTAS O CAPÍTULOS
 * --------------------------------------------
 * CHAPTERS es una lista de "capítulos" (estaciones de la expedición). Cada
 * capítulo tiene un título, un ícono (emoji) y una lista de preguntas.
 *
 * Cada pregunta tiene esta forma:
 *  {
 *    type: "mc" | "tf",
 *    level: "Recordar" | "Comprender" | "Aplicar" | "Analizar",
 *    text: "Enunciado...",
 *    options: ["A", "B", "C", "D"],   // en "tf" se ignora, se usa Verdadero/Falso
 *    correctIndex: 0,                 // 0 = Verdadero en las de tipo "tf"
 *    explanation: "Retroalimentación que ve el estudiante."
 *  }
 *
 * Puedes agregar preguntas a un capítulo existente, o crear un capítulo
 * nuevo agregando otro objeto al arreglo CHAPTERS. El mapa de expedición
 * se arma solo a partir de esta lista.
 */

const CHAPTERS = [
  {
    id: "ia",
    title: "IA con responsabilidad",
    icon: "🤖",
    description: "Cómo usar la inteligencia artificial de forma académicamente honesta.",
    questions: [
      {
        type: "mc",
        level: "Comprender",
        text: "¿Cuál describe mejor el papel que debería tener una herramienta de inteligencia artificial en el trabajo académico del curso?",
        options: [
          "Sustituir el análisis realizado por la persona estudiante.",
          "Producir automáticamente la respuesta definitiva de una investigación.",
          "Servir como herramienta complementaria para apoyar el aprendizaje y la investigación.",
          "Evitar la necesidad de consultar otras fuentes."
        ],
        correctIndex: 2,
        explanation: "La IA debe ser un apoyo complementario para el aprendizaje y la investigación, no un sustituto del análisis propio ni de la consulta de otras fuentes."
      },
      {
        type: "mc",
        level: "Recordar",
        text: "Cuando se utiliza inteligencia artificial para apoyar la elaboración de un trabajo académico, una práctica fundamental es:",
        options: [
          "Ocultar su utilización para que el trabajo parezca completamente propio.",
          "Reconocer de manera transparente que fue utilizada.",
          "Utilizar únicamente la primera respuesta generada.",
          "Evitar consultar fuentes adicionales."
        ],
        correctIndex: 1,
        explanation: "Reconocer de manera transparente el uso de IA es una práctica académica fundamental; ocultarlo compromete la integridad académica."
      },
      {
        type: "mc",
        level: "Aplicar",
        text: "Una estudiante pregunta a una IA cuál fue el valor de las exportaciones de Costa Rica durante un determinado año. La IA proporciona una cifra, pero no identifica claramente su fuente. ¿Qué debería hacer la estudiante?",
        options: [
          "Utilizar la cifra porque las herramientas de IA trabajan con grandes cantidades de información.",
          "Redondear el dato y utilizarlo sin citarlo.",
          "Verificar la cifra en una fuente confiable y pertinente antes de utilizarla.",
          "Preguntar nuevamente a la misma IA hasta obtener una cifra diferente."
        ],
        correctIndex: 2,
        explanation: "Ante una cifra sin fuente clara, siempre se debe verificar en una fuente confiable y pertinente antes de utilizarla."
      },
      {
        type: "mc",
        level: "Aplicar",
        text: "¿Cuál de las siguientes secuencias representa mejor una utilización académicamente adecuada de la IA?",
        options: [
          "Preguntar a la IA → copiar respuesta → entregar trabajo.",
          "Buscar información → seleccionar únicamente lo que confirma nuestra opinión → entregar.",
          "Formular la consulta → obtener orientación → contrastar información → analizarla → elaborar una respuesta propia.",
          "Solicitar una respuesta extensa → eliminar la referencia a la IA → entregar."
        ],
        correctIndex: 2,
        explanation: "El uso académico adecuado de la IA implica contrastar y analizar la información obtenida para elaborar una respuesta propia, no solo copiarla."
      },
      {
        type: "mc",
        level: "Comprender",
        text: "Un estudiante copia literalmente un análisis generado por IA y lo presenta como propio, sin verificarlo ni reconocer el uso de la herramienta. El principal problema es que:",
        options: [
          "la respuesta probablemente es demasiado extensa.",
          "sustituye el trabajo intelectual del estudiante y afecta la integridad académica.",
          "toda utilización de IA está prohibida en el curso.",
          "las herramientas digitales únicamente pueden utilizarse fuera de la universidad."
        ],
        correctIndex: 1,
        explanation: "Presentar como propio un texto generado por IA, sin verificarlo ni reconocerlo, sustituye el trabajo intelectual y compromete la integridad académica."
      },
      {
        type: "tf",
        level: "Comprender",
        text: "Una respuesta redactada de manera convincente por una inteligencia artificial necesariamente contiene información correcta.",
        correctIndex: 1,
        explanation: "Falso. Que una respuesta esté bien redactada no garantiza que sea correcta; siempre debe verificarse en fuentes confiables."
      },
      {
        type: "tf",
        level: "Comprender",
        text: "Aunque una IA sugiera una fuente o proporcione una cifra económica, la responsabilidad de verificar su pertinencia y veracidad continúa siendo de la persona que utiliza la información.",
        correctIndex: 0,
        explanation: "Verdadero. La responsabilidad de verificar la pertinencia y veracidad de una cifra o fuente siempre recae en quien la utiliza, sin importar de dónde provino la sugerencia."
      }
    ]
  },
  {
    id: "fuentes",
    title: "La brújula de las fuentes confiables",
    icon: "🧭",
    description: "Cómo identificar y elegir fuentes de información pertinentes y oficiales.",
    questions: [
      {
        type: "mc",
        level: "Analizar",
        text: "Se desea estudiar el comportamiento actual de las exportaciones costarricenses. Un sitio web presenta datos hasta 2018, mientras que otra base institucional contiene información mucho más reciente. ¿Cuál criterio debería tener mayor peso para escoger la fuente?",
        options: [
          "Que la página tenga más imágenes.",
          "Que aparezca primero en Google.",
          "La pertinencia y actualidad de los datos para la pregunta de investigación.",
          "Que el texto sea más corto."
        ],
        correctIndex: 2,
        explanation: "Se debe priorizar qué tan pertinentes y actuales son los datos para la pregunta de investigación, no la apariencia del sitio ni su posición en un buscador."
      },
      {
        type: "mc",
        level: "Aplicar",
        text: "Si se necesita información oficial sobre variables como tipo de cambio, inflación o tasas de interés de Costa Rica, ¿cuál de las siguientes fuentes sería especialmente pertinente?",
        options: ["Banco Central de Costa Rica.", "Wikipedia.", "Un blog personal de comercio exterior.", "Una publicación sin autor identificado."],
        correctIndex: 0,
        explanation: "El Banco Central de Costa Rica (BCCR) es la fuente oficial para variables macroeconómicas como tipo de cambio, inflación y tasas de interés."
      },
      {
        type: "mc",
        level: "Aplicar",
        text: "Un estudiante necesita investigar la política de comercio exterior de Costa Rica y sus acuerdos comerciales. ¿Cuál institución costarricense sería una fuente particularmente pertinente?",
        options: ["Ministerio de Comercio Exterior (COMEX).", "Banco Central Europeo.", "Reserva Federal de Estados Unidos.", "Organización Mundial de la Salud."],
        correctIndex: 0,
        explanation: "El Ministerio de Comercio Exterior (COMEX) es la institución costarricense encargada de la política comercial y los acuerdos comerciales del país."
      },
      {
        type: "mc",
        level: "Aplicar",
        text: "Si una empresa costarricense desea investigar información relacionada con las exportaciones de Costa Rica y su promoción comercial, ¿cuál fuente sería especialmente relevante?",
        options: ["PROCOMER.", "Ministerio de Salud.", "Poder Judicial.", "Banco Central Europeo."],
        correctIndex: 0,
        explanation: "PROCOMER es la entidad costarricense especializada en la promoción de exportaciones."
      },
      {
        type: "mc",
        level: "Aplicar",
        text: "Una persona desea comparar estadísticas del comercio mundial entre distintos países. ¿Cuál de las siguientes fuentes especializadas sería apropiada?",
        options: ["Organización Mundial del Comercio (OMC).", "Una publicación de redes sociales sin referencia.", "Una tienda electrónica.", "Una página de opinión personal."],
        correctIndex: 0,
        explanation: "La Organización Mundial del Comercio (OMC) es una fuente especializada en estadísticas del comercio mundial entre países."
      },
      {
        type: "mc",
        level: "Aplicar",
        text: "Para investigar tendencias internacionales relacionadas con comercio, desarrollo e inversión, una de las fuentes institucionales disponibles para el curso es:",
        options: ["UNCTAD.", "Google.", "Google Académico.", "Organización Mundial del Trasiego de Mercancías."],
        correctIndex: 0,
        explanation: "UNCTAD (la Conferencia de las Naciones Unidas sobre Comercio y Desarrollo) es la fuente institucional sugerida para estudiar estas tendencias."
      },
      {
        type: "mc",
        level: "Aplicar",
        text: "Un estudiante quiere investigar el comercio bilateral de un producto determinado entre Costa Rica y otro país. Entre las herramientas sugeridas en el curso se encuentra:",
        options: ["Trade Map.", "Google Maps.", "MERCOSUR.", "Unión Europea."],
        correctIndex: 0,
        explanation: "Trade Map es la herramienta sugerida en el curso para analizar el comercio bilateral de un producto entre países."
      },
      {
        type: "tf",
        level: "Comprender",
        text: "Encontrar una cifra mediante un buscador de Internet es suficiente para considerarla confiable; no es necesario revisar quién produjo el dato.",
        correctIndex: 1,
        explanation: "Falso. Encontrar un dato mediante un buscador no basta: siempre hay que revisar quién produjo el dato y qué tan confiable es la fuente."
      },
      {
        type: "tf",
        level: "Recordar",
        text: "Al elaborar una tabla o gráfico económico es importante identificar aspectos como la fuente, el período analizado y la unidad de medida.",
        correctIndex: 0,
        explanation: "Verdadero. Identificar la fuente, el período y la unidad de medida es esencial para interpretar correctamente una tabla o gráfico económico."
      }
    ]
  },
  {
    id: "datos",
    title: "El laboratorio de datos",
    icon: "🔬",
    description: "Períodos, unidades de medida y tasas de crecimiento: cómo comparar cifras sin equivocarse.",
    questions: [
      {
        type: "mc",
        level: "Analizar",
        text: "Dos estudiantes comparan las exportaciones costarricenses de un producto. Uno utiliza datos mensuales expresados en dólares y el otro datos anuales expresados en miles de dólares. Antes de comparar sus resultados deberían:",
        options: ["sumar directamente ambas cifras.", "escoger la cifra más grande.", "verificar período, unidad de medida y definición de los datos.", "utilizar únicamente el gráfico más atractivo."],
        correctIndex: 2,
        explanation: "Antes de comparar cifras es indispensable verificar que compartan el mismo período, unidad de medida y definición."
      },
      {
        type: "mc",
        level: "Aplicar",
        text: "Las exportaciones de un producto pasan de US$200 millones a US$250 millones. ¿Cuál fue aproximadamente su tasa de crecimiento?",
        options: ["20%", "25%", "50%", "125%"],
        correctIndex: 1,
        explanation: "(250 − 200) / 200 = 0.25, es decir, una tasa de crecimiento aproximada del 25%."
      },
      {
        type: "tf",
        level: "Analizar",
        text: "Dos cifras provenientes de fuentes confiables pueden diferir si utilizan períodos, metodologías, unidades o definiciones distintas.",
        correctIndex: 0,
        explanation: "Verdadero. Aunque ambas fuentes sean confiables, diferencias de período, metodología, unidad o definición pueden producir cifras distintas."
      },
      {
        type: "tf",
        level: "Analizar",
        text: "Comparar directamente valores económicos expresados en unidades o monedas diferentes puede producir conclusiones incorrectas.",
        correctIndex: 0,
        explanation: "Verdadero. Comparar cifras sin homogenizar unidades o monedas puede llevar a conclusiones erróneas."
      }
    ]
  }
];

// No modificar esta línea: expone los capítulos al resto del juego.
if (typeof module !== "undefined") module.exports = CHAPTERS;

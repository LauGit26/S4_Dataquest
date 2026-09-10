# DataQuest — La ruta del analista económico

Juego educativo tipo "mapa de expedición" para que el estudiantado **compita, gane puntos y estrellas, y aprenda** sobre el uso responsable de la inteligencia artificial, cómo identificar fuentes de información confiables (BCCR, COMEX, PROCOMER, OMC, UNCTAD, Trade Map) y cómo analizar correctamente cifras económicas (períodos, unidades, tasas de crecimiento).

Es un sitio **100% estático** (HTML + CSS + JavaScript puro, sin frameworks ni backend) y totalmente **responsive** (se ve y se juega bien desde el celular). Se puede editar directamente en Visual Studio Code y publicar en minutos.

## En qué se diferencia de TradeQuest

Si ya usaste **TradeQuest** (el juego de la Semana 3), esta es su "hermana": mismo espíritu, pero con una mecánica distinta, pensada para que el grupo compita de forma **asíncrona** (cada quien juega cuando puede, no todos al mismo tiempo):

- En vez de preguntas sueltas con vidas, aquí navegas un **mapa de expedición** dividido en 3 estaciones (capítulos) que se desbloquean en orden.
- No hay "vidas": la expedición siempre se completa. Lo que varía es cuántas **estrellas** (0 a 3) ganas en cada estación según tu precisión.
- La tabla de posiciones funciona igual que en TradeQuest (local por navegador, o global en vivo con Firebase) — si ya la configuraste allá, puedes reutilizar el mismo proyecto de Firebase aquí (ver más abajo).

## Contenido del proyecto

```
dataquest/
├── index.html               → estructura de la página y las pantallas del juego
├── css/styles.css           → apariencia visual (tema "mapa de expedición")
├── js/questions.js          → EL BANCO DE PREGUNTAS, agrupado en capítulos
├── js/game.js                → reglas del juego: puntos, tiempo, racha, estrellas
├── js/firebase-config.js    → credenciales para la tabla de posiciones GLOBAL (opcional)
├── js/leaderboard.js         → tabla de posiciones (modo local o modo global en tiempo real)
├── js/main.js                 → conecta todo con las pantallas
├── package.json              → scripts opcionales para probar/publicar desde la terminal
└── README.md                 → este archivo
```

## Cómo se juega

1. La persona estudiante escribe su nombre y elige modo **Competencia** (con tiempo, puntos y racha; el resultado entra a la tabla de posiciones) o **Estudio** (sin tiempo, para repasar con calma).
2. Aparece el **mapa de la expedición**: 3 estaciones (capítulos) representadas como tarjetas con un camino de círculos numerados, uno por pregunta. Solo la primera estación empieza desbloqueada.
3. Al tocar el círculo resaltado se abre esa pregunta en pantalla completa. El puntaje depende de:
   - **Nivel cognitivo**: Recordar (100 pts) · Comprender (150) · Aplicar (200) · Analizar (250).
   - **Velocidad** (modo Competencia): responder rápido da hasta +50% de bono.
   - **Racha (combo)**: 3 aciertos seguidos = ×1.2, 6 o más = ×1.5.
4. Al terminar todas las preguntas de una estación, aparece una pantalla de celebración con las **estrellas** ganadas (según el % de aciertos de esa estación) y se desbloquea la siguiente.
5. Al completar las 3 estaciones se muestra el resultado final (puntaje, precisión, mejor racha, estrellas totales) y, en modo Competencia, el resultado se envía a la tabla de posiciones.
6. Después de cada pregunta se ve la respuesta correcta y una breve explicación — así el juego también sirve para **aprender**, no solo para competir.

## Editar las preguntas o los capítulos

Abre `js/questions.js` en VS Code. El archivo es una lista `CHAPTERS`, y cada capítulo tiene un título, un ícono y su lista de preguntas:

```js
{
  id: "ia",
  title: "IA con responsabilidad",
  icon: "🤖",
  description: "Texto breve que aparece en la tarjeta del mapa.",
  questions: [
    {
      type: "mc",              // "mc" (selección única) o "tf" (verdadero/falso)
      level: "Comprender",     // Recordar | Comprender | Aplicar | Analizar
      text: "Enunciado...",
      options: ["A", "B", "C", "D"],
      correctIndex: 1,         // índice de la opción correcta (0 = primera)
      explanation: "Retroalimentación que ve el estudiante."
    }
  ]
}
```

Puedes agregar preguntas a un capítulo existente, o agregar un capítulo nuevo completo (otro objeto en `CHAPTERS`) — el mapa de expedición se arma solo a partir de esta lista, sin tocar el resto del código.

## Probarlo localmente en VS Code

**Opción rápida (recomendada): extensión Live Server**
1. Instala la extensión **Live Server** (Ritwick Dey) desde el panel de extensiones de VS Code.
2. Clic derecho sobre `index.html` → **"Open with Live Server"**.
3. Se abrirá el juego en tu navegador y se recargará automáticamente cada vez que guardes un cambio. Prueba también achicando la ventana (o con las herramientas de desarrollador en modo celular) para ver que es responsive.

**Alternativa por terminal (sin extensión):**
```
npx serve .
```
y abre la URL que te indique (normalmente `http://localhost:3000`).

## Publicarlo como webapp desde VS Code

Cualquiera de estas tres opciones funciona bien para un sitio estático como este. Todas se hacen desde la terminal integrada de VS Code.

> **Nota:** si en tu computadora la terminal de VS Code usa PowerShell y ya tuviste problemas con `git` o con la política de ejecución de `npm`, en la Opción 1 usa Símbolo del sistema (cmd) en vez de PowerShell, o corrige la política con `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

### Opción 1 — GitHub Pages (gratis, ideal si usas Git/GitHub)
```
git init
git add .
git commit -m "DataQuest: juego de fuentes de información"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/dataquest.git
git push -u origin main

npm install
npm run deploy
```
El comando `npm run deploy` publica el sitio en la rama `gh-pages`. Luego, en GitHub → Settings → Pages, confirma que la fuente sea la rama `gh-pages`. Tu juego quedará en `https://TU-USUARIO.github.io/dataquest/`.

### Opción 2 — Netlify (arrastrar y soltar, sin comandos)
1. Entra a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastra la carpeta `dataquest` completa a la página.
3. Netlify te da una URL pública al instante.

### Opción 3 — Vercel (desde la terminal de VS Code)
```
npm install -g vercel
vercel
```
Sigue las instrucciones en pantalla. Vercel te entrega una URL pública y, con `vercel --prod`, la deja como versión estable.

## Tabla de posiciones global (competencia asíncrona, con reinicio solo para la persona docente)

Por defecto cada estudiante guarda su puntaje solo en su propio navegador (modo local). Para que exista **una sola tabla compartida**, donde cada resultado aparece solo apenas alguien termina su expedición —sin que nadie tenga que jugar al mismo tiempo—, conecta el proyecto a **Firebase** (gratis).

**¿Ya configuraste Firebase para TradeQuest?** Puedes usar el mismo proyecto: solo repite el Paso 4 (copiar el mismo `firebaseConfig`) en `js/firebase-config.js` de este proyecto, y el Paso 6 (agregar la misma regla de seguridad, pero para la colección `dataquest_scores` en vez de `scores`). Cada juego guarda sus resultados en una colección separada, así que no se mezclan.

Si es la primera vez, sigue estos pasos completos:

### Paso 1 — Crear el proyecto de Firebase
Entra a [console.firebase.google.com](https://console.firebase.google.com), crea un proyecto (ej. "dataquest-fuentes-info"). No hace falta Google Analytics.

### Paso 2 — Activar Firestore
**Compilación → Firestore Database → Crear base de datos**, modo producción, la ubicación más cercana.

### Paso 3 — Activar el inicio de sesión de la persona docente
**Compilación → Authentication → Comenzar** → habilita **Correo electrónico/contraseña** → pestaña **Users → Add user** → crea tu cuenta docente.

### Paso 4 — Registrar la app web y copiar la configuración
**Configuración del proyecto → General → Tus apps → `</>`** → registra la app (sin Hosting) → copia el objeto `firebaseConfig`.

### Paso 5 — Pegar la configuración en el proyecto
Abre `js/firebase-config.js` y reemplaza los valores vacíos:

```js
const FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "dataquest-xxxxx.firebaseapp.com",
  projectId: "dataquest-xxxxx",
  storageBucket: "dataquest-xxxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123"
};

const TEACHER_EMAIL = "tu-correo@ucr.ac.cr";
```

### Paso 6 — Configurar las reglas de seguridad
Firestore Database → pestaña **Reglas**, y publica (cambiando el correo por el tuyo):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dataquest_scores/{scoreId} {
      allow create: if request.resource.data.playerName is string
                    && request.resource.data.playerName.size() > 0
                    && request.resource.data.playerName.size() < 40
                    && request.resource.data.score is number
                    && request.resource.data.score >= 0
                    && request.resource.data.score < 100000;
      allow read: if true;
      allow update: if false;
      allow delete: if request.auth != null
                    && request.auth.token.email == "tu-correo@ucr.ac.cr";
    }
  }
}
```

> Si ya tienes reglas para `scores` (de TradeQuest) en el mismo proyecto, simplemente agrega este segundo bloque `match /dataquest_scores/{scoreId} { ... }` dentro del mismo `match /databases/{database}/documents { }`, junto al de `scores`.

### Paso 7 — Probar y publicar
Prueba localmente con Live Server: juega una partida y confirma que aparece "🌐 Tabla global en vivo". Abre el sitio en otro navegador/celular, juega otra partida y verifica que aparece sola en la primera pantalla sin recargar — así confirmas que la competencia asíncrona funciona. Luego publica con cualquiera de las tres opciones de arriba.

> **Nota sobre seguridad:** la clave `apiKey` de Firebase es segura de exponer públicamente (es así por diseño en las apps web de Firebase); lo que realmente protege tus datos son las reglas de seguridad de Firestore de arriba. Si GitHub te muestra una alerta de "secreto expuesto" al subir `firebase-config.js`, es un aviso genérico y esperado — no necesitas rotar la clave, solo confirmar que las reglas estén bien publicadas.

### Modo de respaldo sin internet
Cada estudiante puede descargar su resultado con **"⬇️ Descargar mi resultado"** y la persona docente puede cargarlo con **"⬆️ Importar resultado(s)"** como respaldo si alguien se queda sin conexión a mitad de la partida (esto no se mezcla con la tabla global, solo evita perder ese resultado puntual).

## Personalización rápida

- **Colores**: variables al inicio de `css/styles.css` (`--accent`, `--accent-2`, `--coral`).
- **Tiempo por pregunta o puntaje**: `LEVEL_POINTS` y `LEVEL_TIME_SECONDS` en `js/game.js`.
- **Umbral de estrellas**: función `starsForAccuracy` en `js/game.js`.
- **Estaciones y preguntas**: `js/questions.js`.
- **Título y textos**: directamente en `index.html`.

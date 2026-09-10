/**
 * DataQuest — Configuración de la tabla de posiciones GLOBAL
 * =============================================================
 *
 * Por defecto, DataQuest guarda los puntajes solo en el navegador de cada
 * estudiante (modo local). Como la idea es que el grupo compita de forma
 * ASÍNCRONA —cada quien juega cuando puede, y todos ven una sola tabla que
 * se va llenando sola—, necesitas conectar una base de datos gratuita:
 * Firebase Firestore (de Google).
 *
 * Sigue la guía "Tabla de posiciones global (Firebase)" del README.md.
 * Son ~10-15 minutos, una sola vez, y no requiere tarjeta de crédito
 * (plan gratuito "Spark").
 *
 * ¿Ya configuraste Firebase para TradeQuest? Puedes usar el MISMO
 * proyecto de Firebase aquí: solo repite el Paso 4 y 5 de esa guía
 * (copiar el mismo objeto firebaseConfig) y listo. Cada juego guarda
 * sus puntajes en una colección separada, así que no se mezclan.
 *
 * Cuando termines, copia el objeto "firebaseConfig" que Firebase te
 * entrega y pégalo abajo, reemplazando los valores vacíos. Mientras
 * "apiKey" y "projectId" estén vacíos, el juego sigue funcionando
 * normalmente, pero con tabla LOCAL (por navegador) en vez de global.
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA9Ut8bHBXIplG5qEJVSpfmhErPaFOtcKs",
  authDomain: "xp0201-dataquest-ia-y-fuentes.firebaseapp.com",
  projectId: "xp0201-dataquest-ia-y-fuentes",
  storageBucket: "xp0201-dataquest-ia-y-fuentes.firebasestorage.app",
  messagingSenderId: "981456583190",
  appId: "1:981456583190:web:ab7482f59cbfcd98b41337"

};

// Correo de la persona docente autorizada a reiniciar la tabla global.
// Debe coincidir EXACTAMENTE con el usuario que crees en
// Firebase → Authentication → Users, y con la regla de seguridad de
// Firestore (ver README). Cámbialo si usas otro correo para administrar.
const TEACHER_EMAIL = "laura.sariego@ucr.ac.cr";

// No toques esta línea: detecta automáticamente si ya configuraste Firebase.
const FIREBASE_ENABLED = Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);

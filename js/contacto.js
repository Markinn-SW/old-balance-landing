// contacto.js — Validación nativa (sin librerías) del formulario de contacto.
// Idea clave: separar (1) las REGLAS de validación de (2) cómo se MUESTRAN los errores.

'use strict';

const form = document.getElementById('form-contacto');
const estado = document.getElementById('estado-form');
const contador = document.getElementById('contador');

// ---------- 1. REGLAS ----------
// Cada regla recibe el valor y devuelve un texto de error, o '' si todo está bien.

// Letras (incluye acentos y ñ), espacios, apóstrofes y guiones. Mínimo 2 caracteres.
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+)*$/;

// Formato básico: algo@dominio.ext (sin espacios). No prueba que el correo EXISTA, solo su forma.
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const reglas = {
  nombre(valor) {
    if (valor === '') return 'Escribe tu nombre.';
    if (valor.length < 2) return 'El nombre debe tener al menos 2 caracteres.';
    if (!REGEX_NOMBRE.test(valor)) return 'Usa solo letras (sin números ni símbolos).';
    return '';
  },
  correo(valor) {
    if (valor === '') return 'Escribe tu correo electrónico.';
    if (!REGEX_CORREO.test(valor)) return 'Formato no válido. Ejemplo: nombre@correo.com';
    return '';
  },
  mensaje(valor) {
    if (valor === '') return 'Escribe tu mensaje.';
    if (valor.length < 10) return `Faltan ${10 - valor.length} caracteres (mínimo 10).`;
    return '';
  },
  acepto(_valor, campo) {
    return campo.checked ? '' : 'Debes aceptar las políticas de privacidad.';
  },
};

// ---------- 2. PRESENTACIÓN ----------
function validarCampo(campo) {
  // trim() quita espacios al inicio/fin: "   " no debe contar como un nombre válido.
  const valor = campo.value.trim();
  const mensajeError = reglas[campo.name](valor, campo);

  const contenedorError = document.getElementById(`error-${campo.name}`);
  // textContent (NO innerHTML): inserta texto plano, así evitamos inyección de HTML (XSS).
  contenedorError.textContent = mensajeError;

  // aria-invalid avisa a lectores de pantalla; también lo usamos para el estilo CSS.
  campo.setAttribute('aria-invalid', mensajeError ? 'true' : 'false');
  return mensajeError === '';
}

const campos = [...form.elements].filter((el) => el.name in reglas);

// ---------- 3. EVENTOS ----------
// Al salir de un campo (blur) lo validamos; si ya tenía error, revalidamos mientras escribe.
campos.forEach((campo) => {
  campo.addEventListener('blur', () => validarCampo(campo));
  campo.addEventListener('input', () => {
    if (campo.getAttribute('aria-invalid') === 'true') validarCampo(campo);
  });
});

form.elements.mensaje.addEventListener('input', (e) => {
  contador.textContent = `${e.target.value.length} / 500`;
});

form.addEventListener('submit', (evento) => {
  evento.preventDefault(); // evita que la página se recargue

  // Se valida TODO (no usar .every directo: cortaría en el primer error y no mostraría los demás).
  const resultados = campos.map(validarCampo);
  const todoValido = resultados.every(Boolean);

  if (!todoValido) {
    estado.textContent = 'Revisa los campos marcados.';
    estado.className = 'estado estado-error';
    campos[resultados.indexOf(false)].focus(); // lleva el foco al primer error
    return;
  }

  // Aquí iría el envío real (fetch a un backend). En una landing estática solo simulamos.
  const datos = {
    nombre: form.elements.nombre.value.trim(),
    correo: form.elements.correo.value.trim(),
    mensaje: form.elements.mensaje.value.trim(),
  };
  console.log('Datos listos para enviar:', datos);

  estado.textContent = `¡Gracias, ${datos.nombre}! Recibimos tu mensaje.`;
  estado.className = 'estado estado-ok';
  form.reset();
  contador.textContent = '0 / 500';
  campos.forEach((c) => c.setAttribute('aria-invalid', 'false'));
});
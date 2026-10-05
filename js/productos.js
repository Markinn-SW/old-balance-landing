/* =====================================================
   ROL 2 · Interactividad de Productos y FAQ
   1) Filtro del catálogo
   2) Acordeón accesible
   3) Calculadora de talla
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  iniciarFiltros();
  iniciarAcordeon();
  iniciarCalculadora();
});

/* ---------- 1) Filtro del catálogo ---------- */
function iniciarFiltros() {
  const botones = document.querySelectorAll(".filtro");
  const cards = document.querySelectorAll("#catalogo .card");
  const vacio = document.getElementById("catalogo-vacio");
  if (!botones.length) return;

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const filtro = boton.dataset.filtro;

      botones.forEach((b) => {
        const activo = b === boton;
        b.classList.toggle("is-active", activo);
        b.setAttribute("aria-pressed", String(activo));
      });

      let visibles = 0;
      cards.forEach((card) => {
        const mostrar = filtro === "todos" || card.dataset.estilo === filtro;
        card.hidden = !mostrar;
        if (mostrar) visibles++;
      });

      if (vacio) vacio.hidden = visibles > 0;
    });
  });
}

/* ---------- 2) Acordeón ---------- */
function iniciarAcordeon() {
  const botones = document.querySelectorAll(".acordeon__boton");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const abierto = boton.getAttribute("aria-expanded") === "true";

      // Solo una pregunta abierta a la vez
      botones.forEach((otro) => cambiarEstado(otro, false));
      cambiarEstado(boton, !abierto);
    });
  });
}

function cambiarEstado(boton, abrir) {
  const panel = document.getElementById(boton.getAttribute("aria-controls"));
  boton.setAttribute("aria-expanded", String(abrir));
  if (panel) panel.classList.toggle("is-open", abrir);
}

/* ---------- 3) Calculadora de talla ---------- */
function iniciarCalculadora() {
  const form = document.getElementById("calculadora");
  const input = document.getElementById("largo-pie");
  const salida = document.getElementById("resultado-talla");
  const filas = document.querySelectorAll(".tabla-tallas tbody tr");
  if (!form || !input || !salida) return;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    filas.forEach((f) => f.classList.remove("is-match"));
    salida.classList.remove("is-error");

    const largo = parseFloat(input.value.replace(",", "."));

    if (Number.isNaN(largo) || largo < 22 || largo > 31) {
      salida.classList.add("is-error");
      salida.textContent = "Escribe un largo entre 22 y 31 cm.";
      return;
    }

    // Redondeamos hacia arriba a la media talla más cercana
    const mx = Math.ceil(largo * 2) / 2;
    const us = mx - 18;
    const eu = Math.round((mx * 1.5 + 2) * 2) / 2;

    salida.textContent = `Tu talla: MX ${mx} · US ${us} · EU ${eu}`;

    // Resalta la fila de la tabla que corresponde (si es talla entera)
    filas.forEach((fila) => {
      if (Number(fila.children[1].textContent) === Math.round(mx) && Number.isInteger(mx)) {
        fila.classList.add("is-match");
      }
    });
  });
}

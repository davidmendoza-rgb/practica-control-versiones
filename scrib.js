// ========================================================
// PARTE A — VALIDACIÓN DEL FORMULARIO DE CONTACTO
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-contacto');
  
  // Condicional de seguridad por si el script carga antes que el formulario
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Evita que la página recargue de forma automática
      
      
      const mensaje = document.getElementById('mensaje').value.trim();
      
      // 1. Validación básica de campos vacíos
      if (!nombre || !email || !mensaje) {
        mostrarMensaje('Por favor completa todos los campos.', 'error');
        return;
      }
      
      // 2. Validación del patrón de formato de email
      if (!validarEmail(email)) {
        mostrarMensaje('Escribe un correo electrónico válido.', 'error');
        return;
      }
      
      // 3. Procesamiento exitoso e inserción en almacenamiento
      guardarEnStorage({ nombre, email, mensaje });
      mostrarMensaje('¡Mensaje enviado correctamente! ✅', 'exito');
      
      form.reset(); // Limpia los inputs del formulario
      
      // Actualiza la visualización de la interfaz si el bonus está activo
      renderizarMensajesBonus();
    });
  }
  
  // Ejecución inicial del bonus al cargar la página por si hay datos previos
  renderizarMensajesBonus();
});

// ========================================================
// PARTE B — FUNCIONES AUXILIARES DE VALIDACIÓN
// ========================================================
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function mostrarMensaje(texto, tipo) {
  const el = document.getElementById('msg-respuesta');
  if (el) {
    el.textContent = texto;
    el.className = tipo === 'error' ? 'msg-error' : 'msg-exito';
  }
}

// ========================================================
// PARTE C — PERSISTENCIA DE DATOS CON LOCALSTORAGE
// ========================================================
function guardarEnStorage(datos) {
  // Recupera el listado existente en el navegador o inicia una matriz limpia
  const mensajes = JSON.parse(localStorage.getItem('mensajes-contacto')) || [];
  
  // Estampa de tiempo local en formato regional de México
  datos.fecha = new Date().toLocaleString('es-MX');
  
  mensajes.push(datos);
  localStorage.setItem('mensajes-contacto', JSON.stringify(mensajes));
}

// Función para visualización rápida mediante la consola del navegador
function verMensajesGuardados() {
  const mensajes = JSON.parse(localStorage.getItem('mensajes-contacto')) || [];
  console.table(mensajes);
}

// ========================================================
// CRITERIO BONUS — INTEGRACIÓN DINÁMICA EN EL DOM (+0.5 pts)
// ========================================================
function renderizarMensajesBonus() {
  const contenedor = document.getElementById('contenedor-mensajes-guardados');
  if (!contenedor) return;
  
  const mensajes = JSON.parse(localStorage.getItem('mensajes-contacto')) || [];
  
  if (mensajes.length === 0) {
    contenedor.innerHTML = '';
    return;
  }
  
  let htmlContenido = '<h3>Mensajes Recibidos (Registros Locales)</h3>';
  mensajes.forEach(msg => {
    htmlContenido += `
      <div style="border-left: 4px solid var(--color-acento); background: var(--color-fondo); padding: 10px; margin-top: 10px; border-radius: 4px;">
        <p><strong>Remitente:</strong> ${msg.nombre} (${msg.email})</p>
        <p><strong>Mensaje:</strong> ${msg.mensaje}</p>
        <p><small style="color: gray;">Enviado el: ${msg.fecha}</small></p>
      </div>
    `;
  });
  
  contenedor.innerHTML = htmlContenido;
}
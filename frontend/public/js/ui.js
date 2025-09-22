import { isLogged, getUser, logout } from "./auth.js"


// Mount navbar component
export function mountNavbar(activeLink = "") {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return;

  const loggedIn = isLogged();
  const user = loggedIn ? getUser() : null;

  // Enlaces centrales: abiertos siempre
  const openLinks = `
    <li><a href="./index.html" class="${activeLink === "inicio" ? "active" : ""}">Inicio</a></li>
    <li><a href="./sugerencias.html" class="${activeLink === "sugerencias" ? "active" : ""}">Sugerencias</a></li>
    <li><a href="./tutoriales.html" class="${activeLink === "tutoriales" ? "active" : ""}">Tutoriales</a></li>
  `;

  // Enlaces solo con sesión
  const privateLinks = loggedIn
    ? `
      <li><a href="./encuesta.html" class="${activeLink === "encuesta" ? "active" : ""}">Encuesta</a></li>
      <li><a href="./resultados.html" class="${activeLink === "resultados" ? "active" : ""}">Estadísticas</a></li>
    `
    : "";

  const rightActions = loggedIn
    ? `
      <div class="user-badge"><span>👤 ${user?.name || "Usuario"}</span></div>
      <button type="button" class="btn btn-outline" id="logoutBtn">Cerrar sesión</button>
    `
    : `
      <a href="./auth.html" class="btn btn-outline">Iniciar sesión</a>
      <a href="./auth.html#register" class="btn btn-accent">Registrarse</a>
    `;

  navbarContainer.innerHTML = `
    <nav class="navbar" role="navigation" aria-label="Principal">
      <div class="container">
        <div class="navbar-content">
          <a href="./index.html" class="navbar-brand">
            <div class="navbar-brand-icon">💡</div>
            Emprende Digital
          </a>
          <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="navMenu">☰</button>
          <ul id="navMenu" class="navbar-nav">
            ${openLinks}
            ${privateLinks}
          </ul>
          <div class="navbar-actions">
            ${rightActions}
          </div>
        </div>
      </div>
    </nav>
  `;

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  // Menú hamburguesa (móvil)
  const toggle = navbarContainer.querySelector(".nav-toggle");
  const menu = navbarContainer.querySelector("#navMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("open", !open);
    });
  }

  // Re-render cuando cambie el estado de auth
  window.addEventListener("authStateChanged", () => mountNavbar(activeLink), { once: true });
}


// Utility functions for common UI patterns
export function showLoading(element, message = "Cargando...") {
  if (element) {
    element.innerHTML = `<div class="loading">${message}</div>`
  }
}

export function showError(element, message = "Ha ocurrido un error") {
  if (element) {
    element.innerHTML = `<div class="error">${message}</div>`
  }
}

export function showNoResults(element, message = "No se encontraron resultados") {
  if (element) {
    element.innerHTML = `<div class="no-results">${message}</div>`
  }
}

// Form validation helpers
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePassword(password) {
  return password && password.length >= 6
}

// Accessibility helpers
export function announceToScreenReader(message) {
  const announcement = document.createElement("div")
  announcement.setAttribute("aria-live", "polite")
  announcement.setAttribute("aria-atomic", "true")
  announcement.className = "sr-only"
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Smooth scroll to element
export function scrollToElement(elementId, offset = 0) {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}

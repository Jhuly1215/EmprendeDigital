// Authentication utilities using localStorage

// Session management
export function setSession({ token, user }) {
  localStorage.setItem("auth_token", token)
  localStorage.setItem("auth_user", JSON.stringify(user))
  syncNav()
}

export function clearSession() {
  localStorage.removeItem("auth_token")
  localStorage.removeItem("auth_user")
  syncNav()
}

export function isLogged() {
  return !!localStorage.getItem("auth_token")
}

export function getUser() {
  const userStr = localStorage.getItem("auth_user")
  return userStr ? JSON.parse(userStr) : null
}

export function getToken() {
  return localStorage.getItem("auth_token")
}

// Route protection
export function requireAuth(redirect = "/auth.html") {
  if (!isLogged()) {
    const currentPath = window.location.pathname + window.location.search
    window.location.href = `${redirect}?next=${encodeURIComponent(currentPath)}`
    return false
  }
  return true
}

// Logout
export function logout() {
  clearSession()
  window.location.href = "/index.html"
}

// Sync navbar state
export function syncNav() {
  // This will be called by the navbar component
  const event = new CustomEvent("authStateChanged", {
    detail: { isLogged: isLogged(), user: getUser() },
  })
  window.dispatchEvent(event)
}

// Initialize auth state sync
window.addEventListener("storage", (e) => {
  if (e.key === "auth_token" || e.key === "auth_user") {
    syncNav()
  }
})

export const API_BASE = "http://localhost:8000/api"

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const token = localStorage.getItem("auth_token")

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Health check
export async function health() {
  try {
    const response = await fetch(`${API_BASE}/health`)
    return response.ok
  } catch (error) {
    return false
  }
}

// Authentication
export async function register(name, email, password) {
  try {
    return await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function login(email, password) {
  try {
    return await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function me() {
  try {
    return await apiRequest("/me")
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

// Survey
export async function getSurvey() {
  try {
    return await apiRequest("/survey")
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function getStats() {
  try {
    return await apiRequest("/survey/stats")
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function saveResponses(answers) {
  try {
    return await apiRequest("/responses", {
      method: "POST",
      body: JSON.stringify({ answers }),
    })
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

// Diagnosis
export async function getDiagnosis(userId) {
  try {
    return await apiRequest(`/diagnosis/${userId}`)
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

// Content
export async function listPlatforms() {
  try {
    return await apiRequest("/content/platforms")
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function listTutorials(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/content/tutorials${queryString ? `?${queryString}` : ""}`
    return await apiRequest(endpoint)
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

// Simple user authentication state
// This is a client-side only implementation

const VALID_USERNAME = 'admin'
const VALID_PASSWORD = 'admin@0000'

export const validateCredentials = (username, password) => {
  return username === VALID_USERNAME && password === VALID_PASSWORD
}

export const isLoggedIn = () => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('admin_logged_in') === 'true'
}

export const setLoggedIn = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_logged_in', 'true')
  }
}

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_logged_in')
  }
}

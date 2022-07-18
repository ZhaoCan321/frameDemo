
const TokenKey = 'Token'
const TokenTypeKey = 'Token-Type'

export function getToken () {
  return localStorage.getItem(TokenKey)
}

export function getTokenType () {
  return localStorage.getItem(TokenTypeKey)
}

export function getSessionStorageData (key) {
  return JSON.parse(window.sessionStorage.getItem(key)) || null
}

export function setSessionStorageData (key, data) {
  return window.sessionStorage.setItem(key, JSON.stringify(data))
}

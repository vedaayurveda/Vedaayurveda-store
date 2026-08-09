// Guest session_id handling — used to associate a guest's cart with
// their account once they log in or sign up.

const GUEST_SESSION_KEY = 'veda_guest_session_id'

export function getOrCreateGuestSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(GUEST_SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(GUEST_SESSION_KEY, id)
  }
  return id
}

export function clearGuestSessionId() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(GUEST_SESSION_KEY)
}

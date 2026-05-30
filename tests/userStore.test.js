import { describe, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'

describe('useUserStore', () => {
  it('starts with empty token when localStorage is empty', () => {
    localStorage.clear()
    setActivePinia(createPinia())
    const store = useUserStore()
    expect(store.isLoggedIn).toBe(false)
  })

  it('logout clears token and user', () => {
    localStorage.setItem('token', 'test-token')
    localStorage.setItem('user', JSON.stringify({ username: 'admin' }))
    setActivePinia(createPinia())
    const store = useUserStore()
    store.logout()
    expect(store.token).toBe('')
    expect(store.user).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })
})

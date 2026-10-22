import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'campx.session'

/**
 * Demo credential table. In production this is replaced by the
 * `/api/auth/login` endpoint exposed by the CampX auth service.
 */
export const DEMO_USERS = [
  {
    username: 'admin',
    password: 'admin@123',
    role: 'admin',
    name: 'Dr. Anil Kumar',
    email: 'admin@mgit.edu.in',
    designation: 'Principal',
    department: 'Administration',
  },
  {
    username: 'faculty',
    password: 'faculty@123',
    role: 'faculty',
    name: 'Prof. Ramesh Sharma',
    email: 'ramesh.sharma@mgit.edu.in',
    designation: 'Associate Professor',
    department: 'Physics',
  },
  {
    username: 'student',
    password: 'student@123',
    role: 'student',
    name: 'Priya S.',
    email: '21CS042@mgit.edu.in',
    designation: 'B.Tech CSE',
    department: 'Computer Science & Engineering',
  },
  {
    username: 'accounts',
    password: 'accounts@123',
    role: 'finance',
    name: 'S. Venkatesh',
    email: 'accounts@mgit.edu.in',
    designation: 'Finance Officer',
    department: 'Accounts',
  },
]

const ROLE_LABELS = {
  admin: 'Administrator',
  faculty: 'Faculty',
  student: 'Student',
  finance: 'Finance Officer',
  staff: 'Staff',
  parent: 'Parent',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // loading | authed | anon
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Restore persisted session on boot
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && parsed.username) {
          setUser(parsed)
          setStatus('authed')
          return
        }
      }
    } catch {
      /* corrupted storage — fall through to anonymous */
    }
    setStatus('anon')
  }, [])

  const login = useCallback(async ({ username, password, remember }) => {
    setIsSubmitting(true)
    setError(null)

    // Simulate network latency of the auth gateway
    await new Promise((resolve) => setTimeout(resolve, 900))

    const found = DEMO_USERS.find(
      (u) =>
        u.username.toLowerCase() === String(username).trim().toLowerCase() ||
        u.email.toLowerCase() === String(username).trim().toLowerCase(),
    )

    if (!found || found.password !== password) {
      setIsSubmitting(false)
      const message = 'Invalid credentials. Please check your username and password.'
      setError(message)
      throw new Error(message)
    }

    const session = {
      username: found.username,
      name: found.name,
      email: found.email,
      role: found.role,
      roleLabel: ROLE_LABELS[found.role] || found.role,
      designation: found.designation,
      department: found.department,
      avatar: found.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      institution: 'MAHATMA GANDHI INSTITUTE OF TECHNOLOGY',
      issuedAt: Date.now(),
    }

    setUser(session)
    setStatus('authed')
    setIsSubmitting(false)

    if (remember) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    }

    return session
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
    window.sessionStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setStatus('anon')
  }, [])

  const value = useMemo(
    () => ({
      user,
      status,
      error,
      isSubmitting,
      login,
      logout,
      setError,
      roleLabels: ROLE_LABELS,
    }),
    [user, status, error, isSubmitting, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

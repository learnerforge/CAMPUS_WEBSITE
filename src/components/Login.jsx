import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import CampXLogo from './brand/CampXLogo'
import './Login.css'

const DEMO_ACCOUNTS = [
  ['admin', 'admin@123', 'Administrator'],
  ['faculty', 'faculty@123', 'Faculty'],
  ['student', 'student@123', 'Student'],
  ['accounts', 'accounts@123', 'Finance'],
]

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const { login, user, status } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (status === 'authed' && user) {
      navigate(user.role === 'student' ? '/app/portal' : '/app/dashboard', { replace: true })
    }
  }, [status, user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username.trim() || !password) {
      toast.error('Please enter both your username and password.')
      return
    }

    setIsLoading(true)
    try {
      const session = await login({ username, password, remember })
      navigate(session.role === 'student' ? '/app/portal' : '/app/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSso = (provider) => {
    toast.info(`${provider} single sign-on is not configured in this environment.`)
  }

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true">
        <img className="login-bg__img" src="/hero-the-hour.jpg" alt="" />
        <div className="login-bg__scrim" />
      </div>

      <div className="login-card">
        <div className="login-card__body">
          <div className="login-head">
            <span className="login-logo">
              <CampXLogo />
            </span>

            <div className="login-title">
              <h4 className="login-title__h">Welcome back</h4>
              <p className="login-title__sub">
                Sign in to continue to{' '}
                <strong>MAHATMA GANDHI INSTITUTE OF TECHNOLOGY</strong>
              </p>
            </div>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-fields">
              <div className="login-field">
                <label className="login-label" htmlFor="login-username">
                  <span className="login-label__req">*</span> Username or email
                </label>
                <input
                  className="login-input"
                  type="text"
                  id="login-username"
                  name="username"
                  placeholder="Enter your username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="login-password">
                  <span className="login-label__req">*</span> Password
                </label>
                <div className="login-field__wrap">
                  <input
                    className="login-input login-input--pw"
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-eye"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={isLoading}>
              {isLoading ? <span className="login-spinner" aria-hidden="true" /> : 'Sign in'}
            </button>

            <div className="login-forgot">
              <a
                href="#/app/forgot-password"
                onClick={(e) => {
                  e.preventDefault()
                  toast.info('Password reset links are sent to your registered email address.')
                }}
              >
                Forgot password?
              </a>
            </div>
          </form>

          <div className="login-sep" role="separator">
            <span className="login-sep__line" />
            <span className="login-sep__label">or</span>
            <span className="login-sep__line" />
          </div>

          <div className="login-sso">
            <button type="button" className="login-sso-btn" onClick={() => handleSso('Google')}>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>

            <button type="button" className="login-sso-btn" onClick={() => handleSso('Microsoft')}>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
              </svg>
              Sign in with Microsoft
            </button>
          </div>

          {/* Replica-only affordances — not present on the live portal. */}
          <div className="login-demo">
            <div className="login-demo__head">
              <span className="login-demo__label">Demo access</span>
              <label className="login-demo__remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Keep me signed in</span>
              </label>
            </div>
            <div className="login-demo__grid">
              {DEMO_ACCOUNTS.map(([u, p, role]) => (
                <button
                  type="button"
                  key={u}
                  className="demo-chip"
                  onClick={() => {
                    setUsername(u)
                    setPassword(p)
                  }}
                  title={`Use ${u} / ${p}`}
                >
                  <strong>{role}</strong>
                  <span>
                    {u} / {p}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

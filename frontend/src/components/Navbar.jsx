import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const Navbar = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    // TODO: Clear auth token / Redux state
    navigate('/auth')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
            Zomish
          </h2>
        </div>

        <div className="nav-right">
          <button className="theme-toggle">🌙</button>
          
          <div className="user-menu">
            <button className="user-avatar" onClick={() => setShowDropdown(!showDropdown)}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, var(--accent), var(--accent-2))`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <p style={{ margin: 0, fontWeight: 600, color: '#222' }}>{user?.name || 'User'}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--muted)' }}>{user?.email}</p>
                </div>
                <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid rgba(0,0,0,0.06)' }} />
                <button className="dropdown-item">👤 My Profile</button>
                <button className="dropdown-item">📋 Orders</button>
                <button className="dropdown-item">❤️ Saved</button>
                <button className="dropdown-item">⚙️ Settings</button>
                <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid rgba(0,0,0,0.06)' }} />
                <button className="dropdown-item logout" onClick={handleLogout}>🚪 Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
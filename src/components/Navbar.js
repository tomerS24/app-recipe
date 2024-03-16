import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

// styles
import './Navbar.css'
import Avatar from './Avatar'

export default function Navbar ({ user, handleLogout }) {
  const { color } = useTheme()

  return (
    <div className="navbar" style={{ background: color }}>
      <nav>
        <Link to="/" className="brand">
          <h1>Tomer App Recipes</h1>
        </Link>
        {!user && (
          <>
            <Link className="customLink" to="/login">login</Link>
            <Link className="customLink" to="/signup">signup</Link>
          </>
        )}

        {user && (
          <>
            <Link className="customLink" to="/create">Create Recipe</Link>
            <Link className="customLink" to="/" onClick={handleLogout}>Logout</Link>
            <div style={{ marginLeft: "20px" }}>
              <Avatar src={'https://cdn-icons-png.flaticon.com/512/149/149071.png'} title={user.displayName} />
            </div>
          </>
        )}
        
      </nav>
    </div>
  )
}

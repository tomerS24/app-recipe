import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { projectAuth } from './firebase/config'

// page components
import Navbar from './components/Navbar'
import Home from './pages/home/Home'
import Create from './pages/create/Create'
import Search from './pages/search/Search'
import Recipe from './pages/recipe/Recipe'
import Login from './pages/login/Login'

// styles
import './App.css'
import Signup from './pages/signup/Signup'
import NotFound from './pages/notfound/NotFound'
import Update from './pages/update/Update'

function App() {
  const { mode } = useTheme()
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    projectAuth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleLogout = () => {
    projectAuth.signOut().then(() => {
      setUser(null);
      navigate("/login");
    });
  };

  return (
    <div className={`App ${mode}`}>
        <Navbar 
        user={user}
        handleLogout={handleLogout}
        />
        <Routes>
          <Route exact 
            path="/" 
            element={<Home user={user} />}
          />
          <Route 
            path="/create"
            element={ user?.uid ? <Create user={user} /> : <Navigate to="/" />}
          />
           <Route 
            path="/update/:id"
            element={ user?.uid ? <Update user={user} /> : <Navigate to="/" />}
          />
          <Route 
            path="/search"
            element={<Search user={user} />}
          />
          <Route
            path="/recipes/:id"
            element={ user?.uid ? <Recipe user={user}/> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={ user ? <Navigate to="/" /> : <Login setUser={setUser} />}
          />
          <Route
            path="/signup"
            element={ user?.uid ? <Navigate to="/" /> : <Signup setUser={setUser} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </div>
  );
}

export default App
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

// styles
import './Login.css'
import { projectAuth } from '../../firebase/config';

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Login({ setActive, setUser }) {
  const [state, setState] = useState(initialState);
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { email, password } = state;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    try {
      if (email && password) {
        const { user } = await projectAuth.signInWithEmailAndPassword(email, password);
        setUser(user);
        //setActive("home");
        navigate("/");
      } else {
        setError("All fields are mandatory to fill");
      }
    }catch(err) {
      setError("The email or password is incorrect")
    }
    setIsPending(false);
  }

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>login</h2>
      <label>
        <span>email:</span>
        <input
          required
          type="email" 
          name="email"
          onChange={(e) => handleChange(e)} 
          value={email} 
        />
      </label>
      <label>
        <span>password:</span>
        <input 
          required
          type="password"
          name="password" 
          onChange={(e) => handleChange(e)} 
          value={password} 
        />
      </label>
      {!isPending && <button className="btn">Log in</button>}
      {isPending && <button className="btn" disabled>loading</button>}
      {error && <div className="error">{error}</div>}
    </form>
  )
}

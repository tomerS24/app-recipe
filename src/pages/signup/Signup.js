import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { collectionNames, projectAuth, projectFirestore } from '../../firebase/config';

// styles
import './Signup.css'

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Signup({ setActive, setUser }) {
  const [state, setState] = useState(initialState);
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { email, password, firstName, lastName, confirmPassword } = state;

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    try {
      if (password !== confirmPassword) {
        setError("Password don't match");
      }
      else if (firstName && lastName && email && password) {
        const res = await projectAuth.createUserWithEmailAndPassword(email, password);
        if (!res) {
          return setError('Could not complete signup');
        }
        const displayName = `${firstName} ${lastName}`;
        await res.user.updateProfile({ displayName });
        // create a user document
        await projectFirestore.collection(collectionNames.users).doc(res.user.uid).set({ 
          online: true,
          displayName,
        })
        navigate("/");
      }
      else {
        setError("All fields are mandatory to fill");
      }
    }catch(err) {
      console.log(err);
      setError("Some error occurred")
    }
    setIsPending(false);
  }

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>sign up</h2>
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
        <span>First name:</span>
        <input
          required
          type="text"
          name="firstName" 
          onChange={(e) => handleChange(e)} 
          value={firstName}
        />
      </label>
      <label>
        <span>Last name:</span>
        <input
          required
          type="text"
          name="lastName" 
          onChange={(e) => handleChange(e)} 
          value={lastName}
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
      <label>
        <span>confirmPassword:</span>
        <input
          required
          type="password" 
          name="confirmPassword" 
          onChange={(e) => handleChange(e)} 
          value={confirmPassword}
        />
      </label>
      {!isPending && <button className="btn">Sign Up</button>}
      {isPending && <button className="btn" disabled>loading</button>}
      {error && <div className="error">{error}</div>}
    </form>
  )
}

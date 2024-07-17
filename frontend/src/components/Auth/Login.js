import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import loginpageimage from '../../assets/loginpageimage.jpg'; // Import the image

const Login = () => {
  const { login } = useAuth();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      setMessage('Login successful! Redirecting to dashboard...');

      // Redirect based on role
      setTimeout(() => {
        switch (user.role) {
          case 'admin':
            history.push('/admin-dashboard');
            break;
          case 'consultant':
            history.push('/consultant-dashboard');
            break;
          default:
            history.push('/dashboard');
            break;
        }
      }, 2000);
    } catch (error) {
      setMessage('Login failed: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <h2 style={styles.h2}>Login</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.div}>
          <label style={styles.label}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.div}>
          <label style={styles.label}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
        </div>
        <button
          type="submit"
          style={isHovering ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          Login
        </button>
        <div style={styles.additionalOptions}>
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="/forgot-password" style={styles.link}>Forgot password?</a>
        </div>
        <footer style={styles.footer}>
          Not a member? <a href="/signup" style={styles.link}>Signup Now</a>
        </footer>
      </form>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    overflow: 'hidden',
    textAlign: 'center',
    marginTop: '-10px',
    marginLeft: '-10px',
    marginRight: '-10px',
    marginBottom: '-10px',
    flex: 1
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `url(${loginpageimage}) no-repeat center center fixed`,
    backgroundSize: 'cover',
    filter: 'blur(4px)',
    zIndex: -1,
  },
  h2: {
    color: '#333',
    marginBottom: '20px',
    fontWeight: 'bold',
    fontSize: '50px',
  },
  form: {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '70px 50px',
    borderRadius: '10px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
    width: '100%',
    maxWidth: '450px',
    zIndex: 1,
    position: 'relative',
  },
  div: {
    marginBottom: '30px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '30px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box',
    marginBottom: '20px',
    marginTop: '-60px',
  },
  button: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#ef6108', // Orange color
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  buttonHover: {
    backgroundColor: 'black', // Darker color on hover
  },
  additionalOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
  },
  link: {
    color: '#ef6108',
    textDecoration: 'none',
    fontSize: '14px',
  },
  footer: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#777',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: '20px', // Adjust as necessary
    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
  },
  message: {
    color: 'red',
    fontStyle: 'italic',
  }
};

export default Login;

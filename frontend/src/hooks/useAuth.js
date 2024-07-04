import { useState, useContext, createContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

const useProvideAuth = () => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
        localStorage.setItem('token', data.token);
        const loggedInUser = { email, role: decodedToken.user.role, fullName: decodedToken.user.fullName };
        setUser(loggedInUser);
        return loggedInUser; // Return the user object
      } else {
        const error = await response.json();
        throw new Error(error.msg || 'Login failed');
      }
    } catch (error) {
      throw new Error('Server error: ' + error.message);
    }
  };
  const signup = async (fullName, email, password, role) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, role }),
      });

      if (response.ok) {
        const data = await response.json();
        const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
        localStorage.setItem('token', data.token);
        setUser({ email, role: decodedToken.user.role, fullName: decodedToken.user.fullName });
      } else {
        const error = await response.json();
        throw new Error(error.msg || 'Signup failed');
      }
    } catch (error) {
      throw new Error('Server error: ' + error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return {
    user,
    login,
    signup,
    logout,
  };
};

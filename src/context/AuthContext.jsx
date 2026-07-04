import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password, displayName) {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.email === email)) {
          const err = new Error('Email already registered');
          err.code = 'auth/email-already-in-use';
          return reject(err);
        }
        const newUser = {
          uid: 'user_' + Math.random().toString(36).substr(2, 9),
          email,
          displayName,
        };
        users.push({ ...newUser, password });
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setCurrentUser(newUser);
        resolve(newUser);
      } catch (err) {
        reject(err);
      }
    });
  }

  function login(email, password) {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);
        if (!user) {
          const err = new Error('No account found');
          err.code = 'auth/user-not-found';
          return reject(err);
        }
        if (user.password !== password) {
          const err = new Error('Invalid password');
          err.code = 'auth/wrong-password';
          return reject(err);
        }
        const loggedUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        };
        localStorage.setItem('currentUser', JSON.stringify(loggedUser));
        setCurrentUser(loggedUser);
        resolve(loggedUser);
      } catch (err) {
        reject(err);
      }
    });
  }

  function loginWithGoogle() {
    return new Promise((resolve) => {
      const googleUser = {
        uid: 'google_' + Math.random().toString(36).substr(2, 9),
        email: 'googleuser@gmail.com',
        displayName: 'Google User',
      };
      localStorage.setItem('currentUser', JSON.stringify(googleUser));
      setCurrentUser(googleUser);
      resolve(googleUser);
    });
  }

  function logout() {
    return new Promise((resolve) => {
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      resolve();
    });
  }

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing cached user:', e);
      }
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


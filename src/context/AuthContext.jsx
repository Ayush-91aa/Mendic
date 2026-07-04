import { createContext, useContext } from 'react';
import { useUser, useClerk } from '@clerk/react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { user, isLoaded } = useUser();
  const { signOut, openSignIn, openSignUp } = useClerk();

  const currentUser = user ? {
    uid: user.id,
    email: user.primaryEmailAddress?.emailAddress || '',
    displayName: user.fullName || user.firstName || user.username || '',
  } : null;

  const login = () => openSignIn();
  const signup = () => openSignUp();
  const loginWithGoogle = () => openSignIn();
  const logout = () => signOut();

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading: !isLoaded,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


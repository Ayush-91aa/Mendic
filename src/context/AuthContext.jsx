import { createContext, useContext } from 'react';
import { useUser, useClerk } from '@clerk/react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { user, isLoaded } = useUser();
  const { signOut, openSignIn, openSignUp } = useClerk();

  const email = user?.primaryEmailAddress?.emailAddress || '';
  const isAdminEmail = [
    'mendicindia@gmail.com',
    'divyaprakashsinghchauhan1234@gmail.com',
    'dpsc90071@gmail.com',
    'modulusfunctio9@gmail.com'
  ].includes(email.toLowerCase());

  const currentUser = user ? {
    uid: user.id,
    email: email,
    displayName: user.fullName || user.firstName || user.username || '',
    role: user.publicMetadata?.role || (isAdminEmail ? 'admin' : 'customer'),
    verificationStatus: user.publicMetadata?.verification_status || null,
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


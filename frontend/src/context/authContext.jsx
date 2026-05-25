import { createContext, useCallback, useEffect, useState } from 'react';
import { getUserProfile } from '../services/user.service';
import { getToken, setToken, removeToken } from '../utils/auth';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // --- ESTABLECER USUARIO Y TOKEN AL LOGUEAR ---
  const handleSetUser = useCallback((authData) => {
    if (authData.token) {
      setToken(authData.token);
      setTokenState(authData.token);
    }
    if (authData.user) {
      const normalizedUser = authData.user.user ? authData.user.user : authData.user;
      setUser(normalizedUser);
    }
  }, []);

  // --- LOGOUT ---
  const handleLogout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUser(null);
  }, []);

  // --- AL CARGAR LA APP, COMPROBAMOS SI HAY TOKEN ---
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = getToken();

      if (!storedToken) {
        setIsAuthLoading(false);
        return;
      }

      setTokenState(storedToken);
      try {
        const profileResponse = await getUserProfile();
        const profileData = profileResponse.data;
        const normalizedUser = profileData.user ? profileData.user : profileData;
        setUser(normalizedUser);
      } catch (error) {
        handleLogout();
        console.error("Error al validar token:", error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkToken();
  }, [handleLogout]);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      handleSetUser,
      handleLogout,
      isAuthenticated,
      isAuthLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
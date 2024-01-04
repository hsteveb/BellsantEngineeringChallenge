import React, { FC, PropsWithChildren, useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';

export const AuthContext = React.createContext({ user: null });
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
}

const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return <AuthContext.Provider value={{ user }}>
    { children }
  </AuthContext.Provider>
}

export default AuthContextProvider;

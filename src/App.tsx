import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import HomeScreen from './components/homescreen/HomeScreen';
import LoginScreen from './components/loginscreen/LoginScreen';
import {BACKEND_URL, COOKIE_DOMAIN} from './globals';
import './App.scss';
import {User} from './types';

const App = (): ReactElement => {
  const [cookies, setCookie, removeCookie] = useCookies(['user_id']);
  const [user, setUser] = useState<User>();

  const updateUser = useCallback(() => {
    if (cookies.user_id) {
      fetch(
        BACKEND_URL + '/user/me',
        {
          method: 'GET',
          credentials: 'include'
        }
      )
        .then((response) => response.json())
        .then((result: User) => {
          setUser(result);
        })
        .catch((error) => {
          console.error('Error:', error);
          removeCookie('user_id');
          setUser(undefined);
        });
    }
  }, [cookies.user_id, removeCookie]);
  
  const login = (userId: number) => {
    setCookie('user_id', userId, {domain: COOKIE_DOMAIN});
    updateUser();
  };
  const logout = () => {
    removeCookie('user_id');
    setUser(undefined);
  };

  useEffect(() => {
    updateUser();
  }, [updateUser]);

  return (
    user
      ? <HomeScreen user={user} logout={logout}/>
      : <LoginScreen login={login}/>
  );
};

export default App;

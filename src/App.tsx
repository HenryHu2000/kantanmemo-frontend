import React, {ReactElement, useCallback, useEffect, useMemo, useState} from 'react';
import {useCookies} from 'react-cookie';
import {CookieSetOptions} from 'universal-cookie';
import HomeScreen from './components/homescreen/HomeScreen';
import LoginScreen from './components/loginscreen/LoginScreen';
import {BACKEND_URL, COOKIE_DOMAIN} from './globals';
import './App.scss';
import {User} from './types';

const App = (): ReactElement => {
  const [cookies, setCookie, removeCookie] = useCookies(['user_id']);
  const [user, setUser] = useState<User>();
  const cookieSetOptions: CookieSetOptions 
    = useMemo<CookieSetOptions>(() => ({domain: COOKIE_DOMAIN, sameSite: 'lax'}), []);
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
          removeCookie('user_id', cookieSetOptions);
          setUser(undefined);
        });
    }
  }, [cookieSetOptions, cookies.user_id, removeCookie]);
  
  const login = (userId: number) => {
    setCookie('user_id', userId, cookieSetOptions);
    updateUser();
  };

  const logout = () => {
    removeCookie('user_id', cookieSetOptions);
    setUser(undefined);
  };

  useEffect(() => {
    updateUser();
  }, [updateUser]);

  return (
    <div className="App">
      {user
        ? (<HomeScreen user={user} setUser={setUser} logout={logout}/>)
        : (<LoginScreen login={login}/>)
      }
    </div>
  );
};

export default App;

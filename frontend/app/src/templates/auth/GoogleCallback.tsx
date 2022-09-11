import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory, useLocation } from 'react-router-dom';
import Loading from '../../components/loading/Loading';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

const GoogleCallback = () => {
  const location = useLocation();
  const [cookies, setCookie] = useCookies();
  const history = useHistory();

  useEffect(() => {
    fetch(`${apiUrl}api/auth/callback${location.search}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.type === 'login') {
          setCookie('Bearer', data.access_token);
          history.push('/mypage');
        } else if (data.type === 'create') {
          setCookie('Bearer', data.access_token);
          history.push('/profile');
        }
      });
  }, []);

  return (
    <div className="h-screen">
      <Loading title="Loading..." />
    </div>
  );
};

export default GoogleCallback;

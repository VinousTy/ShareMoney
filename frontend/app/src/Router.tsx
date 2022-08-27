import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import SignIn from './templates/auth/SignIn';
import SignUp from './templates/auth/SignUp';
import TestPage from './TestPage';

const Router: React.VFC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/signin" component={SignIn} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;

import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import EmailPost from './templates/auth/EmailPost';
import PasswordReset from './templates/auth/PasswordReset';
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
        <Route exact path="/reset" component={EmailPost} />
        <Route path={'/password/reset(/?token=)?'} component={PasswordReset} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;

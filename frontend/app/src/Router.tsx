import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import AccountBookDetail from './templates/accountBook/AccountBookDetail';
import AccountBookForm from './templates/accountBook/AccountBookForm';
import AccountBookList from './templates/accountBook/AccountBookList';
import EmailPost from './templates/auth/EmailPost';
import PasswordReset from './templates/auth/PasswordReset';
import SignIn from './templates/auth/SignIn';
import SignUp from './templates/auth/SignUp';
import Error from './templates/error/Error';
import MyPage from './templates/mypage/MyPage';
import Profile from './templates/profile/Profile';
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
        <Route path="/profile(/:id)?" component={Profile} />
        <Route path="/accountBook/regist(/:id)?" component={AccountBookForm} />
        <Route exact path="/mypage" component={MyPage} />
        <Route exact path="/accountBook/list" component={AccountBookList} />
        <Route
          path="/accountBook/detail(/:id)?"
          component={AccountBookDetail}
        />
        <Route exact path="*" component={Error} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;

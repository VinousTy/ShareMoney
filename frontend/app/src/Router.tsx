import React from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import { selectIsSignIn } from './features/auth/authSlice';
import AccountBookDetail from './templates/accountBook/AccountBookDetail';
import AccountBookForm from './templates/accountBook/AccountBookForm';
import AccountBookList from './templates/accountBook/AccountBookList';
import BookmarkAccountBookList from './templates/accountBook/BookmarkAccountBookList';
import EmailPost from './templates/auth/EmailPost';
import GoogleCallback from './templates/auth/GoogleCallback';
import PasswordReset from './templates/auth/PasswordReset';
import SignIn from './templates/auth/SignIn';
import SignUp from './templates/auth/SignUp';
import Contact from './templates/contact/Contact';
import Error from './templates/error/Error';
import Home from './templates/home/Home';
import MyPage from './templates/mypage/MyPage';
import PrivacyPolicy from './templates/privacyPolicy/PrivacyPolicy';
import Profile from './templates/profile/Profile';
import TermsOfService from './templates/termsOfService/TermsOfService';
import TestPage from './TestPage';

const Router: React.VFC = () => {
  const signIn = useSelector(selectIsSignIn);
  const [cookies] = useCookies();

  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/signup">
          {!signIn && cookies.Bearer === undefined ? (
            <SignUp />
          ) : (
            <Redirect to="/mypage" />
          )}
        </Route>
        <Route exact path="/signin">
          {!signIn && cookies.Bearer === undefined ? (
            <SignIn />
          ) : (
            <Redirect to="/mypage" />
          )}
        </Route>
        <Route exact path="/reset">
          {!signIn && cookies.Bearer === undefined ? (
            <EmailPost />
          ) : (
            <Redirect to="/mypage" />
          )}
        </Route>
        <Route path={'/password/reset(/?token=)?'}>
          {!signIn && cookies.Bearer === undefined ? (
            <PasswordReset />
          ) : (
            <Redirect to="/mypage" />
          )}
        </Route>
        <Route path="/auth/google">
          {!signIn && cookies.Bearer === undefined ? (
            <GoogleCallback />
          ) : (
            <Redirect to="/mypage" />
          )}
        </Route>
        <Route path="/profile(/:id)?">
          {cookies.Bearer !== undefined ? (
            <Profile />
          ) : (
            <Redirect to="/signin" />
          )}
        </Route>
        <Route path="/accountBook/regist(/:id)?">
          {cookies.Bearer !== undefined ? (
            <AccountBookForm />
          ) : (
            <Redirect to="/signin" />
          )}
        </Route>
        <Route exact path="/mypage">
          {cookies.Bearer !== undefined ? (
            <MyPage />
          ) : (
            <Redirect to="/signin" />
          )}
        </Route>
        <Route exact path="/accountBook/list">
          {cookies.Bearer !== undefined ? (
            <AccountBookList />
          ) : (
            <Redirect to="/signin" />
          )}
        </Route>
        <Route path="/accountBook/detail(/:id)?">
          {cookies.Bearer !== undefined ? (
            <AccountBookDetail />
          ) : (
            <Redirect to="/signin" />
          )}
        </Route>
        <Route exact path="/home">
          {cookies.Bearer !== undefined ? <Home /> : <Redirect to="/signin" />}
        </Route>
        <Route exact path="/bookmark/accountBook/list">
          {cookies.Bearer !== undefined ? (
            <BookmarkAccountBookList />
          ) : (
            <Redirect to="/signin" />
          )}
        </Route>
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/privacy" component={PrivacyPolicy} />
        <Route exact path="/terms" component={TermsOfService} />
        <Route exact path="*" component={Error} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;

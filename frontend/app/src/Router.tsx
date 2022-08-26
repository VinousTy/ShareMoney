import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import TestPage from './TestPage';

const Router: React.VFC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/test" component={TestPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;

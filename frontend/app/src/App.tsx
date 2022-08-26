import React from 'react';
import styles from './App.module.scss';
import Router from './Router';

function App() {
  return (
    <div className={`bg-gofun ${styles.container}`}>
      <Router />
    </div>
  );
}

export default App;

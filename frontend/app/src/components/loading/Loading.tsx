import React from 'react';
import styles from './Loading.module.scss';

interface PROPS {
  title: string;
}

const Loading: React.VFC<PROPS> = (props) => {
  return (
    <div className={styles.wrapper} data-testid="loading">
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
      <div className={styles.shadow}></div>
      <div className={styles.shadow}></div>
      <div className={styles.shadow}></div>
      <span>{props.title}</span>
    </div>
  );
};

export default Loading;

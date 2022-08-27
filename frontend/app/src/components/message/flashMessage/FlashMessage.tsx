import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../app/store';
import {
  editMessage,
  selectMessage,
  selectSuccessOrFailure,
} from '../../../features/auth/authSlice';
import styles from './FlashMessage.module.scss';

const FlashMessage: React.VFC = () => {
  const dispatch: AppDispatch = useDispatch();
  const authMessage: string = useSelector(selectMessage);
  const successOrFail = useSelector(selectSuccessOrFailure);

  setTimeout(() => {
    dispatch(editMessage(''));
  }, 11000);

  return (
    <div
      className={`${styles.title} ${
        successOrFail === true ? `${styles.fulfilled}` : `${styles.rejected}`
      }`}
    >
      <p>ログイン完了</p>
    </div>
  );
};

export default FlashMessage;

import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../app/store';
import {
  editAccountBookMessage,
  selectAccountBookMessage,
  selectAccountBookSuccessOrFailure,
} from '../../../features/accountBook/accountBookSlice';
import {
  editMessage,
  selectMessage,
  selectSuccessOrFailure,
} from '../../../features/auth/authSlice';
import { selectIsLoading } from '../../../features/layout/layoutSlice';

const FlashMessage: React.VFC = () => {
  const dispatch: AppDispatch = useDispatch();
  const authMessage: string = useSelector(selectMessage),
    accountBookMessage: string = useSelector(selectAccountBookMessage),
    isLoading = useSelector(selectIsLoading);
  const successOrFail = useSelector(selectSuccessOrFailure);
  const accountBookSuccessOrFail = useSelector(
    selectAccountBookSuccessOrFailure
  );

  const bootLoader = () => {
    if (authMessage !== '') {
      successOrFail === true
        ? toast.success(authMessage, {
            duration: 5000,
          })
        : toast.error(authMessage, {
            duration: 5000,
          });
    } else if (accountBookMessage !== '') {
      accountBookSuccessOrFail === true
        ? toast.success(accountBookMessage, {
            duration: 5000,
          })
        : toast.error(accountBookMessage, {
            duration: 5000,
          });
    }
  };

  !isLoading &&
    setTimeout(() => {
      dispatch(editMessage(''));
      dispatch(editAccountBookMessage(''));
    }, 10000);

  useEffect(() => {
    bootLoader();
  }, []);

  return (
    <div>
      <Toaster />
    </div>
  );
};

export default FlashMessage;

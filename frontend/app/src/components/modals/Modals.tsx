import React from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import {
  isDeleteModalClose,
  isGuestLoginModalClose,
  isLoadingEnd,
  isLoadingStart,
  isPostModalClose,
  selectIsDeleteModal,
  selectIsGuestLoginModal,
  selectIsPostModal,
} from '../../features/layout/layoutSlice';
import { CgDanger } from 'react-icons/cg';
import useMedia from 'use-media';

const customStyles_sm: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '90%',
    height: '28%',
    padding: '30px 20px 0px 20px',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#edebe8',
  },
};

const customStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    cursor: 'pointer',
  },
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '60%',
    height: '30%',
    padding: '50px',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#edebe8',
  },
};

interface PROPS {
  type: string;
  title: string;
  body: string;
  subText: string;
  btnText: string;
  func: any;
  packet: any;
  path: string;
}
const Modals: React.VFC<PROPS> = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const isGuestLoginOpen = useSelector(selectIsGuestLoginModal),
    isDeleteOpen = useSelector(selectIsDeleteModal),
    isPostOpen = useSelector(selectIsPostModal);
  const history = useHistory();
  const isWide = useMedia({ maxWidth: '768px' });

  const allocationModalType = (): boolean => {
    if (props.type === 'delete') {
      return isDeleteOpen;
    } else if (props.type === 'share') {
      return isPostOpen;
    } else if (props.type === 'guestLogin') {
      return isGuestLoginOpen;
    }
    return false;
  };

  const allocationClickEvent = async () => {
    if (props.type === 'delete') {
      await dispatch(isLoadingStart());
      await dispatch(props.func(props.packet));
      await dispatch(isDeleteModalClose());
      await history.push(`${props.path}`);
      await dispatch(isLoadingEnd());
    } else if (props.type === 'share') {
      await props.func();
      await dispatch(isPostModalClose());
      await history.push(`${props.path}`);
    } else if (props.type === 'guestLogin') {
      await props.func(props.packet);
      await dispatch(isGuestLoginModalClose());
      await history.push(`${props.path}`);
    }
  };

  Modal.setAppElement('#root');

  return (
    <Modal
      isOpen={allocationModalType()}
      onRequestClose={async () => {
        await dispatch(isDeleteModalClose());
        await dispatch(isPostModalClose());
        await dispatch(isGuestLoginModalClose());
      }}
      style={isWide ? customStyles_sm : customStyles}
    >
      <div>
        <h2 className="text-center font-bold text-lg mb-4 flex items-center justify-center">
          <CgDanger className="text-red-500 text-2xl" />
          <span>{props.title}</span>
        </h2>
        <p className="text-center font-semibold">{props.body}</p>
        <p
          className={`${
            props.type === 'delete' && 'text-center'
          } md:text-center`}
        >
          {props.subText}
        </p>
        <div className="mx-auto text-center">
          <button
            className={`text-center text-white rounded-lg transition-all py-2 px-6 font-semibold mt-4 ${
              props.type === 'delete'
                ? 'bg-red-500 hover:bg-red-600 border-red-600'
                : 'bg-button-color-orange hover:bg-button-color-orange-hover border-button-color-orange-shadow'
            }`}
            onClick={() => allocationClickEvent()}
          >
            {props.btnText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Modals;

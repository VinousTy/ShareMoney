import React, { useState } from 'react';
import styles from './SearchModal.module.scss';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import {
  isLoadingEnd,
  isLoadingStart,
  isSearchModalClose,
  selectIsLoading,
  selectIsSearchModal,
} from '../../features/layout/layoutSlice';
import { job as jobs, incomes, compositions } from '../../data/data';
import { useCookies } from 'react-cookie';
import {
  getAccountBookList,
  searchGetAccountBook,
} from '../../features/accountBook/accountBookSlice';
import { useHistory } from 'react-router-dom';
import Loading from '../loading/Loading';

const customStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    cursor: 'pointer',
  },
};

interface SEARCH_DATA {
  name: string;
  type: string;
}

interface PROPS {
  setName: React.Dispatch<React.SetStateAction<string>>;
}

const SearchModal = (props: PROPS) => {
  const dispatch: AppDispatch = useDispatch();
  const isOpen = useSelector(selectIsSearchModal),
    isLoading = useSelector(selectIsLoading);
  const [selectOpenIncome, setSelectOpenIncome] = useState(false);
  const [selectOpenJob, setSelectOpenJob] = useState(false);
  const [selectOpenComposition, setSelectOpenComposition] = useState(false);
  const [cookies] = useCookies();
  const history = useHistory();

  const selectSearch = async (data: SEARCH_DATA) => {
    const encodeName = escape(data.name);
    await dispatch(isLoadingStart());
    if (data.type !== 'all') {
      await dispatch(
        searchGetAccountBook({
          name: data.name,
          type: data.type,
          cookie: cookies,
        })
      );
    }
    if (data.type === 'income') {
      setSelectOpenIncome(false);
      await history.push(`?income=${encodeName}`);
    } else if (data.type === 'job') {
      setSelectOpenJob(false);
      await history.push(`?job=${encodeName}`);
    } else if (data.type === 'composition') {
      setSelectOpenComposition(false);
      await history.push(`?composition=${encodeName}`);
    } else if (data.type === 'all') {
      setSelectOpenIncome(false);
      setSelectOpenJob(false);
      setSelectOpenComposition(false);
      await dispatch(getAccountBookList(cookies));
      await history.push(`/accountBook/list`);
    }
    props.setName('');
    await dispatch(isLoadingEnd());
    await dispatch(isSearchModalClose());
  };

  Modal.setAppElement('#root');

  return (
    <>
      {isLoading ? (
        <div className="h-screen">
          <Loading title={'Loading...'} />
        </div>
      ) : (
        <Modal
          isOpen={isOpen}
          onRequestClose={async () => {
            await dispatch(isSearchModalClose());
          }}
          className={styles.content}
          style={customStyles}
        >
          <div>
            <h2 className="text-center font-semibold text-lg py-4">
              各ジャンルで絞り込み
            </h2>
            <div
              className={`${styles.select} ${
                selectOpenIncome && styles.is_open
              } mb-6`}
            >
              <span
                className={styles.placeholder}
                onClick={() => setSelectOpenIncome(!selectOpenIncome)}
              >
                年収を選択してください
              </span>
              <ul>
                <li onClick={() => selectSearch({ name: '全て', type: 'all' })}>
                  全て
                </li>
                {incomes?.map((income) => (
                  <li
                    key={income.id}
                    onClick={() =>
                      selectSearch({ name: income.name, type: 'income' })
                    }
                  >
                    {income.name}
                  </li>
                ))}
              </ul>
              <input type="hidden" name="changemetoo" />
            </div>
            <div
              className={`${styles.select} ${
                selectOpenJob && styles.is_open
              } mb-6`}
            >
              <span
                className={styles.placeholder}
                onClick={() => setSelectOpenJob(!selectOpenJob)}
              >
                職業を選択してください
              </span>
              <ul>
                <li onClick={() => selectSearch({ name: '全て', type: 'all' })}>
                  全て
                </li>
                {jobs?.map((job) => (
                  <li
                    key={job.id}
                    onClick={() =>
                      selectSearch({ name: job.name, type: 'job' })
                    }
                  >
                    {job.name}
                  </li>
                ))}
              </ul>
              <input type="hidden" name="changemetoo" />
            </div>
            <div
              className={`${styles.select} ${
                selectOpenComposition && styles.is_open
              }`}
            >
              <span
                className={styles.placeholder}
                onClick={() => setSelectOpenComposition(!selectOpenComposition)}
              >
                世帯を選択してください
              </span>
              <ul>
                <li onClick={() => selectSearch({ name: '全て', type: 'all' })}>
                  全て
                </li>
                {compositions?.map((composition) => (
                  <li
                    key={composition.id}
                    onClick={() =>
                      selectSearch({
                        name: composition.name,
                        type: 'composition',
                      })
                    }
                  >
                    {composition.name}
                  </li>
                ))}
              </ul>
              <input type="hidden" name="changemetoo" />
            </div>
            <div className="mx-auto text-center">
              <button
                className="text-center bg-button-color-orange text-white rounded-lg hover:bg-button-color-orange-hover transition-all border-button-color-orange-shadow py-2 px-6 font-semibold mt-4"
                onClick={() => selectSearch({ name: '全て', type: 'all' })}
              >
                全件表示
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SearchModal;

import React, { useEffect, useState } from 'react';
import styles from './Profile.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Avatar, IconButton } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {
  updateProfile,
  selectProfile,
  getMyProfile,
  getUser,
  selectUserId,
  createProfile,
  isSignIn,
} from '../../features/auth/authSlice';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { job as jobs, incomes, compositions } from '../../data/data';
import Alert from '../../components/message/alert/Alert';
import {
  isLoadingEnd,
  isLoadingStart,
  selectIsLoading,
} from '../../features/layout/layoutSlice';
import Loading from '../../components/loading/Loading';

interface INPUTS {
  name: string;
  age: number;
  job: string;
  income: string;
  composition: string;
  body: string;
}

const Profile: React.FC = () => {
  const [avatarImage, setAvatarImage] = useState<any>(null),
    [validError, setValidError] = useState(false),
    [image, setImage] = useState<any>(null);
  const dispatch: AppDispatch = useDispatch();
  const userId = useSelector(selectUserId),
    profile = useSelector(selectProfile),
    isLoading = useSelector(selectIsLoading);
  const history = useHistory();
  const [cookies, setCookie] = useCookies();

  let id = window.location.pathname.split('/profile')[1];
  if (id !== '') {
    id = id?.split('/')[1];
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<INPUTS>({
    shouldUnregister: false,
  });

  const handlerEditPicture = (e: any) => {
    setImage(e.target.files![0]);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setAvatarImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clickPicture = (e: any) => {
    const fileInput = document.getElementById('imageInput');
    fileInput?.click();
  };

  const getUserProfile = async () => {
    await dispatch(getUser(cookies));
    await dispatch(getMyProfile(cookies));
  };

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (id) {
        await dispatch(isLoadingStart());
        await dispatch(isSignIn());
        await getUserProfile();
        await dispatch(isLoadingEnd());
      } else if (cookies) {
        await dispatch(isSignIn());
        await dispatch(getUser(cookies));
      }
    };
    fetchBootLoader();
  }, []);

  useEffect(() => {
    if (id) {
      reset(profile);
    }
    setAvatarImage(profile?.img);
  }, [reset, profile]);

  const onSubmit: SubmitHandler<INPUTS> = async (data) => {
    if (id) {
      const packet = {
        id: profile.id,
        name: data.name,
        age: data.age,
        job: data.job,
        income: data.income,
        composition: data.composition,
        body: data.body,
        img: image,
        user_id: userId,
        cookie: cookies,
      };
      const result = await dispatch(updateProfile(packet));
      if (updateProfile.rejected.match(result)) {
        setValidError(true);
      } else {
        await history.push('/mypage');
        await reset();
      }
    } else {
      const packet = {
        name: data.name,
        age: data.age,
        job: data.job,
        income: data.income,
        composition: data.composition,
        body: data.body,
        img: image,
        user_id: userId,
        cookie: cookies,
      };
      const result = await dispatch(createProfile(packet));
      if (createProfile.rejected.match(result)) {
        setValidError(true);
      } else {
        await history.push('/mypage');
        await reset();
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="h-screen">
          <Loading title={'Loading...'} />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full py-8 mb-12 md:mb-1">
            <div className="w-9/12 md:w-4/12 mx-auto pt-14 text-center text-silver h-auto bg-stone-100 bg-white rounded">
              <h2
                className="mb-10 text-black text-xl font-bold"
                data-testid="title"
              >
                ????????????????????????
              </h2>
              {validError && (
                <Alert
                  title={'???????????????'}
                  message={
                    '??????????????????500KB??????????????????????????????0~100?????????????????????????????????????????????????????????'
                  }
                />
              )}
              <input
                type="file"
                id="imageInput"
                hidden={true}
                multiple
                onChange={handlerEditPicture}
              />
              <br />
              {avatarImage ? (
                <Avatar
                  src={avatarImage}
                  style={{
                    width: 110,
                    height: 110,
                  }}
                  className="text-center mx-auto"
                />
              ) : (
                <AccountCircleIcon
                  style={{ fontSize: 120 }}
                  className={avatarImage ? styles.addIcon : styles.normal}
                />
              )}
              <br />
              <IconButton onClick={clickPicture}>
                <span className="text-base text-blue-600 mb-4">
                  ?????????????????????????????????
                </span>
              </IconButton>
              <div className="mb-4">
                <div className="text-left ml-6 sm:ml-10 md:ml-9 text-gray-700 mb-1 pl-1">
                  <label htmlFor="name" data-testid="label-name">
                    ??????
                  </label>
                </div>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-10/12 py-2 px-3 mb-5"
                  id="name"
                  type="text"
                  data-testid="input-name"
                  placeholder="???????????????"
                  {...register('name', {
                    required: {
                      value: true,
                      message: '?????????????????????????????????',
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <div className="text-left ml-6 sm:ml-10 md:ml-9 text-gray-700 mb-1 pl-1">
                  <label htmlFor="age" data-testid="label-age">
                    ??????
                  </label>
                </div>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-10/12 py-2 px-3 mb-5"
                  id="age"
                  type="number"
                  data-testid="input-age"
                  placeholder="???????????????"
                  {...register('age', {
                    required: {
                      value: true,
                      message: '?????????????????????????????????',
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: '??????????????????????????????????????????',
                    },
                  })}
                />
                {errors.age && (
                  <p className="text-red-500 text-xs italic" role="alert">
                    {errors.age.message}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <div className="text-left ml-6 sm:ml-10 md:ml-9 text-gray-700 mb-1 pl-1">
                  <label htmlFor="job" data-testid="label-job">
                    ??????
                  </label>
                </div>
                <select
                  className={`${styles.select_placeholder} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-10/12 py-2 px-3 mb-5`}
                  id="job"
                  data-testid="select-job"
                  required
                  {...register('job', {
                    required: {
                      value: true,
                      message: '?????????????????????????????????',
                    },
                  })}
                >
                  <option className="hidden" value="">
                    ?????????????????????????????????
                  </option>
                  {jobs?.map((job) => (
                    <option key={job.id}>{job.name}</option>
                  ))}
                </select>
                {errors.job && (
                  <p className="text-red-500 text-xs mt-3 italic" role="alert">
                    {errors.job.message}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <div className="text-left ml-6 sm:ml-10 md:ml-9 text-gray-700 mb-1 pl-1">
                  <label htmlFor="income" data-testid="label-income">
                    ??????
                  </label>
                </div>
                <select
                  className={`${styles.select_placeholder} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-10/12 py-2 px-3 mb-5`}
                  id="income"
                  data-testid="select-income"
                  required
                  {...register('income', {
                    required: {
                      value: true,
                      message: '?????????????????????????????????',
                    },
                  })}
                >
                  <option className="hidden" value="">
                    ?????????????????????????????????
                  </option>
                  {incomes?.map((income) => (
                    <option key={income.id}>{income.name}</option>
                  ))}
                </select>
                {errors.income && (
                  <p className="text-red-500 text-xs mt-3 italic" role="alert">
                    {errors.income.message}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <div className="text-left ml-6 sm:ml-10 md:ml-9 text-gray-700 mb-1 pl-1">
                  <label htmlFor="composition" data-testid="label-composition">
                    ??????
                  </label>
                </div>
                <select
                  className={`${styles.select_placeholder} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-10/12 py-2 px-3 mb-5`}
                  id="composition"
                  data-testid="select-composition"
                  required
                  {...register('composition', {
                    required: {
                      value: true,
                      message: '?????????????????????????????????',
                    },
                  })}
                >
                  <option className="hidden" value="">
                    ?????????????????????????????????
                  </option>
                  {compositions?.map((composition) => (
                    <option key={composition.id}>{composition.name}</option>
                  ))}
                </select>
                {errors.composition && (
                  <p className="text-red-500 text-xs mt-3 italic" role="alert">
                    {errors.composition.message}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <div className="text-left ml-6 sm:ml-10 md:ml-9 text-gray-700 mb-1 pl-1">
                  <label htmlFor="body" data-testid="label-body">
                    ????????????
                  </label>
                </div>
                <textarea
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-10/12 py-2 px-3 mb-5"
                  rows={6}
                  id="body"
                  data-testid="input-body"
                  placeholder="??????????????????150?????????????????????"
                  {...register('body', {
                    maxLength: {
                      value: 150,
                      message: '??????????????????150???????????????????????????????????????',
                    },
                  })}
                />
                {errors.body && (
                  <p className="text-red-500 text-xs italic">
                    {errors.body.message}
                  </p>
                )}
              </div>
              <div className="mb-6 pb-6 md:mb-0">
                <button
                  type="submit"
                  className="px-20 py-2.5 relative rounded group font-medium text-white inline-block"
                  data-testid="button-submit"
                >
                  <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-button-color-orange-hover to-yellow-200"></span>
                  <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-button-color-orange-hover to-yellow-200"></span>
                  <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-button-color-orange-hover to-yellow-200"></span>
                  <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-button-color-orange-hover from-yellow-200"></span>
                  <span className="relative">??????</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default Profile;

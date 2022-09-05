import React from 'react';
import useMedia from 'use-media';
import { Avatar } from '@material-ui/core';
import { FaAngleDoubleRight, FaTools } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/auth/authSlice';
import { useHistory } from 'react-router-dom';

interface PROPS_PROFILELIST {
  id: string;
  name: string;
  age: number;
  job: string;
  income: string;
  composition: string;
  body: string;
  img: any;
  user_id: string;
}

const ProfileList: React.VFC<PROPS_PROFILELIST> = (props) => {
  const profile = useSelector(selectProfile);
  const isWide = useMedia({ maxWidth: '768px' });
  const history = useHistory();

  return (
    <>
      <div className="md:flex">
        <Avatar
          src={props?.img}
          style={
            isWide ? { width: 120, height: 120 } : { width: 80, height: 80 }
          }
          className="mx-auto mt-8 md:ml-4 md:mt-4 md:mr-4"
        />
        <div>
          <div className="font-bold text-2xl mt-4 mb-2 text-center md:ml-0 md:mt-0 md:text-left">
            {props?.name}
          </div>
          <div className="flex items-center ml-20 md:ml-0" data-testid="age">
            <FaAngleDoubleRight className="text-button-color-orange" />
            <span>年齢：</span>
            {profile?.age}歳
          </div>
          <div className="flex items-center ml-20 md:ml-0" data-testid="job">
            <FaAngleDoubleRight className="text-button-color-orange" />
            <span
              className={`${
                profile?.job == 'ソフトウエア・インターネット・通信' && 'w-20'
              }`}
            >
              職業：
            </span>
            {profile?.job}
          </div>
          <div className="flex items-center ml-20 md:ml-0" data-testid="income">
            <FaAngleDoubleRight className="text-button-color-orange" />
            <span>年収：</span>
            {profile?.income}
          </div>
          <div
            className="flex items-center ml-20 md:ml-0"
            data-testid="composition"
          >
            <FaAngleDoubleRight className="text-button-color-orange" />
            <span>世帯：</span>
            {profile?.composition}
          </div>
        </div>
      </div>
      <div className="px-8 pt-5 pb-3" data-testid="body">
        {props?.body}
      </div>
      {profile?.body ==
        'ゲストユーザーとしてログインしています。ゲストユーザーのため、各種投稿やユーザー情報の変更等の一部機能の使用は制限されております。' && (
        <div className="flex appearance-none rounded leading-tight mt-4 cursor-pointer text-blue-500 justify-end">
          <FaTools />
          <span className="mr-2 mb-4">ゲストはプロフィール編集できません</span>
        </div>
      )}
      {profile?.body ==
      'ゲストユーザーとしてログインしています。ゲストユーザーのため、各種投稿やユーザー情報の変更等の一部機能の使用は制限されております。' ? (
        <></>
      ) : (
        <div
          className="flex appearance-none rounded leading-tight mt-4 cursor-pointer text-blue-500 justify-end"
          onClick={() => history.push(`/profile/${profile.user_id}`)}
        >
          <FaTools />
          <span className="mr-2 mb-4">プロフィールを編集する</span>
        </div>
      )}
    </>
  );
};

export default ProfileList;

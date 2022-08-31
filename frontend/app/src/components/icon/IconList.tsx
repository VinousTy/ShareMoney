import React from 'react';
import { AiFillHome } from 'react-icons/ai';
import { FaFaucet } from 'react-icons/fa';
import { GiRadioTower } from 'react-icons/gi';
import { TbHeartHandshake } from 'react-icons/tb';
import { GiKnifeFork } from 'react-icons/gi';
import { RiSurgicalMaskLine } from 'react-icons/ri';
import { MdTrain } from 'react-icons/md';
import { GiClothes } from 'react-icons/gi';
import { ImScissors } from 'react-icons/im';
import { ImGlass } from 'react-icons/im';
import { FaDumbbell } from 'react-icons/fa';
import { FaBook } from 'react-icons/fa';
import { FaHospitalAlt } from 'react-icons/fa';
import { GrCapacity } from 'react-icons/gr';
import { AiOutlineComment } from 'react-icons/ai';

interface PROPS {
  expenseItem: string;
}

const IconList = (props: PROPS) => {
  return (
    <div>
      {props.expenseItem === '住居費' && (
        <div className="bg-red-200 px-2 py-2 rounded-full mr-1 md:mr-2">
          <AiFillHome className="text-red-500" />
        </div>
      )}
      {props.expenseItem === '水道光熱費' && (
        <div className="bg-blue-200 px-2 py-2 rounded-full mr-1 md:mr-2">
          <FaFaucet className="text-blue-700" />
        </div>
      )}
      {props.expenseItem === '通信費' && (
        <div className="bg-yellow-200 px-2 py-2 rounded-full mr-1 md:mr-2">
          <GiRadioTower className="text-yellow-900" />
        </div>
      )}
      {props.expenseItem === '保険料' && (
        <div className="bg-pink-200 px-2 py-2 rounded-full mr-1 md:mr-2">
          <TbHeartHandshake className="text-pink-800" />
        </div>
      )}
      {props.expenseItem === '食費' && (
        <div className="bg-thin-orange px-2 py-2 rounded-full mr-1 md:mr-2">
          <GiKnifeFork className="text-orange" />
        </div>
      )}
      {props.expenseItem === '日用品費' && (
        <div className="bg-thin-brown px-2 py-2 rounded-full mr-1 md:mr-2">
          <RiSurgicalMaskLine className="text-brown" />
        </div>
      )}
      {props.expenseItem === '交通費' && (
        <div className="bg-thin-green px-2 py-2 rounded-full mr-1 md:mr-2">
          {' '}
          <MdTrain className="text-green" />{' '}
        </div>
      )}
      {props.expenseItem === '被服費' && (
        <div className="bg-thin-sky px-2 py-2 rounded-full mr-1 md:mr-2">
          <GiClothes className="text-sky" />
        </div>
      )}
      {props.expenseItem === '美容費' && (
        <div className="bg-purple-200 px-2 py-2 rounded-full mr-1 md:mr-2">
          <ImScissors className="text-purple-500" />
        </div>
      )}
      {props.expenseItem === '交際費' && (
        <div className="bg-thin-wine px-2 py-2 rounded-full mr-1 md:mr-2">
          {' '}
          <ImGlass className="text-wine" />{' '}
        </div>
      )}
      {props.expenseItem === '趣味費' && (
        <div className="bg-thin-yellow-green px-2 py-2 rounded-full mr-1 md:mr-2">
          <FaDumbbell className="text-yellow-green" />
        </div>
      )}

      {props.expenseItem === '教育費' && (
        <div className="bg-thin--navy px-2 py-2 rounded-full mr-1 md:mr-2">
          <FaBook className="text-navy" />{' '}
        </div>
      )}

      {props.expenseItem === '医療費' && (
        <div className="bg-bg-hospital px-2 py-2 rounded-full mr-1 md:mr-2">
          <FaHospitalAlt className="text-text-hospital" />
        </div>
      )}
      {props.expenseItem === '特別費' && (
        <div className="bg-thin-burly-wood px-2 py-2 rounded-full mr-1 md:mr-2">
          <GrCapacity className="text-burly-wood" />
        </div>
      )}
      {props.expenseItem === '雑費' && (
        <div className="bg-thin-dimgray px-2 py-2 rounded-full mr-1 md:mr-2">
          <AiOutlineComment className="text-dimgray" />
        </div>
      )}
    </div>
  );
};

export default IconList;

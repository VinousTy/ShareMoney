import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, IconButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import {
  selectAccountBook,
  getMyAccountBook,
  updateAccountBook,
  postCosts,
  updateCost,
  createAccountBook,
} from '../../features/accountBook/accountBookSlice';
import { useCookies } from 'react-cookie';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import clsx from 'clsx';
import CostArea from '../../components/costArea/CostArea';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { expenseItems } from '../../data/data';
import { isSignIn } from '../../features/auth/authSlice';
import {
  isLoadingEnd,
  isLoadingStart,
  selectIsLoading,
} from '../../features/layout/layoutSlice';
import Loading from '../../components/loading/Loading';
import Webcam from 'react-webcam';
import axios from 'axios';
import FlashMessage from '../../components/message/flashMessage/FlashMessage';

interface INPUTS {
  id: string;
  date: string;
  user_id: string;
  monthly_income: number;
  expenses: {
    expenseItem: string;
    cost: number;
  }[];
}

interface COST {
  expenseItem: string;
  cost: string;
}

interface COSTS {
  id: number;
  expenseItem: string;
  cost: string;
}

interface PACKET_COSTS {
  account_book_id: string | boolean;
  expenses: {
    id: number;
    expenseItem: string;
    cost: string;
  }[];
  cookie: {
    [x: string]: any;
  };
}

interface ANNOTATIONS {
  description: string;
  boundingPoly: {
    vertices: [
      {
        x: number;
        y: number;
      },
      {
        x: number;
        y: number;
      },
      {
        x: number;
        y: number;
      },
      {
        x: number;
        y: number;
      }
    ];
  };
}

interface PICTUREANALYSIS {
  img: any;
  cookie: {
    [x: string]: string;
  };
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'environment',
};
const apiUrl = process.env.REACT_APP_DEV_API_URL;

const AccountBookForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const accountBook = useSelector(selectAccountBook),
    isLoading = useSelector(selectIsLoading);
  const [monthlyIncome, setMonthlyIncome] = useState(''),
    [indexMonthlyIncome, setIndexMonthlyIncome] = useState(0),
    [monthlyIncomes, setMonthlyIncomes] = useState<string[]>([]),
    [addBtn, setAddBtn] = useState(true),
    [editing, setEditing] = useState(false),
    [isAlertmonthlyIncome, setIsAlertmonthlyIncome] = useState(false),
    [costs, setCosts] = useState([]),
    [valid, setValid] = useState(false),
    [bool, setBool] = useState<boolean>(false),
    [image, setImage] = useState<null | any>(null),
    [imageSetting, setImageSetting] = useState(false),
    [readCost, setReadCost] = useState<number | boolean | string>(''),
    [date, setDate] = useState<any>(''),
    [isCaptureEnable, setCaptureEnable] = useState(false),
    [ocrLoading, setOcrLoading] = useState(false);
  const history = useHistory();
  const [cookies, setCookies] = useCookies();
  const [tabIndex, setTabIndex] = useState(0);
  const webcamRef = useRef<Webcam>(null);

  let id = window.location.pathname.split('/accountBook/regist')[1];
  if (id !== '') {
    id = id?.split('/')[1];
  }

  const editAccountBook = accountBook?.filter((book) => {
    return book.id == id;
  });

  const today = () => {
    const dt = new Date();
    var y = dt.getFullYear();
    var m = ('00' + (dt.getMonth() + 1)).slice(-2);
    var d = ('00' + dt.getDate()).slice(-2);
    return y + '-' + m + '-' + d;
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<INPUTS>();

  const addMonthlyIncome = async () => {
    if (monthlyIncome === '') {
      return;
    } else if (Number(monthlyIncome) < 1) {
      setIsAlertmonthlyIncome(true);
      return;
    } else {
      if (indexMonthlyIncome === monthlyIncomes.length) {
        setMonthlyIncomes((prevState) => [...prevState, monthlyIncome]);
        setIndexMonthlyIncome(indexMonthlyIncome + 1);
        setMonthlyIncome('');
      } else {
        const newMonthlyIncome = monthlyIncomes;
        newMonthlyIncome[indexMonthlyIncome] = monthlyIncome;
        setMonthlyIncomes(newMonthlyIncome);
        setIndexMonthlyIncome(newMonthlyIncome.length);
        setMonthlyIncome('');
      }
    }
    setAddBtn(false);
  };

  const editCost = (index: number, monthlyIncome: string) => {
    setAddBtn(true);
    setEditing(true);
    setIndexMonthlyIncome(index);
    setMonthlyIncome(monthlyIncome);
  };

  const deleteMonthlyIncome = (deleteIndex: number) => {
    setAddBtn(true);
    setEditing(false);
    const newMonthlyIncomes = monthlyIncomes.filter(
      (MonthlyIncome: string, i: number) => i !== deleteIndex
    );
    setIndexMonthlyIncome(newMonthlyIncomes.length);
    setMonthlyIncomes(newMonthlyIncomes);
  };

  useEffect(() => {
    dispatch(isSignIn());
    const fetchBootLoader = async () => {
      if (cookies) {
        await dispatch(getMyAccountBook({ id: id, cookie: cookies }));
      }
    };
    if (id) {
      fetchBootLoader();
    }
  }, []);

  const array: Array<COSTS> = [];
  costs?.filter((cost: COST) => {
    expenseItems.forEach((item) => {
      if (cost.expenseItem === item.name) {
        array.push({
          id: item.id,
          expenseItem: cost.expenseItem,
          cost: cost.cost,
        });
      }
    });
  });

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
    }
    setBool(true);
    setImageSetting(true);
  }, [webcamRef]);

  const handlerEditPicture = (e: any) => {
    setImage(e.target.files![0]);
    setImageSetting(true);
  };

  const clickPicture = (e: any) => {
    const fileInput = document.getElementById('imageInput');
    fileInput?.click();
  };

  const tryOcr = async () => {
    if (bool) {
      let bin = atob(image.replace(/^.*,/, ''));
      let buffer = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
      }
      let image_file = new File([buffer.buffer], 'image.jpeg', {
        type: 'image/jpeg',
      });
      setReadCost(await pictureAnalysis({ img: image_file, cookie: cookies }));
      await setValue('date', today());
    } else {
      setReadCost(await pictureAnalysis({ img: image, cookie: cookies }));
      await setValue('date', today());
    }
    await setOcrLoading(true);
  };

  const pictureAnalysis = async (data: PICTUREANALYSIS) => {
    const uploadData = new FormData();
    uploadData.append('img', data.img, data.img.name);
    const res = await axios.post(`${apiUrl}api/ocr/extract`, uploadData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.cookie.Bearer}`,
      },
    });
    return findAmountByGoukei(res.data.annotations);
  };

  const detectKeyWordHeight = (
    textAnnotations: Array<ANNOTATIONS>,
    keyWord: string
  ) => {
    let regExp = new RegExp(keyWord);
    for (let i = 1; i < textAnnotations.length; i++) {
      let text = textAnnotations[i].description;
      if (text.match(regExp)) {
        let keyWordUpperHeight = textAnnotations[i].boundingPoly.vertices[0].y; //983
        let keyWordLowerHeight = textAnnotations[i].boundingPoly.vertices[3].y; //1034
        let keyWordHeight = (keyWordUpperHeight + keyWordLowerHeight) / 2;
        return keyWordHeight;
      }
    }
    return false;
  };

  const findAmountByGoukei = (textAnnotations: Array<ANNOTATIONS>) => {
    let goukeiHeight = detectKeyWordHeight(textAnnotations, '合計');
    for (let i = 1; i < textAnnotations.length; i++) {
      // ¥ が入っていないものはスキップ
      if (!correctYenMark(textAnnotations[i].description).match(/\¥/)) {
        continue;
      }
      let textLowerHeight = textAnnotations[i].boundingPoly.vertices[3].y;
      // 「合」のある位置より下のものを捕捉する
      if (textLowerHeight >= goukeiHeight) {
        return parseAmount(textAnnotations, i);
      }
    }
    return false;
  };

  const parseAmount = (textAnnotations: Array<ANNOTATIONS>, i: number) => {
    let text = correctYenMark(textAnnotations[i].description);
    // ¥ だけのものはその後の数字と分離してしまっているため、一つ後ろのものを採用する
    if (text === '¥') {
      text = correctYenMark(textAnnotations[i + 1].description);
    }
    // カンマで終わっているものはそこで金額が途切れてしまっている可能性があるので、一つ後ろと連結する
    let count = 1;
    while (text.match(/,$/)) {
      text += textAnnotations[i + count].description;
      count += 1;
    }
    return parseInt(text.replace(',', '').replace('¥', ''));
  };

  const correctYenMark = (text: string) => {
    const correctedText = text
      .replace(/半/g, '¥')
      .replace(/ギ/g, '¥')
      .replace(/羊/g, '¥')
      .replace(/ /g, '');
    return correctedText;
  };

  useEffect(() => {
    if (id) {
      if (editAccountBook !== undefined) {
        reset(editAccountBook[0] && editAccountBook[0]);
        let array: string[] = [];
        array.push(String(editAccountBook[0]?.monthly_income));
        setMonthlyIncomes(array);
        const expense: any = editAccountBook[0]?.expenses;
        setCosts(expense);
      }
    }
    if (monthlyIncomes.length > 0) {
      setAddBtn(false);
    }
  }, [reset, accountBook]);

  useEffect(() => {
    if (imageSetting) {
      setValue('date', today());
    }
  }, [ocrLoading, costs, addBtn, tabIndex]);

  const onSubmit: SubmitHandler<INPUTS> = async (data) => {
    const createPacketAccountBook = {
      date: data.date,
      monthly_income: data.monthly_income,
      cookie: cookies,
      expenses: array,
    };

    const updatePacketAccountBook = {
      id: id && editAccountBook[0]?.id,
      date: data.date,
      monthly_income: data.monthly_income,
      cookie: cookies,
    };

    const createPacketCost = {
      account_book_id: id && editAccountBook[0]?.id,
      expenses: getTagDiff(),
      cookie: cookies,
    };

    const updatePacketCost: PACKET_COSTS = {
      account_book_id: editAccountBook !== undefined && editAccountBook[0]?.id,
      expenses: [],
      cookie: cookies,
    };

    if (editAccountBook !== undefined) {
      editAccountBook[0]?.expenses.filter((expense) => {
        array.forEach((cost) => {
          if (cost.expenseItem === expense.expenseItem) {
            updatePacketCost.expenses.push(cost);
          }
        });
      });
    }

    function getTagDiff() {
      const same = costs?.filter((cost: COST) => {
        if (editAccountBook !== undefined) {
          return editAccountBook[0]?.expenses.find(
            (expense) => expense.expenseItem === cost.expenseItem
          );
        }
      });
      const sameIds = same.map((_item: COST) => _item.expenseItem);

      return costs.filter((cost: COST) => {
        return !sameIds.includes(cost.expenseItem);
      });
    }

    if (id) {
      if (!costs.length) {
        setValid(true);
      } else {
        await dispatch(isLoadingStart());
        await dispatch(updateAccountBook(updatePacketAccountBook));
        await dispatch(postCosts(createPacketCost));
        await dispatch(updateCost(updatePacketCost));
        await dispatch(isLoadingEnd());
        await history.push('/mypage');
      }
    } else {
      if (!costs.length) {
        setValid(true);
      } else {
        await dispatch(isLoadingStart());
        await dispatch(createAccountBook(createPacketAccountBook));
        await dispatch(isLoadingEnd());
        await history.push('/mypage');
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="h-screen">
          <Loading title={'送信中...'} />
        </div>
      ) : (
        <div>
          {ocrLoading && <FlashMessage />}
          <div className="w-full py-8 mb-12 md:mb-1">
            <div className="w-10/12 md:w-6/12 mx-auto pt-14 text-center text-white h-auto bg-stone-100 bg-white rounded">
              <h2
                className="mb-10 text-black text-xl font-bold"
                data-testid="title"
              >
                家計簿を登録
              </h2>
              <div className="mb-6">
                {id || (
                  <div className="mb-7">
                    <div className="text-left ml-9 text-gray-700 md:ml-14 mb-1 pl-1">
                      <label data-testid="label-file">
                        レシート画像を読み取る
                      </label>
                    </div>
                    <div className="text-left ml-9 text-gray-700 md:ml-24 mb-1 pl-1">
                      <input
                        type="file"
                        id="imageInput"
                        hidden={true}
                        multiple
                        onChange={handlerEditPicture}
                      />
                      <button
                        className="text-sm text-blue-500 underline ... cursor-pointer hover:text-red-500 transition-all"
                        onClick={clickPicture}
                      >
                        ファイルを選択
                      </button>
                      <br />
                      <span className="text-sm">または</span>
                      {isCaptureEnable ? (
                        <button
                          className="text-sm text-blue-500 underline ... cursor-pointer hover:text-red-500 transition-all"
                          onClick={() => setCaptureEnable(false)}
                        >
                          撮影を終了する
                        </button>
                      ) : (
                        <button
                          className="text-sm text-blue-500 underline ... cursor-pointer hover:text-red-500 transition-all"
                          onClick={() => setCaptureEnable(true)}
                        >
                          レシートを撮影する
                        </button>
                      )}
                    </div>
                    {imageSetting && (
                      <div className="text-left text-sm ml-9 text-gray-700 mt-3 md:ml-24 mb-1 pl-1">
                        <button
                          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow transition-all"
                          onClick={tryOcr}
                        >
                          画像を送信する
                        </button>
                      </div>
                    )}
                    {isCaptureEnable && (
                      <>
                        <div>
                          <button onClick={() => setCaptureEnable(false)}>
                            終了
                          </button>
                        </div>
                        <div>
                          <Webcam
                            audio={false}
                            width={540}
                            height={360}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                          />
                        </div>
                        <div className="text-left text-sm ml-9 text-gray-700 mt-3 md:ml-24 mb-1 pl-1">
                          <button
                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow transition-all"
                            onClick={capture}
                          >
                            撮影
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
                <div className="text-left ml-9 text-gray-700 md:ml-14 mb-1 pl-1">
                  <label htmlFor="date" data-testid="label-date">
                    入力日
                  </label>
                </div>
                {imageSetting ? (
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-9/12 py-2 px-3 mb-5"
                    id="date"
                    data-testid="input-date"
                    type="date"
                    value={date}
                    placeholder="年/月/日"
                    onChange={(e) => setDate(e.target.value)}
                  />
                ) : (
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-9/12 py-2 px-3 mb-5"
                    id="date"
                    data-testid="input-date"
                    type="date"
                    placeholder="年/月/日"
                    {...register('date', {
                      required: {
                        value: true,
                        message: '※日付の入力は必須です',
                      },
                    })}
                  />
                )}
                {errors.date && (
                  <p className="text-red-500 text-xs italic" role="alert">
                    {errors.date.message}
                  </p>
                )}
              </div>
              <hr className="" />
              <div className="text-gray-700 text-center text-sm lg:text-base">
                以下項目は必要に応じて追加してください
              </div>
              <Tab />
              <Tabs
                selectedIndex={tabIndex}
                onSelect={(index: number) => setTabIndex(index)}
                className="text-center mx-auto mt-10"
              >
                <TabList className="mb-7 flex">
                  <Tab className="bg-transparent w-20 mx-auto cursor-pointer">
                    <div
                      className={clsx([
                        tabIndex === 0
                          ? 'text-black font-bold border-b-2 border-orange'
                          : 'text-disabled text-silver opacity-70',
                      ])}
                      data-testid="cost-title"
                    >
                      支出を入力
                    </div>
                  </Tab>
                  <Tab className="bg-transparent w-20 mx-auto cursor-pointer">
                    <div
                      className={clsx([
                        tabIndex === 1
                          ? 'text-black font-bold border-b-2 border-orange'
                          : 'text-disabled text-silver opacity-70',
                      ])}
                      data-testid="income-title"
                    >
                      収入を入力
                    </div>
                  </Tab>
                </TabList>
                <TabPanel>
                  <div className="px-8 py-8">
                    <CostArea
                      costs={costs}
                      setCosts={setCosts}
                      valid={valid}
                      setValid={setValid}
                      readCost={readCost}
                    />
                  </div>
                </TabPanel>
                <TabPanel className="px-8">
                  <div>
                    <table className="text-gray-700 w-full">
                      <thead className="border-b">
                        <tr>
                          <th className="w-32">収入</th>
                          <th className="w-12"></th>
                          <th className="w-12"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyIncomes.length > 0 &&
                          monthlyIncomes.map(
                            (monthlyIncome: string, index: number) => (
                              <tr key={index}>
                                <td className="bg-gray-50">
                                  ¥{Number(monthlyIncome).toLocaleString()}
                                </td>
                                <td>
                                  <IconButton
                                    onClick={() =>
                                      editCost(index, monthlyIncome)
                                    }
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </td>
                                <td>
                                  <IconButton
                                    onClick={() => deleteMonthlyIncome(index)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                    {addBtn && (
                      <>
                        <div className="text-left ml-6 sm:ml-10 md:ml-9 text-gray-700 mb-1 pl-1 mt-6">
                          <label
                            htmlFor="monthly_income"
                            data-testid="label-name"
                          >
                            収入
                          </label>
                        </div>
                        <input
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-10/12 py-2 px-3 mb-5"
                          id="monthly_income"
                          type="number"
                          data-testid="input-monthlyIncome"
                          placeholder="収入金額を入力"
                          value={monthlyIncome}
                          step="1"
                          {...register('monthly_income', {
                            pattern: {
                              value: /^[0-9]+$/,
                              message: '収入金額は整数で入力してください',
                            },
                            validate: {
                              lessThanTen: (value) =>
                                !monthlyIncome ||
                                '収入の登録が完了していません',
                            },
                          })}
                          onChange={(e) => setMonthlyIncome(e.target.value)}
                        />
                      </>
                    )}
                    {isAlertmonthlyIncome && (
                      <p
                        className="text-red-500 text-xs mb-3 italic"
                        role="alert"
                      >
                        収入金額は1以上の整数で入力してください
                      </p>
                    )}
                    {errors.monthly_income && (
                      <p className="text-red-500 text-xs italic" role="alert">
                        {errors.monthly_income.message}
                      </p>
                    )}
                  </div>
                  {addBtn && (
                    <div className="md:text-right">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addMonthlyIncome()}
                      >
                        {editing ? '収入を変更する' : '収入を追加する'}
                      </Button>
                    </div>
                  )}
                </TabPanel>
              </Tabs>
              <div className="pb-6 mt-12">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="px-20 py-2.5 relative rounded group font-medium text-white inline-block"
                  data-testid="button-submit"
                >
                  <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-button-color-orange-hover to-yellow-200"></span>
                  <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-button-color-orange-hover to-yellow-200"></span>
                  <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-button-color-orange-hover to-yellow-200"></span>
                  <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-button-color-orange-hover from-yellow-200"></span>
                  <span className="relative">家計簿を登録する</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountBookForm;

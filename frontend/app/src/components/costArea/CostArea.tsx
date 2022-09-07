import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { expenseItems } from '../../data/data';
import { useForm } from 'react-hook-form';
import { AppDispatch } from '../../app/store';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { deleteCost } from '../../features/accountBook/accountBookSlice';

const useStyles = makeStyles({
  checkIcon: {
    float: 'right',
  },
  iconCell: {
    padding: 0,
    height: 48,
    width: 48,
  },
});

interface INPUTS {
  date: string;
  expenseItem: string;
  cost: number;
  monthlyIncome: string;
  monitor: string;
  computer: string;
  keyboard: string;
  mouse: string;
  speaker: string;
  table: string;
  chair: string;
  other: string;
}

interface PROPS {
  costs: {
    expenseItem: string;
    cost: string;
  }[];
  setCosts: Dispatch<SetStateAction<never[]>>;
  valid: boolean;
  setValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const CostArea = (props: PROPS) => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const [index, setIndex] = useState(0),
    [expenseItem, setExpenseItem] = useState(''),
    [editing, setEditing] = useState(false),
    [isAlert, setIsAlert] = useState(false),
    [isAlertCost, setIsAlertCost] = useState(false),
    [cost, setCost] = useState('');
  const [cookies] = useCookies();

  const {
    register,
    formState: { errors },
  } = useForm<INPUTS>();

  const validateExpenseItem = props.costs?.find(
    (item) => item.expenseItem === expenseItem
  );

  const addCost = (index: number, expenseItem: string, cost: string) => {
    if (expenseItem === '' || cost === '') {
      return;
    } else if (Number(cost) < 1) {
      setIsAlertCost(true);
      return;
    } else if (validateExpenseItem && !editing) {
      setIsAlert(true);
      return;
    } else {
      if (index === props.costs.length) {
        props.setCosts((prevState): any => [
          ...prevState,
          { expenseItem: expenseItem, cost: cost },
        ]);
        setIndex(index + 1);
        setExpenseItem('');
        setCost('');
        setIsAlert(false);
        setIsAlertCost(false);
      } else {
        var newC = props.costs;
        var newCost: any = [...newC];
        newCost[index] = { expenseItem: expenseItem, cost: cost };
        props.setCosts(newCost);
        setIndex(newCost.length);
        setExpenseItem('');
        setCost('');
        setEditing(false);
        setIsAlert(false);
        setIsAlertCost(false);
      }
    }
    props.setValid(false);
  };

  const editCost = (index: number, expenseItem: string, cost: string) => {
    setEditing(true);
    setIndex(index);
    setExpenseItem(expenseItem);
    setCost(cost);
  };

  const deleteCosts = async (item: any, deleteIndex: number) => {
    if (item.id) {
      await dispatch(
        deleteCost({
          id: item.id,
          cookie: cookies,
        })
      );
    }
    const newCost: any = props.costs.filter(
      (item, i: number) => i !== deleteIndex
    );
    props.setCosts(newCost);
  };

  useEffect(() => {
    setIndex(props.costs?.length);
  }, [props.costs?.length]);

  return (
    <div>
      <table className="text-gray-700 w-full">
        <thead className="border-b">
          <tr>
            <th className="text-left" data-testid="expenseItem-icon">
              費目
            </th>
            <th className="text-left" data-testid="cost-icon">
              支出金額
            </th>
            <th className="w-12"></th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {props.costs?.length > 0 &&
            props.costs.map((item, i: number) => (
              <tr
                className={`${
                  i % 2 === 0 && 'bg-amber'
                } border-b text-sm rounded`}
                key={i}
              >
                <td className="text-left" data-testid="expenseItem">
                  {item.expenseItem}
                </td>
                <td className="text-left" data-testid="cost">
                  ¥{Number(item.cost).toLocaleString()}
                </td>
                <td className="w-12">
                  <IconButton
                    className={classes.iconCell}
                    onClick={() => editCost(i, item.expenseItem, item.cost)}
                  >
                    <EditIcon />
                  </IconButton>
                </td>
                <td className="w-12">
                  <IconButton
                    className={classes.iconCell}
                    onClick={() => deleteCosts(item, i)}
                    data-testid="delete-icon"
                  >
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        <div className="my-6">
          <div className="text-left ml-6 sm:ml-10 md:ml-9 text-gray-700 mb-1 pl-1">
            <label htmlFor="expenseItem" data-testid="label-expenseItem">
              費目
            </label>
          </div>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-10/12 py-2 px-3 mb-5"
            id="expenseItem"
            data-testid="select-expenseItem"
            value={expenseItem}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setExpenseItem(e.target.value)
            }
          >
            <option className="hidden" value="">
              費目を選択してください
            </option>
            {expenseItems?.map((expenseItem) => (
              <option key={expenseItem.id}>{expenseItem.name}</option>
            ))}
          </select>
          {isAlert && (
            <p className="text-red-500 text-xs mt-3 italic" role="alert">
              選択された費目は既に入力されています
            </p>
          )}
          {errors.expenseItem && (
            <p className="text-red-500 text-xs mt-3 italic" role="alert">
              {errors.expenseItem.message}
            </p>
          )}
          {props.valid && (
            <p className="text-red-500 text-xs mt-3 italic" role="alert">
              最低でも1つ以上の費目・費用を追加してください
            </p>
          )}
        </div>
        <div>
          <div className="text-left ml-6 sm:ml-10 md:ml-9 text-gray-700 mb-1 pl-1">
            <label htmlFor="cost" data-testid="label-name">
              支出金額
            </label>
          </div>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-10/12 py-2 px-3 mb-5"
            id="cost"
            type="number"
            value={cost}
            data-testid="input-cost"
            placeholder="支出金額を入力"
            step="1"
            {...register('cost', {
              pattern: {
                value: /^[0-9]+$/,
                message: '支出金額は整数で入力してください',
              },
            })}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCost(e.target.value)
            }
          />
          {isAlertCost && (
            <p className="text-red-500 text-xs mt-3 mb-3 italic" role="alert">
              支出金額は1以上の整数で入力してください
            </p>
          )}
          {errors.cost && (
            <p className="text-red-500 text-xs italic" role="alert">
              {errors.cost.message}
            </p>
          )}
        </div>
      </div>
      <div className="md:text-right">
        <Button
          variant="contained"
          color="primary"
          onClick={() => addCost(index, expenseItem, cost)}
        >
          {editing ? '支出金額を変更する' : '支出項目を追加する'}
        </Button>
      </div>
    </div>
  );
};

export default CostArea;

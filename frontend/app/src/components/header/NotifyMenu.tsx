import React, { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import {
  deleteNotify,
  selectNotify,
} from '../../features/accountBook/accountBookSlice';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useHistory } from 'react-router-dom';
import { ClickAwayListener } from '@material-ui/core';
import useMedia from 'use-media';

const NotifyMenu: React.VFC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [tooltip, setTooltip] = useState(false);
  const [cookies, setCookies] = useCookies();
  const notify = useSelector(selectNotify);
  const history = useHistory();
  const isWide = useMedia({ maxWidth: '768px' });

  const handleTooltipClose = useCallback(() => {
    setTooltip(false);
  }, [setTooltip, tooltip]);

  const handleTooltipToggle = useCallback(() => {
    setTooltip(!tooltip);
  }, [setTooltip, tooltip]);

  const pageTransition = (pass: string, id: string) => {
    dispatch(deleteNotify({ id: id, cookie: cookies }));
    history.push(`/${pass}`);
    setTooltip(!tooltip);
  };

  const toDoubleDigits = (num: string) => {
    num += '';
    if (num.length == 1) {
      num = '0' + num;
    }

    return num;
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div className="mr-4 pt-4">
        <Badge badgeContent={notify[0]?.length} color="secondary">
          <NotificationsIcon
            onClick={handleTooltipToggle}
            className="cursor-pointer"
          />
          <ul
            className={`${
              tooltip ? 'opacity-100 visible' : 'opacity-0 invisible'
            } z-50 absolute w-64 top-12 right-0 bg-header-menu py-2 px-4 text-gray-600 rounded-xl shadow-xl leading-6 transition`}
          >
            {!notify[0]?.length ? (
              <li className="leading-6 border-b border-gray-300 my-2 hover:text-button-color-orange-hover transition">
                現在新着メッセージはありません。
              </li>
            ) : (
              notify[0]?.map((ntf) => {
                return (
                  <li
                    className="leading-6 border-b border-gray-300 my-2 hover:text-button-color-orange-hover transition cursor-pointer"
                    onClick={() =>
                      pageTransition(
                        `accountBook/detail/${ntf.user_id}/${ntf.date}`,
                        ntf.id
                      )
                    }
                  >
                    あなたの家計簿にコメントがつきました<br></br>
                    <span className="text-xs text-silver">
                      {toDoubleDigits(
                        String(new Date(ntf.created_at).getFullYear())
                      )}
                      /
                      {toDoubleDigits(
                        String(new Date(ntf.created_at).getMonth() + 1)
                      )}
                      /
                      {toDoubleDigits(
                        String(new Date(ntf.created_at).getDate())
                      )}
                      &nbsp;
                      {toDoubleDigits(
                        String(new Date(ntf.created_at).getHours())
                      )}
                      :
                      {toDoubleDigits(
                        String(new Date(ntf.created_at).getMinutes())
                      )}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </Badge>
      </div>
    </ClickAwayListener>
  );
};

export default NotifyMenu;

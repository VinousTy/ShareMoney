import React, { useState } from 'react';
import styles from './Top.module.scss';
import top_image_first from '../../assets/top.jpg';
import top_image_second from '../../assets/top_2.jpg';
import top_image_third from '../../assets/top_3.jpg';
import house_hold_book from '../../assets/householdbooks.png';
import logo_fixed from '../../assets/logo__fixed.png';
import search from '../../assets/search.jpg';
import rank from '../../assets/ranking.jpg';
import { useHistory } from 'react-router-dom';
import useMedia from 'use-media';
import { AiOutlineMail } from 'react-icons/ai';
import { AppDispatch } from '../../app/store';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import {
  editMessage,
  isSignIn,
  isSuccessOrFailure,
} from '../../features/auth/authSlice';
import { isGuestLoginModalOpen } from '../../features/layout/layoutSlice';
import Modals from '../../components/modals/Modals';

const topImageFirst = {
  backgroundImage: `url(${top_image_first})`,
};
const topImageSecond = {
  backgroundImage: `url(${top_image_second})`,
};
const topImageThird = {
  backgroundImage: `url(${top_image_third})`,
};

const guestPassword = String(process.env.REACT_APP_GUEST_PASSWORD);
const apiUrl = process.env.REACT_APP_DEV_API_URL;

const Top: React.VFC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [cookies, setCookie] = useCookies();
  const history = useHistory();
  const isWide = useMedia({ maxWidth: '768px' });

  const auth = {
    email: 'guest@example.com',
    password: guestPassword,
  };

  const guestLogin = async () => {
    await axios
      .post(
        `${apiUrl}api/login`,
        {
          email: auth.email,
          password: auth.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        setCookie('Bearer', res.data.access_token);
        dispatch(isSignIn());
        dispatch(isSuccessOrFailure(true));
        dispatch(editMessage('ゲストユーザーとしてログインしました'));
        history.push('/mypage');
      })
      .catch((e) => {
        console.log(e);
        alert('ログインに失敗しました。時間をおいてから再度お試しください。');
      });
  };

  return (
    <div>
      {open && (
        <Modals
          type={'guestLogin'}
          title={'ゲストユーザーでログイン'}
          body={'ゲストユーザーとしてログインします。'}
          subText={
            '※ゲストユーザーはお試しで使用することを目的としてるため、\n一部機能が制限されております。'
          }
          btnText={'OK'}
          func={guestLogin}
          packet={auth}
          path={'/mypage'}
        />
      )}
      <section className={styles.top_wrapper}>
        <div className="mx-auto my-0 w-full">
          <div className={styles.top_img_stage}>
            <div className={`${styles.top_img} h-full`} style={topImageFirst} />
            <div
              className={`${styles.top_img} h-full`}
              style={topImageSecond}
            />
            <div className={`${styles.top_img} h-full`} style={topImageThird} />
          </div>
          <div className={styles.top_text_box}>
            <h1 className={`${styles.top_title} ${styles.item_1}`}>
              It's not just about keeping an alone
              <br />
              increase assets efficiently
              <br />
            </h1>
            <p className={`${styles.top_text} ${styles.item_2}`}>
              家計簿をシェアして資産を効率的に増やそう
            </p>
          </div>
        </div>
      </section>
      <section>
        <div className={styles.about}>
          <div>
            <h3 className="">
              <span className={`${styles.about_title} ${styles.item_3}`}>
                You can refer to the household account book
              </span>
              <br />
              <span className={`${styles.about_title_sub} ${styles.item_4}`}>
                of that person you care about
              </span>
            </h3>
            <p className={`${styles.about_text} ${styles.item_5}`}>
              気になるあの人の家計管理術をチェック
            </p>
            <p className={`${styles.about_text_sub} ${styles.item_6}`}>
              全国各地で作成された家計簿が集約されています。
              <br />
              あなたの家計管理術を駆使した家計簿をシェアしあい日々の生活を今より「豊か」にしよう！
            </p>
            <div className={`${styles.button_box} ${styles.item_7}`}>
              <button
                type="button"
                className={`${styles.button} `}
                onClick={() => history.push('/signup')}
              >
                今すぐ使ってみる
              </button>
            </div>
          </div>
          {!isWide && (
            <img className={styles.about_img} src={house_hold_book} alt="" />
          )}
        </div>
      </section>
      <section className={styles.solution}>
        <div className={styles.deco_box}></div>
        <div className={styles.solution_title_box}>
          <h2 className={`${styles.solution_title} ${styles.item_8}`}>
            <span>Solution</span>
          </h2>
          <h3 className={`${styles.solution_title_sub} ${styles.item_9}`}>
            solve any problem
          </h3>
        </div>
        <p className={`${styles.solution_text} ${styles.item_10}`}>
          新生活を開始する際にかかる費用などの把握に活用することが可能です。
          <br />
          家計簿をシェア・共有することが可能のため、同職種や同じような世帯構成などのユーザーの家計管理術を参考にできます。
          <br />
          そのため、新生活や結婚などライフイベントの変化時にかかる実際に発生した
          <span className="text-orange">「生の費用」</span>
          をなるべく見える化することで、お金に対する不安の軽減・対策を講じる講じることができます。
        </p>
        <div className={`${styles.solution_button_box} ${styles.item_11}`}>
          <button
            className={styles.solution_button}
            onClick={() => {
              dispatch(isGuestLoginModalOpen());
              setOpen(true);
            }}
          >
            まずはお試しで使ってみる
          </button>
        </div>
        <div className={styles.fixed_bg}>
          <h2 className={styles.fixed_bg_title}>
            <img
              src={logo_fixed}
              alt="SharesMoney"
              className="w-9/12 mx-auto sm:w-6/12 md:w-5/12 lg:w-4/12"
            />
          </h2>
        </div>
      </section>
      <section>
        <div className={styles.function_wrap}>
          <div className={styles.deco_box}></div>
          <div className={styles.function_wrap_title_box}>
            <h2 className={`${styles.function_wrap_title} ${styles.item_12}`}>
              Function
            </h2>
          </div>
          <div className={styles.function_content}>
            <div>
              <div className={styles.function_content_imgframe}>
                <img
                  className={styles.function_content_imgframe_img}
                  src={search}
                  alt=""
                />
              </div>
              <div
                className={`${styles.function_content_text_area} ${styles.item_13}`}
              >
                <h3 className={styles.function_content_text_area_title}>
                  Household&nbsp;share
                </h3>
                <h4 className={styles.function_content_text_area_title_sub}>
                  家計簿の共有
                </h4>
                <p className={styles.function_content_text_area_text}>
                  「家計簿シェア機能」を搭載しているため、夫婦・恋人間での家計簿の共有が可能です。また、自動でシェアされることはないため、作成した家計簿が気づかぬうちに不特定多数に知られてしまうことはありません。
                </p>
              </div>
            </div>
            <div>
              <div
                className={`${styles.function_content_imgframe} ${styles.function_content_imgframe_2}`}
              >
                <img
                  className={styles.function_content_imgframe_img}
                  src={search}
                  alt=""
                />
              </div>
              <div
                className={`${styles.function_content_text_area} ${styles.item_14}`}
              >
                <h3 className={styles.function_content_text_area_title}>
                  Interesting&nbsp;user&nbsp;search
                </h3>
                <h4 className={styles.function_content_text_area_title_sub}>
                  気になるユーザーの検索
                </h4>
                <p className={styles.function_content_text_area_text}>
                  「検索機能」を搭載しているため、気になるユーザーの絞り込みが可能です。ユーザー名だけでなく、職種や世帯構成などでも検索でき、同世代や同職種の方の家計管理をお助けします。
                </p>
              </div>
            </div>
            <div>
              <div
                className={`${styles.function_content_imgframe} ${styles.function_content_imgframe_3}`}
              >
                <img
                  className={styles.function_content_imgframe_img}
                  src={rank}
                  alt=""
                />
              </div>
              <div
                className={`${styles.function_content_text_area} ${styles.item_15}`}
              >
                <h3 className={styles.function_content_text_area_title}>
                  Recommended&nbsp;＆&nbsp;Ranking
                </h3>
                <h4 className={styles.function_content_text_area_title_sub}>
                  おすすめ＆ランキング
                </h4>
                <p className={styles.function_content_text_area_text}>
                  「おすすめ・ランキング機能」を搭載しており、あなたと近しいユーザーのレコメンドに加え、素敵なユーザーの家計簿を瞬時に表示させることで、あなたの家計管理に役立てます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className={styles.contact}>
          <div className={styles.contact_stage}>
            <div className={styles.contact_stage_img}></div>
          </div>
          <div className={styles.contact_box}>
            <p className={styles.contact_box_text}>
              ご不明点やご要望がありましたら、
              <br />
              お気軽にお問い合わせください。
            </p>
            <div className="text-center">
              <div className="inline-block">
                <a
                  onClick={() => history.push('contact')}
                  className={styles.contact_box_button}
                >
                  <AiOutlineMail className="mr-2" />
                  <span className={styles.contact_box_button_text}>
                    Contact
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Top;

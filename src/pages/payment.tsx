import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
import { GetServerSideProps } from 'next';
import { UserCart } from '../types/user';
import Image from 'next/image';
import styles from '../styles/payment.module.css';
import Head from 'next/head';
import { loadStripe } from '@stripe/stripe-js';
import Header from '../components/Header';
import { SessionUser } from 'pages/api/getSessionInfo';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export const getServerSideProps: GetServerSideProps =
  withIronSessionSsr(async ({ req, query }) => {
    // ユーザー情報の取得
    let user: SessionUser = {
      isLoggedIn: false,
    };
    // ログインしている場合、カート情報を取得する
    if (req.session.user) {
      user.id = req.session.user.id;
      const url = `https://v8wqod3cx8.execute-api.ap-northeast-1.amazonaws.com/selectCart?userId=${user.id}`;
      const response = await axios(url);
      const res = await response.data;
      // const res = await SelectCart(user.userId);
      user.userCarts = res.cart;
      user.isLoggedIn = true;
    }

    // stripeエラー時の判定情報を設定
    const { error } = query;
    let errorflg = '';
    if (error && typeof error === 'string') {
      errorflg = error;
    }
    return {
      props: {
        user: user,
        stripeError: errorflg,
      },
    };
  }, ironOptions);

export default function Payment({
  user,
  stripeError,
}: {
  user: SessionUser;
  stripeError: string;
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(user.isLoggedIn);

  // ログインしていない場合は、トップ画面へ
  if (!isLoggedIn) {
    router.push(`/`);
  }
  // 合計金額
  const sum = user.userCarts
    ?.map((item) => item.price)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

  return (
    <>
      <Head>
        <title>決済画面</title>
      </Head>
      <Header
        isLoggedIn={isLoggedIn}
        dologout={() => setIsLoggedIn(!isLoggedIn)}
      />
      <main className={styles.paymentMain}>
        {stripeError && (
          <div className={styles.errorWrapper}>
            <p className={styles.errorMessage}>
              決済処理中にエラーが発生しました。
              <br />
              時間を置いて再度お試しください。
            </p>
          </div>
        )}
        <section className={styles.orderWrapper}>
          <h1>ご注文内容</h1>
          {user.userCarts?.map((item: UserCart) => (
            <div className={styles.itemGrop} key={item.itemId}>
              <div className={styles.itemWrapper}>
                <div className={styles.ItemInfo}>
                  <Image
                    src={item.itemImage}
                    width={200}
                    height={112}
                    alt={'商品画像のURL'}
                    priority
                  />
                  <div className={styles.itemName}>
                    <p>{item.itemName}</p>
                    <p>レンタル期間：{item.rentalPeriod}泊</p>
                  </div>
                </div>
                <div className={styles.price}>
                  <p>価格</p>
                  <div>{item.price}円</div>
                </div>
              </div>
            </div>
          ))}
          <div className={styles.count}>
            合計:{user.userCarts?.length}点
          </div>
        </section>

        <form action="/api/checkout_stripe" method="POST">
          <div className={styles.sumPrice}>ご請求金額：{sum}円</div>
          <input type="hidden" name="price" value={sum} />
          <div className={styles.btnWrapper}>
            <button
              type="submit"
              className={`${styles.paymentBtn} ${styles.bgleft}`}
            >
              <span>決済する</span>
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { UserCart } from 'types/user';
import styles from 'styles/cart.module.css';
import DeleteBtn from '../components/DeleteItem';
import UseSWR, { mutate } from 'swr';
import Header from '../components/Header';
import Head from 'next/head';
import loadStyles from 'styles/loading.module.css';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
import { GetServerSideProps } from 'next';
import { SessionUserCart } from 'types/session';
import { useEffect, useState } from 'react';
import axios from 'axios';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getServerSideProps: GetServerSideProps =
  withIronSessionSsr(async ({ req }) => {
    // ユーザーIDを渡すかitemIdを渡すかの分岐をしてから渡す
    let userId = req.session.user?.id;
    if (userId) {
      // ログイン後
      const url = `${process.env.NEXT_PUBLIC_API_URL}/selectCart?userId=${userId}`;
      const response = await axios.get(url);
      const res = await response.data;
      // const res = await SelectCart(userId);
      if (res.errorFlg) {
        return {
          redirect: {
            permanent: false,
            destination: '/error',
          },
        };
      }
      return {
        props: {
          cart: res.cart,
        },
      };
    } else {
      // ログイン前
      let cart: SessionUserCart[];
      if (!req.session.cart) {
        cart = [];
      } else {
        cart = req.session.cart;
      }
      return {
        props: { cart },
      };
    }
  }, ironOptions);

export default function CartList({ cart }: { cart: UserCart[] }) {
  const [cartItem, setCartItem] = useState(cart);
  const { data } = UseSWR('/api/getSessionInfo', fetcher);

  const isLoggedIn = data?.isLoggedIn;

  useEffect(() => {
    if (!isLoggedIn) {
      setCartItem(cart);
    }
  }, [isLoggedIn, cart]);

  if (!data)
    return (
      <div className={loadStyles.loadingArea}>
        <div className={loadStyles.bound}>
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>g</span>
          <span>...</span>
        </div>
      </div>
    );

  // ユーザーのidを取得予定
  const id = data.id;

  let isCartflg = true;
  if (!cartItem?.length) {
    isCartflg = false;
  }

  // 合計金額の表示
  let sum: number[] = [];
  if (cartItem !== undefined) {
    cartItem.map((item) => {
      sum.push(item.price);
      console.log(item.itemImage);
      // if (item.rentalPeriod === 2) {
      //   sum.push(item.item.twoDaysPrice);
      // } else if (item.rentalPeriod === 7) {
      //   sum.push(item.item.sevenDaysPrice);
      // }
    });
  }

  let total;
  if (!sum.length) {
    total = 0;
  } else {
    total = sum.reduce((accu, curr) => accu + curr);
  }
  return (
    <>
      <Head>
        <title>カート</title>
      </Head>
      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => mutate('/api/getSessionInfo')}
      />
      <main className={styles.cart}>
        {cartItem?.map((item: UserCart) => {
          return (
            <div className={styles.cartContent} key={item.id}>
              <div className={styles.cartMedia}>
                <div className={styles.cartInner}>
                  <div className={styles.cartBodyWrapper}>
                    <figure className={styles.cartImgWrapper}>
                      <Image
                        className={styles.cartImg}
                        src={item.itemImage}
                        width={200}
                        height={112}
                        alt="商品の画像"
                        priority
                      />
                    </figure>
                    <div className={styles.cartBody}>
                      <p className={styles.cartTitle}>
                        {item.itemName}
                      </p>
                      <p>
                        レンタル期間：
                        {item.rentalPeriod === 2 ? '48時間' : '7泊'}
                      </p>
                      <Link
                        href={`/items/${item.itemId}`}
                        legacyBehavior
                      >
                        <a>詳細ページへ</a>
                      </Link>
                    </div>
                  </div>
                  <div className={styles.cartPriceWrapper}>
                    <p>価格</p>
                    <p className={styles.cartPrice}>{item.price}円</p>
                    <DeleteBtn
                      id={id}
                      cartId={item.id}
                      itemId={item.itemId}
                      rebuild={(cart) => setCartItem(cart)}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {!isCartflg && (
          <p className={styles.isCartFlg}>カートの中身はありません</p>
        )}
        <div className={styles.btnWrapper}>
          <div className={styles.totalPrice}>
            <p>合計金額{total}円</p>
          </div>
          {!isCartflg ? (
            <Link href="/search?categories_like=&q=">
              <button
                className={`${styles.cartBtn} ${styles.bgleft}`}
              >
                <span>商品を探す</span>
              </button>
            </Link>
          ) : (
            <>
              {data.isLoggedIn ? (
                <Link href="/payment">
                  <button
                    className={`${styles.cartBtn} ${styles.bgleft}`}
                  >
                    <span>決済へ進む</span>
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <p>※決済に進むにはログインが必要です</p>
                  <button
                    className={`${styles.cartBtn} ${styles.bgleft}`}
                  >
                    <span>ログインしてください</span>
                  </button>
                </Link>
              )}
            </>
          )}
        </div>
        <style jsx>
          {`
            p {
              margin-block-start: 0;
              margin-block-end: 0;
            }
          `}
        </style>
      </main>
    </>
  );
}

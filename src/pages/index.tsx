import Head from 'next/head';
import { Item } from 'types/item';
import Header from '../components/Header';
import ItemList from 'components/ItemList';
import UseSWR, { mutate } from 'swr';
import RecommendItemList from 'components/RecommendItemList';
import loadStyles from 'styles/loading.module.css';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
import { useState } from 'react';
import { SessionUser } from './api/getSessionInfo';
import axios from 'axios';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Top({
  newItems,
  genreItems,
  useChatbot,
  userName,
}: {
  newItems: Array<Item>;
  genreItems: Array<Item>;
  useChatbot: boolean;
  userName: string;
}) {
  let [doLogout, setLogout] = useState(false);
  const logout = () => {
    setLogout(true);
    mutate('/api/getSessionInfo');
  };

  const { data } = UseSWR<SessionUser>(
    '/api/getSessionInfo',
    fetcher
  );
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

  return (
    <>
      <Head>
        <title>トップページ - Festal</title>
      </Head>
      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => logout()}
      />
      <ItemList items={newItems} />
      <RecommendItemList
        items={genreItems}
        user={data}
        useChatbot={useChatbot}
        doLogout={doLogout}
        userName={userName}
      />
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    const take = 10;
    // ユーザー情報の取得
    let user: SessionUser = {
      isLoggedIn: false,
    };
    let favoriteId = 3;
    let userName = 'guest';
    let useChatbot = false;
    // ログインしている場合、favoriteIdを取得する
    if (req.session.user) {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/getUser?id=${req.session.user.id}`;
      const response = await axios.get(url);
      const data = await response.data;
      if (data?.favoriteGenre) {
        favoriteId = data.favoriteGenre;
        useChatbot = true;
      }
      if (data?.userName) {
        userName = data.userName;
      }
      user.id = req.session.user.id;
      user.isLoggedIn = true;
    }

    // 作品情報取得
    const url = `${process.env.NEXT_PUBLIC_API_URL}/preTop?genre=${favoriteId}`;
    const response = await axios.get(url);
    const { newItems, genreItems } = await response.data;

    return {
      props: {
        newItems,
        genreItems,
        favoriteId,
        useChatbot,
        userName,
      },
    };
  },
  ironOptions
);

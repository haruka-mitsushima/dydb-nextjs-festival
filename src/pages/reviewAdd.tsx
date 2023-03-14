import Head from 'next/head';
import Image from 'next/image';
import { SyntheticEvent, useState } from 'react';
import loadStyles from 'styles/loading.module.css';
import reviewStyles from 'styles/review.module.css';
import router from 'next/router';
import { Item } from 'types/item';
import ReviewForm from '../components/ReviewForm';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from './api/getSessionInfo';
import Header from '../components/Header';
import axios from 'axios';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Review({ item }: { item: Item }) {
  let [doLogout, setLogout] = useState(false);
  const [formReviewTitle, setFormReviewTitle] = useState('');
  const [formReviewText, setFormReviewText] = useState('');
  const [formEvaluation, setFormEvaluation] = useState(0);
  const [formSpoiler, setFormSpoiler] = useState(false);

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
  if (!data.isLoggedIn) {
    router.push(`/`);
  }

  //投稿ボタンを押した時
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const postTime = new Date();
    const postTimeYear = postTime.getFullYear();
    const postTimeMonth = postTime.getMonth() + 1;
    const postTimeDate = postTime.getDate();
    const postTimeHours = postTime.getHours();
    const postTimeMinutes = postTime.getMinutes();

    const nowPostTime = `${postTimeYear}/${postTimeMonth}/${postTimeDate} ${postTimeHours}:${postTimeMinutes}`;

    const body = {
      itemId: item.id,
      userId: data.id,
      postTime: nowPostTime,
      reviewTitle: formReviewTitle,
      reviewText: formReviewText,
      evaluation: formEvaluation,
      spoiler: formSpoiler,
    };

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/review/createReview`,
        body
      )
      .then(() => {
        router.push(`/items/${item.id}`); //e.preventDefault()を行なった為、クライアント側の遷移処理をここで行う
      });
  };

  const logout = () => {
    setLogout(true);
    mutate('/api/getSessionInfo');
  };

  return (
    <>
      <Head>
        <title>
          {item.artist}
          {item.fesName}レビュー
        </title>
      </Head>

      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => logout()}
      />

      <div>
        <Image
          src={`${item.itemImage}`}
          alt="画像"
          width={400}
          height={225}
        />
        <p>
          {item.artist}　{item.fesName}
        </p>
      </div>
      <main>
        <h2>レビュー</h2>
        <form onSubmit={handleSubmit}>
          <ReviewForm
            item={item}
            formReviewTitle={formReviewTitle}
            formReviewText={formReviewText}
            formEvaluation={formEvaluation}
            formSpoiler={formSpoiler}
            setFormReviewTitle={setFormReviewTitle}
            setFormReviewText={setFormReviewText}
            setFormEvaluation={setFormEvaluation}
            setFormSpoiler={setFormSpoiler}
          />
          <div>
            <button type="submit">投稿する</button>
          </div>
        </form>
      </main>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async ({ req, query }) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/item/getItemById/${query.itemId}`;
    const response = await axios.get(url);
    const item = await response.data;
    if (!req.session.user) {
      return {
        redirect: {
          permanent: false,
          destination: '/error',
        },
      };
    }

    if (item) {
      const tmp: Item = item;
      tmp.releaseDate = String(item?.releaseDate);
    }

    return {
      props: {
        item,
      },
    };
  },
  ironOptions
);

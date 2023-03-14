import styles from 'styles/review.module.css';
import { useEffect, useState } from 'react';
import ReviewSelect from './ReviewSort';
import { Item } from 'types/item';
import { User } from '@prisma/client';
import axios from 'axios';

type Review = {
  reviewId: number;
  itemId: number;
  userId: number;
  postTime: string;
  reviewTitle: string;
  reviewText: string;
  evaluation: number;
  spoiler: boolean;
  items: Item;
  user: User;
};

export default function Review({ itemId }: { itemId: string }) {
  const [orderBy, setOrderBy] = useState('reviewId');
  const [order, setOrder] = useState('desc');
  const [average, setAverage] = useState({
    average: 0,
    totalCount: 0,
  });
  const [review, setReview] = useState([]);
  const pageSize = 5;

  const range = (start: number, end: number) =>
    [...Array(end - start + 1)].map((_, i) => start + i);

  useEffect(() => {
    const body = { itemId, orderBy, order, page: 1, pageSize };
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/review/getSortedReview`;
    axios.post(url, body).then((res) => setReview(res.data));
  }, [itemId, order, orderBy]);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/review/getAverageScore/${itemId}`
      )
      .then((res) => setAverage(res.data));
    // fetch(
    //   `http://localhost:3005/api/review/getAverageScore/${itemId}`
    // )
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setAverage(data);
    //   });
  }, [itemId]);

  const onClick = (number: number) => {
    const body = { itemId, orderBy, order, page: number, pageSize };
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/review/getSortedReview`;
    axios.post(url, body).then((res) => setReview(res.data));
    // const params = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(body),
    // };
    // fetch(url, params)
    //   .then((res) => res.json())
    //   .then((data) => setReview(data));
  };

  const totalCount = average.totalCount;

  // 平均点を四捨五入
  let rate = Math.round(average.average * 2) / 2;

  if (average.average === 0) {
    rate = 0;
  }

  // 動的APIルーティングの値を変更
  const selectChange = (value: string) => {
    const result = value.split(',');
    setOrderBy(result[0]);
    setOrder(result[1]);
  };

  return (
    <>
      <section className={styles.accordionWrapper}>
        <h1 className={styles.title}>レビュー</h1>
        <p className={styles.score}>総合{average.average}点</p>
        <p className={styles.star}>
          <span className={styles.rating} data-rate={rate}></span>
        </p>
        <div className={styles.accordionOuter}>
          <ReviewSelect selectChange={selectChange} />
          {review.map((review: Review) => {
            return (
              <div key={review.reviewId} className={styles.accordion}>
                <input
                  type="checkbox"
                  className={styles.toggle}
                  id={String(review.reviewId)}
                />
                <label
                  className={styles.label}
                  htmlFor={String(review.reviewId)}
                >
                  {review.reviewTitle}
                  {review.spoiler && (
                    <span className={styles.tag}>ネタバレあり </span>
                  )}
                </label>
                <div className={styles.contentBody}>
                  <p>投稿者名：{review.user.userName}</p>
                  <p>投稿日：{review.postTime}</p>
                  <p>点数：{review.evaluation}点</p>
                  <p>{review.reviewText}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {range(1, Math.ceil(totalCount / pageSize)).map(
        (number, index) => (
          <button
            className={styles.pagingBtn}
            key={index}
            onClick={() => onClick(number)}
          >
            {number}
          </button>
        )
      )}
      <style jsx>
        {`
          p {
            margin-block-start: 0;
            margin-block-end: 0;
          }
        `}
      </style>
    </>
  );
}

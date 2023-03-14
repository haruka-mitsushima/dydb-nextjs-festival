import styles from 'styles/detail.module.css';
import useSWR from 'swr';
import loadStyles from 'styles/loading.module.css';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Review({
  userId,
  id,
  isRentaled,
  isLoggedIn,
}: {
  userId: string;
  id: string;
  isRentaled: boolean;
  isLoggedIn: boolean | undefined;
}) {
  // ユーザーのレビュー情報を取得
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/review/getUserReview/${userId}/${id}`,
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

  //レビューされた商品の場合はフラグを変更
  let isReviewed = false;
  if (data.isReviewed) {
    isReviewed = true;
  }

  // ログアウトした際にボタンを非表示にする
  if (!isLoggedIn) {
    isRentaled = false;
  }

  return (
    <>
      {isRentaled ? (
        <>
          {isReviewed ? (
            <Link href={`/reviewUpdate?reviewId=${data.reviewId}`}>
              <button className={styles.btnReview}>編集する</button>
            </Link>
          ) : (
            <Link href={`/reviewAdd?itemId=${id}`}>
              <button className={styles.btnReview}>
                レビューする
              </button>
            </Link>
          )}
        </>
      ) : null}
    </>
  );
}

import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from 'styles/search.module.css';

export default function SearchForm() {
  const [data, setData] = useState<string>('');
  const [genre, setGenre] = useState<string>('0');
  const router = useRouter();
  function search(e: { preventDefault: () => void }) {
    e.preventDefault();
    router.push({
      pathname: '/search',
      query: {
        categories: genre,
        q: data,
        page: 1,
        orderBy: 'id',
        order: 'desc',
      },
    });
  }
  return (
    <>
      <div className={styles.searchForm}>
        <form method="get" id="form" onSubmit={search}>
          <div className={styles.headline}>キーワード検索</div>
          <input
            placeholder="キーワードを入力"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <div className={styles.headline}>ジャンルで絞り込み</div>
          <ul className={styles.radioUl}>
            <li key={1} className={styles.radioLi}>
              <input
                name="genre"
                id="1"
                type="radio"
                value={1}
                onChange={(e) => setGenre(e.target.value)}
              />
              <label htmlFor="1">J-POP</label>
            </li>
            <li key={2} className={styles.radioLi}>
              <input
                name="genre"
                id="2"
                type="radio"
                value={2}
                onChange={(e) => setGenre(e.target.value)}
              />
              <label htmlFor="2">アイドル</label>
            </li>
            <li key={3} className={styles.radioLi}>
              <input
                name="genre"
                id="3"
                type="radio"
                value={3}
                onChange={(e) => setGenre(e.target.value)}
              />
              <label htmlFor="3">邦楽ロック</label>
            </li>
            <li key={4} className={styles.radioLi}>
              <input
                name="genre"
                id="4"
                type="radio"
                value={4}
                onChange={(e) => setGenre(e.target.value)}
              />
              <label htmlFor="4">洋楽ロック</label>
            </li>
            <li key={5} className={styles.radioLi}>
              <input
                name="genre"
                id="5"
                type="radio"
                value={5}
                onChange={(e) => setGenre(e.target.value)}
              />
              <label htmlFor="5">アニソン</label>
            </li>
            <li key={6} className={styles.radioLi}>
              <input
                name="genre"
                id="6"
                type="radio"
                value={6}
                onChange={(e) => setGenre(e.target.value)}
              />
              <label htmlFor="6">男性アーティスト</label>
            </li>
            <li key={7} className={styles.radioLi}>
              <input
                name="genre"
                id="7"
                type="radio"
                value={7}
                onChange={(e) => setGenre(e.target.value)}
              />
              <label htmlFor="7">女性アーティスト</label>
            </li>
          </ul>
          <button className={styles.searchBtn} type="submit">
            検索
          </button>
        </form>
      </div>
    </>
  );
}

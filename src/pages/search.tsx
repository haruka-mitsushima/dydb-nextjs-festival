import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Item } from 'types/item';
import styles from 'styles/search.module.css';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Pagination from 'components/Paging';
import SearchForm from 'components/SearchForm';
import SortSelect from 'components/SortSelect';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from '../pages/api/getUser';
import loadStyles from 'styles/loading.module.css';
import axios from 'axios';

// 1ページあたりの最大表示件数を指定
const PAGE_SIZE = 10;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Props = {
  items: Array<Item>;
  newItems?: Array<Item>;
  keyword: string;
  genre: string;
  page: number;
  totalCount: number;
  sort: string;
  orderBy: string;
  order: string;
};

export default function Search({
  items,
  newItems,
  keyword,
  genre,
  page,
  totalCount,
  orderBy,
  order,
}: Props) {
  const router = useRouter();
  const onClick = (index: number) => {
    router.push({
      pathname: '/search',
      query: {
        categories: genre,
        q: keyword,
        page: index,
        orderBy: orderBy,
        order: order,
      },
    });
  };
  const onSortChange = (value: string) => {
    const order = value.split(`,`);
    router.push({
      pathname: '/search',
      query: {
        categories: genre,
        q: keyword,
        orderBy: order[0],
        order: order[1],
      },
    });
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
        <title>検索</title>
      </Head>
      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => mutate('/api/getSessionInfo')}
      />
      <main className={styles.container}>
        <SearchForm />
        <div className={styles.searchResult}>
          {newItems ? (
            <div>
              <div className={styles.p}>新着作品</div>
              <section className={styles.itemList}>
                {newItems.map((item) => {
                  return (
                    <div key={item.id} className={styles.item}>
                      <Link href={`/items/${item.id}`}>
                        <Image
                          src={item.itemImage}
                          width={400}
                          height={225}
                          alt={item.artist}
                          className={styles.itemImage}
                          priority
                        />
                        <br />
                        <div className={styles.artist}>
                          {item.artist}
                        </div>
                        <div className={styles.fesName}>
                          {item.fesName}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </section>
            </div>
          ) : totalCount === 0 ? (
            <div>
              <div className={styles.components}>
                <div className={styles.searchCount}>
                  検索結果：{totalCount}件
                </div>
                <SortSelect onSortChange={onSortChange} />
              </div>
              <div className={styles.errorMessage}>
                条件に合う検索結果がありません。
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.components}>
                <div className={styles.searchCount}>
                  検索結果：{totalCount}件
                </div>
                <SortSelect onSortChange={onSortChange} />
              </div>
              <section className={styles.itemList}>
                {items.map((item) => {
                  return (
                    <div key={item.id} className={styles.item}>
                      <Link href={`/items/${item.id}`}>
                        <Image
                          src={item.itemImage}
                          width={400}
                          height={225}
                          alt={item.artist}
                          className={styles.itemImage}
                          priority
                        />
                        <br />
                        <div className={styles.artist}>
                          {item.artist}
                        </div>
                        <div className={styles.fesName}>
                          {item.fesName}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </section>
            </div>
          )}
          <Pagination
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            currentPage={page}
            onClick={onClick}
          />
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext) {
  let newItems = null;
  let searchItems = [];
  let count = null;
  const keyword = query.q ? query.q : '';
  const genre = query.page ? query.categories : '0';
  const page = query.page ? Number(query.page) : 1;
  const orderBy = query.orderBy ? query.orderBy : 'id';
  const order = query.order ? query.order : 'desc';
  const take = PAGE_SIZE;

  if (keyword.length === 0 && genre === '0') {
    const res = await axios.get(
      `https://v8wqod3cx8.execute-api.ap-northeast-1.amazonaws.com/getNewItems`
    );
    const selectNew = await res.data;
    newItems = selectNew;
  } else if (keyword.length === 0 && genre !== '0') {
    const body = { genre, orderBy, order, page, take };
    const url = `https://v8wqod3cx8.execute-api.ap-northeast-1.amazonaws.com/search`;
    const response = axios.post(url, body);
    const data = await (await response).data;
    searchItems = data.searchItems;
    count = data.count;
  } else if (keyword.length !== 0 && genre === '0') {
    const body = { keyword, orderBy, order, page, take };
    const url = `https://v8wqod3cx8.execute-api.ap-northeast-1.amazonaws.com/wordSearch`;
    const response = axios.post(url, body);
    const data = await (await response).data;
    searchItems = data.searchItems;
    count = data.count;
  } else {
    const body = { keyword, genre, orderBy, order, page, take };
    const url = `https://v8wqod3cx8.execute-api.ap-northeast-1.amazonaws.com/cloudSearch`;
    const response = axios.post(url, body);
    const data = await (await response).data;
    searchItems = data.searchItems;
    count = data.count;
  }

  return {
    props: {
      items: searchItems,
      newItems: newItems,
      keyword: keyword,
      genre: genre,
      page: page,
      totalCount: count,
      orderBy: orderBy,
      order: order,
    },
  };
}

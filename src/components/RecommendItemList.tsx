import Link from 'next/link';
import Image from 'next/image';
import { Item } from 'types/item';
import styles from 'styles/itemList.module.css';
import { SessionUser } from 'pages/api/getUser';
import Router from 'next/router';
import UseSWR from 'swr';

const fetcher = (url: string, init: any) =>
  fetch(url, init).then((res) => res.json());

export default function RecommendItemList({
  items,
  user,
  useChatbot,
  doLogout,
  userName,
}: {
  items: Array<Item>;
  user: SessionUser;
  useChatbot: boolean;
  doLogout: boolean;
  userName: string;
}) {
  let logItems: Array<Item> = [];
  if (doLogout) {
    const id = 3;
    const { data } = UseSWR<Array<Item>>(
      `https://r0tghxji3l.execute-api.ap-northeast-1.amazonaws.com/getItemByGenre?genre=${id}`,
      fetcher
    );
    if (data) {
      logItems.push(...data);
    }
    // const getLogItems = async () => {
    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/api/item/favorite/${id}/${take}`
    //   );
    //   const data = await response.json();
    //   logItems = tmpItems.concat(...data);
    // };
    // getLogItems();
    // fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/api/item/favorite/${id}/${take}`
    // )
    //   .then((res) => res.json())
    //   .then((data) => {
    //     logItems = tmpItems.concat(data);
    //   });
  }

  const route = () => {
    Router.push('/chatbot');
  };
  return (
    <main>
      {user.isLoggedIn ? (
        useChatbot ? (
          <div className={styles.p}>{userName}さんへのおすすめ</div>
        ) : (
          <div className={styles.btnWrapper}>
            <button
              className={styles.chatbotButtonBefore}
              onClick={route}
            >
              やってみよう！ <br className={styles.br} />{' '}
              チャットボット
            </button>
          </div>
        )
      ) : (
        <div className={styles.p}>邦楽ロック</div>
      )}
      {user.isLoggedIn ? (
        useChatbot ? (
          <section className={styles.itemList}>
            {items.map((item) => {
              return (
                <Link
                  key={item.id}
                  href={`/items/${item.id}`}
                  className={styles.item}
                >
                  <Image
                    src={item.itemImage}
                    width={400}
                    height={225}
                    alt={item.artist}
                    className={styles.itemImage}
                    priority
                  />
                  <div className={styles.detail}>
                    <div className={styles.artist}>{item.artist}</div>
                    <div className={styles.fesName}>
                      {item.fesName}
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        ) : (
          <div></div>
        )
      ) : logItems.length ? (
        <section className={styles.itemList}>
          {logItems.map((item) => {
            return (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className={styles.item}
              >
                <Image
                  src={item.itemImage}
                  width={400}
                  height={225}
                  alt={item.artist}
                  className={styles.itemImage}
                  priority
                />
                <div className={styles.detail}>
                  <div className={styles.artist}>{item.artist}</div>
                  <div className={styles.fesName}>{item.fesName}</div>
                </div>
              </Link>
            );
          })}
        </section>
      ) : (
        <section className={styles.itemList}>
          {items.map((item) => {
            return (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className={styles.item}
              >
                <Image
                  src={item.itemImage}
                  width={400}
                  height={225}
                  alt={item.artist}
                  className={styles.itemImage}
                  priority
                />
                <div className={styles.detail}>
                  <div className={styles.artist}>{item.artist}</div>
                  <div className={styles.fesName}>{item.fesName}</div>
                </div>
              </Link>
            );
          })}
        </section>
      )}
      {user.isLoggedIn ? (
        useChatbot ? (
          <div className={styles.btnWrapper}>
            <button className={styles.chatbotButton} onClick={route}>
              チャットボット
            </button>
          </div>
        ) : (
          <div></div>
        )
      ) : (
        <div></div>
      )}
    </main>
  );
}

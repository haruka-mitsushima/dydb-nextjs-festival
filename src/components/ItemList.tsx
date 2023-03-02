import Link from 'next/link';
import Image from 'next/image';
import { Item } from 'types/item';
import styles from 'styles/itemList.module.css';

export default function ItemList({ items }: { items: Array<Item> }) {
  return (
    <main className={styles.main}>
      <div className={styles.p}>新着作品</div>
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
                priority
                alt={item.artist}
                className={styles.itemImage}
              />
              <div className={styles.detail}>
                <div className={styles.artist}>{item.artist}</div>
                <div className={styles.fesName}>{item.fesName}</div>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}

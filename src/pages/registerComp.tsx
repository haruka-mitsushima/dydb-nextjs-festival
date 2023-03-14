import Head from 'next/head';
import Link from 'next/link';
import styles from 'styles/registerComp.module.css';
import Image from 'next/image';
import styleHeader from 'styles/header.module.css';

export default function Completion() {
  return (
    <>
      <Head>
        <title>登録完了</title>
      </Head>
      <header className={styleHeader.header}>
        <div className={styleHeader.info}>
          <Image
            src={
              'https://aws-lambda-images-418581597558.s3.ap-northeast-1.amazonaws.com/logo.png'
            }
            width={232}
            height={70}
            alt={'タイトルロゴ'}
          />
        </div>
      </header>

      <main className={styles.registerCompMain}>
        <div className={styles.contents}>
          <p>
            登録完了いたしました
            <br />
            ご登録ありがとうございます。
          </p>

          <Link href={`/login`} className={styles.loginLink}>
            <button className={styles.registerBtn}>
              ログイン画面へ
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}

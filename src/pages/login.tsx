import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from 'styles/login.module.css';
import Image from 'next/image';
import Header from '../components/Header';
import axios from 'axios';

export default function Home() {
  const [mailAddress, setMailAddress] = useState(''); //名前の情報を更新して保存
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  //ログイン
  const submitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault(); //既定の動作を止める
    const body = {
      mailAddress,
      password,
    };
    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    };
    await fetch('/api/login', params).then(async (res) => {
      if (res.status === 200) {
        await axios
          .get('/api/addLogedinCart')
          .then(() => router.push('/'));
      } else {
        setErrorMessage(
          '※メールアドレスまたはパスワードが間違っています'
        );
      }
    });
  };

  return (
    <>
      <Head>
        <title>ログイン</title>
      </Head>
      <Header
        isLoggedIn={false}
        dologout={() => false}
        login={true}
      />
      <main className={styles.loginMain}>
        <section className={styles.formWrapper}>
          <h1>
            <Image
              src={'/images/logo.png'}
              width={190}
              height={60}
              alt={'タイトルロゴ'}
            />
          </h1>
          <form onSubmit={submitHandler} className={styles.loginForm}>
            <span id="Message"></span>
            <ul>
              <li>
                <label>メールアドレス</label>
                <input
                  type="email"
                  name="mailAddress"
                  id="mailAddress"
                  value={mailAddress}
                  onChange={(e) => setMailAddress(e.target.value)}
                />
              </li>
              <li>
                <label>パスワード</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </li>
            </ul>
            <p className={styles.erroMessage}>{errorMessage}</p>
            <button type="submit" className={styles.loginBtn}>
              ログイン
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

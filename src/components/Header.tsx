import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from 'styles/header.module.css';

type headerProps = {
  isLoggedIn?: boolean;
  // ログアウト後処理を受け取る
  dologout: () => void;
  login?: boolean;
};

export default function Header({
  isLoggedIn,
  dologout,
  login,
}: headerProps) {
  const [hanbergar, setHanbergar] = useState(true);

  return !login ? (
    // ログイン・ユーザ登録以外の画面の場合
    <header className={styles.header}>
      <div className={styles.infoWrapper}>
        <div className={styles.info}>
          <Link href="/">
            <Image
              src={
                'https://aws-lambda-images-418581597558.s3.ap-northeast-1.amazonaws.com//logo.png'
              }
              width={232}
              height={70}
              alt={'タイトルロゴ'}
              priority
            />
          </Link>
          {/* ハンバーガーメニュー */}
          <div
            className={
              hanbergar ? styles.nav_Button : styles.nav_Button_active
            }
            onClick={() => setHanbergar(!hanbergar)}
          >
            <span></span> <span></span> <span></span>
          </div>
          {/* スマホ版メニュー一覧 */}
          <nav
            className={
              hanbergar ? styles.sp_nav : styles.sp_nav_active
            }
          >
            <ul>
              <li>
                <Link href="/">
                  <Image
                    className={styles.icon}
                    src={
                      'https://aws-lambda-images-418581597558.s3.ap-northeast-1.amazonaws.com//icon-top.png'
                    }
                    width={32}
                    height={32}
                    alt={'トップアイコン'}
                  />
                  トップページ
                </Link>
              </li>
              <li>
                <Link href="/search?categories=&q=">
                  <Image
                    className={styles.icon}
                    src={
                      'https://aws-lambda-images-418581597558.s3.ap-northeast-1.amazonaws.com//icon-search.png'
                    }
                    width={32}
                    height={32}
                    alt={'検索アイコン'}
                  />
                  検索
                </Link>
              </li>
              <li>
                <Link href="/cart">
                  <Image
                    className={styles.icon}
                    src={
                      'https://aws-lambda-images-418581597558.s3.ap-northeast-1.amazonaws.com//icon-cart.png'
                    }
                    width={32}
                    height={32}
                    alt={'カートアイコン'}
                  />
                  カート
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link href="/mypage">
                      <Image
                        className={styles.icon}
                        src={
                          'https://aws-lambda-images-418581597558.s3.ap-northeast-1.amazonaws.com//icon-mypage.png'
                        }
                        width={32}
                        height={32}
                        alt={'マイページアイコン'}
                      />
                      マイページ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/api/logout"
                      onClick={async (e) => {
                        e.preventDefault();
                        await axios
                          .get('/api/logout')
                          .then(() => dologout());
                      }}
                    >
                      <div className={styles.btnWrapper}>
                        ログアウト
                      </div>
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login">
                    <div className={styles.btnWrapper}>ログイン</div>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/*  PC画面のヘッダーメニュー */}
          <nav className={styles.pc_nav}>
            <ul>
              <li>
                <Link href="/">
                  <Image
                    src={
                      'https://aws-lambda-images-418581597558.s3.ap-northeast-1.amazonaws.com//icon-top.png'
                    }
                    width={32}
                    height={32}
                    alt={'トップページのアイコン'}
                    className={styles.icon}
                  />
                  <span className={styles.iconText}>
                    トップページ
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/search?categories=&q=">
                  <Image
                    src={
                      'https://aws-lambda-images-418581597558.s3.ap-northeast-1.amazonaws.com//icon-search.png'
                    }
                    width={32}
                    height={32}
                    alt={'検索のアイコン'}
                    className={styles.icon}
                  />
                  <span className={styles.iconText}>検索</span>
                </Link>
              </li>
              <li>
                <Link href="/cart">
                  <Image
                    src={
                      'https://aws-lambda-images-418581597558.s3.ap-northeast-1.amazonaws.com//icon-cart.png'
                    }
                    width={32}
                    height={32}
                    alt={'カートのアイコン'}
                    className={styles.icon}
                  />
                  <span className={styles.iconText}>カート</span>
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link href="/mypage">
                      <Image
                        src={
                          'https://aws-lambda-images-418581597558.s3.ap-northeast-1.amazonaws.com//icon-mypage.png'
                        }
                        width={32}
                        height={32}
                        alt={'マイページのアイコン'}
                        className={styles.icon}
                      />
                      <span className={styles.iconText}>
                        マイページ
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/api/logout"
                      onClick={async (e) => {
                        e.preventDefault();
                        await axios
                          .get('/api/logout')
                          .then(() => dologout());
                      }}
                    >
                      <div className={styles.btnWrapper}>
                        ログアウト
                      </div>
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login">
                    <div className={styles.btnWrapper}>ログイン</div>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  ) : (
    // ログイン画面の場合
    <header className={styles.header}>
      <div className={styles.infoWrapper}>
        <div className={styles.info}>
          <Link href="/">
            <Image
              src={
                'https://aws-lambda-images-418581597558.s3.ap-northeast-1.amazonaws.com//logo.png'
              }
              width={232}
              height={70}
              alt={'タイトルロゴ'}
            />
          </Link>
          {/* ハンバーガーメニュー */}
          <div
            className={
              hanbergar ? styles.nav_Button : styles.nav_Button_active
            }
            onClick={() => setHanbergar(!hanbergar)}
          >
            <span></span> <span></span> <span></span>
          </div>

          {/*  PC画面のヘッダーメニュー */}
          <nav className={styles.pc_nav}>
            <ul>
              <li>
                <Link href="/">
                  <Image
                    src={
                      'https://aws-lambda-images-418581597558.s3.ap-northeast-1.amazonaws.com//icon-top.png'
                    }
                    width={32}
                    height={32}
                    alt={'トップページのアイコン'}
                    className={styles.icon}
                  />
                  <span className={styles.iconText}>
                    トップページ
                  </span>
                </Link>
              </li>

              <li>
                <Link href="/register">
                  <div className={styles.registerBtn}>
                    ユーザ登録はこちら
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

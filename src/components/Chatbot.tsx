import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from 'styles/chatbot.module.css';
import { Item } from 'types/item';
import Image from 'next/image';
import Router from 'next/router';
import React from 'react';
import { SessionUser } from 'pages/api/getUser';
import axios from 'axios';

type ChatList = {
  chatbotId: number;
  text?: string;
  chatbotChoice: Array<Choice>;
  continue: boolean;
  option: string;
};
type Choice = {
  chatbotChoiceId: number;
  chatbotId: number;
  text: string;
};

export default function Chatbot({
  chatList,
  userName,
  data,
}: {
  chatList: Array<ChatList>;
  userName: string;
  data: SessionUser;
}) {
  const [count, setCount] = useState(1);
  const [output, setOutput] = useState([chatList[0]]);
  const [option, setOption] = useState(0);
  const [method, setMethod] = useState(0);
  const [genre, setGenre] = useState(0);
  const [feeling, setFeeling] = useState(0);
  const [who, setWho] = useState(0);
  const [optionButton, setOptionButton] = useState(true);
  const [selectMethodButton, setSelectMethodButton] = useState(true);
  const [button, setButton] = useState(true);
  const [selectFeelingButton, setSelectFeelingButton] =
    useState(true);
  const [selectWhoButton, setSelectWhoButton] = useState(true);
  const [getItems, setItems] = useState([]);
  const items: Array<Item> = getItems;
  const chatArea = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // itemsを取得
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/item/favorite/${genre}/4`
      )
      .then((res) => res.data)
      .then((data) => {
        setItems(data);
      });
  }, [genre]);

  useEffect(() => {
    if (count === chatList.length) {
      return;
    }
    // 1回目の質問まで
    if (count < 4) {
      const id = setTimeout(() => {
        setCount((prev) => prev + 1);
        setOutput((prev) => [...prev, chatList[count]]);
      }, 2000);
      return () => clearTimeout(id);
    }
    // 1回目の質問解答後、1回だけ回す
    if (count < 5) {
      if (!optionButton) {
        if (option === 1) {
          const id = setTimeout(() => {
            setCount((prev) => prev + 1);
            setOutput((prev) => [...prev, chatList[count]]);
          }, 1000);
          return () => clearTimeout(id);
        }
        if (option === 2) {
          const id = setTimeout(() => {
            setCount((prev) => prev + 3);
            setOutput((prev) => [...prev, chatList[count + 2]]);
          }, 1000);
          return () => clearTimeout(id);
        }
      }
    }
    // 「今のおすすめ」ルートを1回だけ回してsetGenre()
    if (count < 6) {
      if (option === 1) {
        if (count >= 5) {
          if (option === 1) {
            // 仮でJ-POPをおすすめ
            setGenre(1);
            const id = setTimeout(() => {
              setCount((prev) => prev + 1);
              setOutput((prev) => [...prev, chatList[count]]);
            }, 2000);
            return () => clearTimeout(id);
          }
        }
      }
    }
    // 「今のおすすめルート」終了
    if (count < 7) {
      if (option === 1) {
        if (count >= 6) {
          const id = setTimeout(() => {
            setCount((prev) => prev + 1);
            setOutput((prev) => [...prev, chatList[count + 8]]);
          }, 2000);
          return () => clearTimeout(id);
        }
      }
    }
    // 「自分に合った作品」ルート1回だけ回して質問提示
    if (count < 8) {
      if (option === 2) {
        if (count >= 7) {
          const id = setTimeout(() => {
            setCount((prev) => prev + 1);
            setOutput((prev) => [...prev, chatList[count]]);
          }, 2000);
          return () => clearTimeout(id);
        }
      }
    }
    // 質問回答後、1回だけ回す
    if (count < 10) {
      if (option === 2) {
        if (!selectMethodButton) {
          if (method === 3) {
            const id = setTimeout(() => {
              setCount((prev) => prev + 1);
              setOutput((prev) => [...prev, chatList[count]]);
            }, 1000);
            return () => clearTimeout(id);
          }
          if (method === 4) {
            const id = setTimeout(() => {
              setCount((prev) => prev + 8);
              setOutput((prev) => [...prev, chatList[count + 7]]);
            }, 1000);
            return () => clearTimeout(id);
          }
        }
      }
    }
    // 「興味のあるジャンルルート」終了
    if (count < 15) {
      if (option === 2) {
        if (method === 3) {
          if (!button) {
            const id = setTimeout(() => {
              setCount((prev) => prev + 1);
              setOutput((prev) => [...prev, chatList[count]]);
            }, 2000);
            return () => clearTimeout(id);
          } else {
            return;
          }
        }
      }
    }
    // 「今の気分」ルート1回回して1つめの質問提示
    if (count < 17) {
      if (option === 2) {
        if (method === 4) {
          if (count >= 16) {
            const id = setTimeout(() => {
              setCount((prev) => prev + 1);
              setOutput((prev) => [...prev, chatList[count]]);
            }, 2000);
            return () => clearTimeout(id);
          }
        }
      }
    }
    // 「今の気分」ルート2回回して2つめの質問提示
    if (count < 19) {
      if (option === 2) {
        if (method === 4) {
          if (!selectFeelingButton) {
            const id = setTimeout(() => {
              setCount((prev) => prev + 1);
              setOutput((prev) => [...prev, chatList[count]]);
            }, 2000);
            return () => clearTimeout(id);
          }
        }
      }
    }
    // 質問回答後、回答に一致するcategoriesIdを取得
    if (count < 20) {
      if (option === 2) {
        if (method === 4) {
          if (!selectWhoButton) {
            axios
              .get(
                `${
                  process.env.NEXT_PUBLIC_API_URL
                }/api/chatbot/getAnswer/${feeling - 11}/${who - 14}`
              )
              .then((res) => res.data)
              .then((data) => {
                setGenre(Number(data));
              });
            const id = setTimeout(() => {
              setCount((prev) => prev + 1);
              setOutput((prev) => [...prev, chatList[count]]);
            }, 2000);
            return () => clearTimeout(id);
          }
        }
      }
    }
    // 「今の気分ルート終了」
    if (option === 2) {
      if (method === 4) {
        if (count >= 20) {
          const id = setTimeout(() => {
            setCount((prev) => prev + 1);
            setOutput((prev) => [...prev, chatList[count]]);
          }, 2000);
          return () => clearTimeout(id);
        }
      }
    }
  }, [
    optionButton,
    count,
    option,
    selectMethodButton,
    method,
    button,
    selectFeelingButton,
    selectWhoButton,
    feeling,
    who,
    chatList,
  ]);

  useEffect(() => {
    chatArea?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  });

  const select = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setOptionButton(false);
  };

  const selectMethod = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSelectMethodButton(false);
  };

  const selectFeeling = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSelectFeelingButton(false);
  };

  const selectWho = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSelectWhoButton(false);
  };

  const submit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setButton(false);
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/updateUser/${data.userId}/${genre}`
    );
  };
  const route = () => {
    Router.push('/');
  };

  return (
    <>
      <div className={styles.chatbotPage} key="chatbotPage">
        <div className={styles.chatbotWrapper} key="chatbotWrapper">
          <div
            id="chatbot-body"
            className={styles.chatbotBody}
            key="chatboy-body"
          >
            <div className={styles.header} key="header">
              <div className={styles.title} key="chath1">
                チャットボット
              </div>
            </div>
            <div
              id="chatbot"
              className={styles.chatArea}
              key="chatArea"
            >
              {output.map((obj) => {
                if (obj.chatbotChoice.length) {
                  if (obj.chatbotId === 4)
                    return (
                      <div
                        key={`question${obj.chatbotId}`}
                        ref={chatArea}
                      >
                        {optionButton ? (
                          <div
                            className={styles.choice}
                            key={`choice${obj.chatbotId}`}
                          >
                            <div
                              key={`cl${obj.chatbotId}`}
                              className={styles.choiceTitle}
                            >
                              {obj.text}
                            </div>
                            <form
                              method="get"
                              id="form"
                              onSubmit={select}
                              className={styles.form}
                              key="form1"
                            >
                              {obj.chatbotChoice.map((choice) => {
                                return (
                                  <div
                                    key={`choice${choice.chatbotChoiceId}`}
                                  >
                                    <input
                                      name="favoriteGenre"
                                      key={choice.chatbotChoiceId}
                                      type="radio"
                                      value={choice.chatbotChoiceId}
                                      onChange={(e) =>
                                        setOption(
                                          Number(e.target.value)
                                        )
                                      }
                                    />
                                    <label
                                      key={`label${choice.chatbotChoiceId}`}
                                      htmlFor={choice.chatbotChoiceId.toString()}
                                    >
                                      {choice.text}
                                    </label>
                                  </div>
                                );
                              })}
                              <button
                                className={styles.submitBtn}
                                key="button1"
                                type="submit"
                              >
                                決定
                              </button>
                            </form>
                          </div>
                        ) : (
                          <div
                            key={`ans${obj.chatbotId}`}
                            className={styles.answer}
                            ref={chatArea}
                          >
                            <div
                              key={`cl${obj.chatbotId}`}
                              className={styles.rightChat}
                            >
                              {obj.chatbotChoice[option - 1].text}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  if (obj.chatbotId === 8)
                    return (
                      <div
                        key={`question${obj.chatbotId}`}
                        ref={chatArea}
                      >
                        {selectMethodButton ? (
                          <div
                            className={styles.choice}
                            key={`choice${obj.chatbotId}`}
                          >
                            <div
                              key={`cl${obj.chatbotId}`}
                              className={styles.choiceTitle}
                            >
                              {obj.text}
                            </div>
                            <form
                              method="get"
                              id="form"
                              onSubmit={selectMethod}
                              className={styles.form}
                              key="form2"
                            >
                              {obj.chatbotChoice.map((choice) => {
                                return (
                                  <div
                                    key={`choice${choice.chatbotChoiceId}`}
                                  >
                                    <input
                                      name="favoriteGenre"
                                      key={choice.chatbotChoiceId}
                                      type="radio"
                                      value={choice.chatbotChoiceId}
                                      onChange={(e) =>
                                        setMethod(
                                          Number(e.target.value)
                                        )
                                      }
                                    />
                                    <label
                                      key={`label${choice.chatbotChoiceId}`}
                                      htmlFor={choice.chatbotChoiceId.toString()}
                                    >
                                      {choice.text}
                                    </label>
                                  </div>
                                );
                              })}
                              <button
                                className={styles.submitBtn}
                                key="button2"
                                type="submit"
                              >
                                決定
                              </button>
                            </form>
                          </div>
                        ) : (
                          <div
                            key={`ans${obj.chatbotId}`}
                            className={styles.answer}
                          >
                            <div
                              key={`cl${obj.chatbotId}`}
                              className={styles.rightChat}
                            >
                              {obj.chatbotChoice[method - 3].text}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  if (obj.chatbotId === 10)
                    return (
                      <div
                        key={`question${obj.chatbotId}`}
                        ref={chatArea}
                      >
                        {button ? (
                          <div className={styles.choice} key="choice">
                            <div
                              key={`cl${obj.chatbotId}`}
                              className={styles.choiceTitle}
                            >
                              {obj.text}
                            </div>
                            <form
                              method="get"
                              id="form"
                              onSubmit={submit}
                              className={styles.form}
                              key="form3"
                            >
                              {obj.chatbotChoice.map((choice) => {
                                return (
                                  <div
                                    key={`choice${choice.chatbotChoiceId}`}
                                  >
                                    <input
                                      name="favoriteGenre"
                                      key={choice.chatbotChoiceId}
                                      type="radio"
                                      value={choice.chatbotChoiceId}
                                      onChange={(e) =>
                                        setGenre(
                                          Number(e.target.value) - 4
                                        )
                                      }
                                    />
                                    <label
                                      key={`label${choice.chatbotChoiceId}`}
                                      htmlFor={choice.chatbotChoiceId.toString()}
                                    >
                                      {choice.text}
                                    </label>
                                  </div>
                                );
                              })}
                              <button
                                className={styles.submitBtn}
                                key="button3"
                                type="submit"
                              >
                                決定
                              </button>
                            </form>
                          </div>
                        ) : (
                          <div
                            key={`ans${obj.chatbotId}`}
                            className={styles.answer}
                          >
                            <div
                              key={`cl${obj.chatbotId}`}
                              className={styles.rightChat}
                            >
                              {obj.chatbotChoice[genre - 1].text}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  if (obj.chatbotId === 17)
                    return (
                      <div
                        key={`question${obj.chatbotId}`}
                        ref={chatArea}
                      >
                        {selectFeelingButton ? (
                          <div className={styles.choice} key="choice">
                            <div
                              key={`cl${obj.chatbotId}`}
                              className={styles.choiceTitle}
                            >
                              {obj.text}
                            </div>
                            <form
                              method="get"
                              id="form"
                              onSubmit={selectFeeling}
                              className={styles.form}
                              key="form4"
                            >
                              {obj.chatbotChoice.map((choice) => {
                                return (
                                  <div
                                    key={`choice${choice.chatbotChoiceId}`}
                                  >
                                    <input
                                      name="favoriteGenre"
                                      key={choice.chatbotChoiceId}
                                      type="radio"
                                      value={choice.chatbotChoiceId}
                                      onChange={(e) =>
                                        setFeeling(
                                          Number(e.target.value)
                                        )
                                      }
                                    />
                                    <label
                                      key={`label${choice.chatbotChoiceId}`}
                                      htmlFor={choice.chatbotChoiceId.toString()}
                                    >
                                      {choice.text}
                                    </label>
                                  </div>
                                );
                              })}
                              <button
                                className={styles.submitBtn}
                                key="button4"
                                type="submit"
                              >
                                決定
                              </button>
                            </form>
                          </div>
                        ) : (
                          <div
                            key={`ans${obj.chatbotId}`}
                            className={styles.answer}
                          >
                            <div
                              key={`cl${obj.chatbotId}`}
                              className={styles.rightChat}
                            >
                              {obj.chatbotChoice[feeling - 12].text}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  if (obj.chatbotId === 19)
                    return (
                      <div key="question" ref={chatArea}>
                        {selectWhoButton ? (
                          <div className={styles.choice} key="choice">
                            <div
                              key={`cl${obj.chatbotId}`}
                              className={styles.choiceTitle}
                            >
                              {obj.text}
                            </div>
                            <form
                              method="get"
                              id="form"
                              onSubmit={selectWho}
                              className={styles.form}
                              key="form5"
                            >
                              {obj.chatbotChoice.map((choice) => {
                                return (
                                  <div
                                    key={`choice${choice.chatbotChoiceId}`}
                                  >
                                    <input
                                      name="favoriteGenre"
                                      key={choice.chatbotChoiceId}
                                      type="radio"
                                      value={choice.chatbotChoiceId}
                                      onChange={(e) =>
                                        setWho(Number(e.target.value))
                                      }
                                    />
                                    <label
                                      key={`label${choice.chatbotChoiceId}`}
                                      htmlFor={choice.chatbotChoiceId.toString()}
                                    >
                                      {choice.text}
                                    </label>
                                  </div>
                                );
                              })}
                              <button
                                className={styles.submitBtn}
                                key="button5"
                                type="submit"
                              >
                                決定
                              </button>
                            </form>
                          </div>
                        ) : (
                          <div
                            key={`ans${obj.chatbotId}`}
                            className={styles.answer}
                          >
                            <div
                              key={`cl${obj.chatbotId}`}
                              className={styles.rightChat}
                            >
                              {obj.chatbotChoice[who - 15].text}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                } else if (obj.option === 'recommend') {
                  return (
                    <section
                      className={styles.itemList}
                      ref={chatArea}
                      key="recommend"
                    >
                      {items.map((item) => {
                        return (
                          <Link
                            key={`itemLink${item.itemId}`}
                            href={`/items/${item.itemId}`}
                            className={styles.item}
                          >
                            <Image
                              key={`itemImage${item.itemId}`}
                              src={item.itemImage}
                              width={400}
                              height={225}
                              alt={item.artist}
                              className={styles.itemImage}
                            />
                            <div
                              key={`${item.artist}`}
                              className={styles.artist}
                            >
                              {item.artist}
                            </div>
                            <div
                              key={`${item.fesName}`}
                              className={styles.fesName}
                            >
                              {item.fesName}
                            </div>
                          </Link>
                        );
                      })}
                    </section>
                  );
                } else if (obj.option === 'return') {
                  return (
                    <div
                      key="returnButton"
                      className={styles.returnBtnWrapper}
                      ref={chatArea}
                    >
                      <button
                        className={styles.returnBtn}
                        key={obj.chatbotId}
                        onClick={route}
                      >
                        {obj.text}
                      </button>
                    </div>
                  );
                } else {
                  if (obj.text)
                    return (
                      <div
                        key={`bot${obj.chatbotId}`}
                        className={styles.bot}
                        ref={chatArea}
                      >
                        <Image
                          key={`icon${obj.chatbotId}`}
                          className={styles.icon}
                          src={
                            'https://aws-lambda-images-418581597558.s3.ap-northeast-1.amazonaws.com//chatIcon.jpeg'
                          }
                          width={30}
                          height={30}
                          alt={'アイコン'}
                        />
                        <div
                          className={styles.botSays}
                          key={`cl${obj.chatbotId}`}
                        >
                          {obj.text.replace('Name', `${userName}`)}
                        </div>
                      </div>
                    );
                }
              })}
            </div>
          </div>
          <div
            key="closeChatbot"
            className={styles.closeChatbot}
            onClick={() => route()}
          >
            ×
          </div>
        </div>
      </div>
    </>
  );
}

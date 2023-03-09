import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { UserCart } from '../../types/user';
import axios from 'axios';

export default withIronSessionApiRoute(getUserRoute, ironOptions);

async function getUserRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.session.user) {
    // セッションからユーザIDの取得
    const userId = req.session.user.id;

    // ユーザ情報に紐づくカートの取得
    const url = `https://v8wqod3cx8.execute-api.ap-northeast-1.amazonaws.com/selectCart?userId=${userId}`;
    const response = await axios.get(url);
    const result = await response.data;
    // const result = await prisma.user.findUnique({
    //   where: {
    //     userId: userId
    //   },
    //   select: {
    //     carts: {
    //       include: {
    //         items: true,
    //       },
    //     },
    //   },
    // })
    if (result.errorFlg) {
      return res.redirect('/error');
    }

    // レンタル履歴追加用のデータを作成
    const carts: UserCart[] = result.cart;
    const time = new Date();
    const addItem = carts.map((item) => {
      return {
        itemId: item.itemId,
        itemName: item.itemName,
        itemImage: item.itemImage,
        price: item.price,
        rentalPeriod: item.rentalPeriod,
        payDate: time,
      };
    })

    // レンタル履歴テーブルとカートテーブルを同時更新
    const body = { addItem };
    console.log(body)
    const headers = {
      'Content-Type': 'application/json',
    }
    const path = `https://v8wqod3cx8.execute-api.ap-northeast-1.amazonaws.com/addRentalHistory?userId=${userId}`;
    // const params = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(body),
    // };
    await axios.post(path, JSON.stringify(body), { headers: headers }).catch(() => res.redirect('/error'))
    // const tran = await prisma.$transaction([
    //   // レンタル履歴に追加
    //   prisma.rentalHistory.createMany({
    //     data: addItem
    //   }),
    //   // カート情報を削除
    //   prisma.cart.deleteMany({
    //     where: {
    //       userId: userId
    //     }
    //   })
    //   // 失敗したらエラー画面へ
    // ]).catch(() => res.redirect('/error'));
    res.redirect('/paymentComp').end();
  }
}

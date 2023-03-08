import axios from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ironOptions } from '../../../lib/ironOprion';

export default withIronSessionApiRoute(addLogedinCart, ironOptions);

async function addLogedinCart(req: NextApiRequest, res: NextApiResponse) {
    //ユーザ情報がない場合はエラー画面へ
    if (!req.session.user) {
        return res.redirect('/error')
    }
    const userId = req.session.user.id;
    if (req.session.cart && req.session.cart.length !== 0) {
        // sessionのカートからcartId以外を取得
        const sessionCart = req.session.cart.map((item) => {
            const data = {
                itemId: item.itemId,
                itemName: item.itemName,
                rentalPeriod: item.rentalPeriod,
                price: item.price,
                itemImage: item.itemImage,
            }
            return data;
        })

        const body = { sessionCart };
        const headers = {
            'Content-Type': 'application/json',
        }
        const url = `https://v8wqod3cx8.execute-api.ap-northeast-1.amazonaws.com/addLogedinCart?userId=${userId}`;
        // const params = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(body),
        // };
        await axios.post(url, JSON.stringify(body), { headers: headers }).then(() => { req.session.cart = []; })

        // // cartテーブルに追加
        // await prisma.cart.createMany({
        //     data: sessionCart
        // })

        // sessionのカートを空にする
        // req.session.cart = [];
    }
    res.redirect('/')
}

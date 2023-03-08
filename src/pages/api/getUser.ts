import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { UserCart, RentalHistory } from '../../types/user';
import axios from 'axios';

export default withIronSessionApiRoute(getUserRoute, ironOptions);

export type SessionUser = {
  id?: string;
  userName?: string;
  userCarts?: UserCart[];
  userRentalHistories?: RentalHistory[];
  favoriteGenre?: number;
  isLoggedIn: boolean;
};

async function getUserRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.session.user) {
    const userId = req.session.user.id;
    const url = `https://v8wqod3cx8.execute-api.ap-northeast-1.amazonaws.com/selectCart?userId=${userId}`;
    const response = await axios.get(url);
    const result = await response.data;
    // const result = await prisma.user.findUnique({
    //   where: {
    //     userId: userId,
    //   },
    //   select: {
    //     Cart: {
    //       include: {
    //         Item: true,
    //       },
    //     },
    //   },
    // });
    res.json({
      id: userId,
      isLoggedIn: true,
      userCarts: result.cart,
    });
  } else {
    const sessionCart = req.session.cart;
    if (!sessionCart) {
      res.json({
        isLoggedIn: false,
      });
    } else {
      res.json({
        userCarts: sessionCart,
        isLoggedIn: false,
      });
    }
  }
}

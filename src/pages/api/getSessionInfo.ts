import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { UserCart } from '../../types/user';


export default withIronSessionApiRoute(getSessionRoute, ironOptions);

export type SessionUser = {
  mailAddress?: string;
  userCarts?: UserCart[];
  isLoggedIn: boolean;
};

async function getSessionRoute(
  req: NextApiRequest,
  res: NextApiResponse<SessionUser>
) {
  if (req.session.user) {
    res.json({
      mailAddress: req.session.user.mailAddress,
      isLoggedIn: true,
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

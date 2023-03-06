import * as IronSession from 'iron-session';
import { Item } from 'types/item';

// iron-sessionで『user』と『cart』が使えるようにするための定義
declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: string;
      userName: string;
    };

    cart?: {
      id: number;
      itemId: number;
      itemName: string;
      rentalPeriod: number;
      price: number;
      itemImage: string;
    }[];
  }
}

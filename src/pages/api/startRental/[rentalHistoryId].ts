import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { RentalHistory } from 'types/user';
import axios from 'axios';

export default withIronSessionApiRoute(startRentalRoute, ironOptions);

// 起動側からレンタル履歴IDをもらう
async function startRentalRoute(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.session.user) {

		// レンタル履歴IDの取得
		const { rentalHistoryId } = req.query;
		if (!rentalHistoryId) {
			return res.json({ result: false });
		}
		const id = Number(rentalHistoryId);
		const userId = req.session.user.id;

		// ログインユーザのレンタル履歴情報を取得
		const url = `${process.env.NEXT_PUBLIC_API_URL}/selectRentalHistories?userId=${userId}`;
		const response = await axios.get(url);
		const data = await response.data;
		const rentalHistory: RentalHistory[] = data.rental;
		// const rentalHistory = await prisma.rentalHistory.findMany({
		// 	where: {
		// 		userId: req.session.user.userId
		// 	}
		// })

		// 対象作品の取得
		const rentalItem = rentalHistory.find(
			(item) => item.id === id
		);

		// 対象作品が見つからない場合はエラーを返却
		if (!rentalItem) {
			return res.json({ result: false });
		}

		// すでに再生済の場合は処理を行わない
		if (rentalItem.rentalStart) {
			return res.json({ result: true });
		}

		// レンタル期間を取得し、レンタル開始日とレンタル終了日を設定する
		const rentalPeriod = rentalItem.rentalPeriod;
		const startDate = new Date();
		const endDate = new Date();
		endDate.setDate(startDate.getDate() + rentalPeriod)

		// 対象作品を更新データ作成
		const updateItem = {
			rentalStart: startDate,
			rentalEnd: endDate
		}
		// データベースを更新する
		const path = `${process.env.NEXT_PUBLIC_API_URL}/updateRentalHistory?userId=${userId}&rentalHistoryId=${rentalItem.id}`;
		// const params = {
		// 	method: 'PATCH',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify(updateItem),
		// };
		await axios.post(path, updateItem).then(() => res.json({ result: true }));
	}
}

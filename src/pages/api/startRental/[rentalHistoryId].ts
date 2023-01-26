import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { RentalHistory } from 'types/user';

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
		const userId = req.session.user.userId;

		// ログインユーザのレンタル履歴情報を取得
		const url = `http://localhost:3005/api/rentalHistory/selectRentalHistory/${userId}`;
		const response = await fetch(url);
		const data = await response.json();
		const rentalHistory: RentalHistory[] = data.rental;
		// const rentalHistory = await prisma.rentalHistory.findMany({
		// 	where: {
		// 		userId: req.session.user.userId
		// 	}
		// })

		// 対象作品の取得
		const rentalItem = rentalHistory.find(
			(item) => item.rentalHistoryId === id
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
		const path = `http://localhost:3005/api/rentalHistory/updateRentalHistory/${rentalItem.rentalHistoryId}`;
		const params = {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updateItem),
		};
		const result = await fetch(path, params);
		// await prisma.rentalHistory.update({
		// 	where: {
		// 		rentalHistoryId: rentalItem.rentalHistoryId
		// 	},
		// 	data: updateItem
		// })

		res.json({ result: true })
	}
}

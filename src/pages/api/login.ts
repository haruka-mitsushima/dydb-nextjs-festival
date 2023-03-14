import axios from "axios";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../../lib/ironOprion"

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const body = { ...req.body };
    const headers = {
      'Content-Type': 'application/json',
    }
    const url = `${process.env.NEXT_PUBLIC_API_URL}/login`;
    const response = await axios.post(url, JSON.stringify(body), { headers: headers });
    const data = await response.data;

    if (data.message === 'error') {
      res.status(404).end();
    } else {
      req.session.user = {
        ...data
      };
      await req.session.save();
      res.status(200).end();
    }
  },
  ironOptions,
);

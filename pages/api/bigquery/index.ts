import type { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { BigQuery } from "@google-cloud/bigquery";

const handler = nextConnect();

handler.post(async (req: any, res: NextApiResponse<any>) => {
  try {
    const client = createClient();
    const [rows] = await client.query({
      query: req.body,
      location: "US",
    });
    return res.json({ rows });
  } catch (err: any) {
    console.error(err.message);
  }
});

const createClient = (): BigQuery => {
  const KEY_FILE = "./keyfile.json";
  return new BigQuery({
    keyFilename: KEY_FILE,
  });
};

export default handler;

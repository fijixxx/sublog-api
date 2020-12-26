import { NextApiRequest, NextApiResponse } from "next";
import DynamoDB from "../../repository/dynamodb";

/**
 * 記事の id をクエリで受け取り、記事データを返す API
 * @param _req
 * @param _req.query.id - 取得したい記事の id を渡す
 * @param _res
 */
const handler = async (
  _req: NextApiRequest,
  _res: NextApiResponse
): Promise<void> => {
  const dynamodb = new DynamoDB();
  const client = dynamodb.documentClient;
  const params = {
    TableName: "sublog",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": _req?.query.id,
    },
  };
  const article = await client
    .query(params)
    .promise()
    .catch((e) => e);
  return _res.status(200).json({ article });
};

export default handler;

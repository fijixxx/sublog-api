import { NextApiRequest, NextApiResponse } from "next";
import DynamoDB from "../../repository/dynamodb";

/**
 * sublog の記事を全て createdAt の降順で返す API
 */
const handler = async (
  _req: NextApiRequest,
  _res: NextApiResponse
): Promise<void> => {
  const dynamodb = new DynamoDB();
  const client = dynamodb.documentClient;
  const params = {
    TableName: "sublog",
    IndexName: "media-createdAt-index",
    ScanIndexForward: false,
    KeyConditionExpression: "media = :media",
    ExpressionAttributeValues: {
      ":media": "sublog",
    },
  };
  const articles = await client
    .query(params)
    .promise()
    .catch((e) => e);
  return _res.status(200).json({ articles });
};

export default handler;

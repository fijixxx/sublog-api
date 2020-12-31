import AWS from "aws-sdk";
import { Sublog } from 'src/generated/graphql'

/**
 * DynamoDB に Query したときに返却されるオブジェクトの型
 */
type DynamoQueryResponse = {
  Items: [Sublog],
  Count: number,
  ScannedCount: number
}

/**
 * DynamoDB との接続部分を分離するクラス
 */
class DynamoDB {
  private _documentClient: AWS.DynamoDB.DocumentClient;

  constructor() {
    AWS.config.update({ region: "ap-northeast-1" });
    this._documentClient = new AWS.DynamoDB.DocumentClient();
  }

  /**
   * AWS.DynamoDB.DocumentClient のインスタンスを 取得 or 生成
   */
  private get documentClient(): AWS.DynamoDB.DocumentClient {
    if (this._documentClient) {
      return this._documentClient;
    } else {
      this._documentClient = new AWS.DynamoDB.DocumentClient();
      return this._documentClient;
    }}

  /**
   * DynamoDB からのレスポンスを受け取り Sublog[] 型にマッピングして返す
   * @param _response - DocumentClient().query().promise() の返り値
   */
  private dataMapper(_response: DynamoQueryResponse):Sublog[] {
      const data: Sublog[] = _response.Items.map ((item) => ({
        id: item.id || '',
        createdAt:  item.createdAt || '',
        fileName:  item.fileName || '',
        category:  item.category || '',
        media:  item.media || '',
        title:  item.title  || '',
        eyeCatchURL:  item.eyeCatchURL || '',
        tag:  item.tag || [''],
        updatedAt:  item.updatedAt || '',
      }))

      return data
  }

  /**
   * 全記事を取得
   */
  public async getAll(): Promise<Sublog[]>{
     const client = this.documentClient
     const params = {
       TableName: "sublog",
       IndexName: "media-createdAt-index",
       ScanIndexForward: false,
       KeyConditionExpression: "media = :media",
       ExpressionAttributeValues: {
         ":media": "sublog",
       },
     };
     const response = await client
       .query(params)
       .promise()
       .catch((e) => e);

     const articles: Sublog[] = this.dataMapper(response)

     return articles
    }

  /**
   * 記事ID元に、記事単品を取得
   * @param id - 記事ID
   */
  public async getById(id?:string): Promise<Sublog> {
     const client = this.documentClient
     const params = {
       TableName: "sublog",
       KeyConditionExpression: "id = :id",
       ExpressionAttributeValues: {
         ":id": id,
       },
     };
     const response: DynamoQueryResponse = await client
       .query(params)
       .promise()
       .catch((e) => e);

    const articles: Sublog[] = this.dataMapper(response)

     return articles[0]
  }
  /**
   * fileName を元に、記事単品を取得
   * @param fileName - 記事/記事メタデータのファイル名
   */
  public async getByFileName(fileName?:string): Promise<Sublog> {
   const client = this.documentClient
   const params = {
     TableName: "sublog",
     IndexName: "fileName-index",
     KeyConditionExpression: "fileName = :fileName",
     ExpressionAttributeValues: {
       ":fileName": fileName,
     },
   };
   const response = await client
     .query(params)
     .promise()
     .catch((e) => e);

  const articles: Sublog[] = this.dataMapper(response)

   return articles[0]
  }
  /**
   * category 引数と同じカテゴリーをもつ記事群を返す
   * @param category - 記事のカテゴリー
   */
  public async getByCategory(category?:string): Promise<Sublog[]>{
   const client = this.documentClient
   const params = {
     TableName: "sublog",
     IndexName: "category-createdAt-index",
     ScanIndexForward: false,
     KeyConditionExpression: "category = :category",
     ExpressionAttributeValues: {
       ":category": category,
     },
   };
   const response = await client
     .query(params)
     .promise()
     .catch((e) => e);

   const articles: Sublog[] = this.dataMapper(response)

   return articles
  }
}

export default DynamoDB;
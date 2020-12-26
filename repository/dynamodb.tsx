import AWS from "aws-sdk";

/**
 * DynamoDB との接続部分を分離するクラス
 */
class DynamoDB {
  private _documentClient: AWS.DynamoDB.DocumentClient;

  constructor() {
    AWS.config.update({ region: "ap-northeast-1" });
    this._documentClient = new AWS.DynamoDB.DocumentClient();
  }

  public get documentClient(): AWS.DynamoDB.DocumentClient {
    if (this._documentClient) {
      return this._documentClient;
    } else {
      this._documentClient = new AWS.DynamoDB.DocumentClient();
      return this._documentClient;
    }
  }
}

export default DynamoDB;

import { QueryResolvers } from './generated/graphql'

/**
 * Resolvers で使用する Query の定義セクション
 */
const Query: QueryResolvers = {
  /**
   * 記事を単体で取得する
   * @param parent 
   * @param args.id - 記事の ID を渡す
   * @param dataSources - DynamoDB クラス
   */
  getById: async (parent, args, { dataSources }) => {
    const _id = args.id || ''
    const response = await dataSources.dynamoDB.getById(_id);
    return response
  },
  /**
   * sublog の記事を全件取得する
   * @param parent 
   * @param args 
   * @param dataSources - DynamoDB クラス
   */
  getAll: async (parent, args, { dataSources }) => {
    const response = await dataSources.dynamoDB.getAll()
    return response
  },
  /**
   * ファイル名から記事を単体で取得する
   * @param parent 
   * @param args.fileName - 記事/記事メタデータのファイル名
   * @param dataSources - DynamoDB クラス
   */
  getByFileName: async (parent, args, { dataSources }) => {
  const _fileName = args.fileName || ''
  const response = await dataSources.dynamoDB.getByFileName(_fileName);
  return response
  },
  /**
   * カテゴリー名から記事群を取得する
   * @param parent 
   * @param args.category - 記事群のカテゴリー名
   * @param dataSources - DynamoDB クラス
   */
  getByCategory: async (parent, args, { dataSources }) => {
    const _category = args.category || ''
    const response = await dataSources.dynamoDB.getByCategory(_category)
    return response
  },
}

export const resolvers = {
    Query
}
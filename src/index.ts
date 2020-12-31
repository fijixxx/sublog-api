import { ApolloServer } from "apollo-server";
import { importSchema } from 'graphql-import'
import DynamoDB from 'src/datacource/DynamoDB'
import { resolvers } from 'src/resolver'

const typeDefs = importSchema('src/schema.gql')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources:  (): any => {
    return { dynamoDB: new DynamoDB() }
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

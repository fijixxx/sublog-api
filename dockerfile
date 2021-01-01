FROM node:14.15-slim as bulder
WORKDIR /usr/src/app
COPY . .
RUN yarn && yarn build && cp ./package.json ./dist/ && mkdir ./dist/src && cp ./src/schema.gql ./dist/src/ && cd ./dist/ && yarn --prod

FROM node:14.15-slim
WORKDIR /usr/src/app
COPY --from=bulder /usr/src/app/dist/ .
CMD [ "node", "main.js" ]
EXPOSE 4000
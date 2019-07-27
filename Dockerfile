FROM node:10.16.0

WORKDIR /usr/app
COPY . .

ENV PORT 8000 NODE_ENV production
EXPOSE 8000

RUN npm i -g yarn
RUN yarn install
RUN yarn build

CMD ["yarn", "start"]

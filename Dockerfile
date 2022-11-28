FROM node:lts-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile
COPY . .

ENV NODE_ENV production
EXPOSE 3000

RUN npm run build
CMD ["npm", "start"]

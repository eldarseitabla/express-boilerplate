FROM node:12.16.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

ENV NODE_ENV=production
RUN npm ci --only=production

RUN npm install pm2 -g

RUN npm run build

COPY . .

EXPOSE 8080

CMD [ "pm2-runtime", "dist/server.js" ]

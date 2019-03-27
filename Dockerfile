FROM node:10.8.0-alpine

LABEL Maintainer="Iqan Shaikh"

ENV PORT 3000

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE ${PORT}

ENTRYPOINT [ "npm", "start" ]
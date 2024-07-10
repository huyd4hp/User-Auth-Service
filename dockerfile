FROM node:20-alpine3.19

EXPOSE 8000

WORKDIR /app 

RUN npm install -g npm@10.5.2

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["node","server.js"]


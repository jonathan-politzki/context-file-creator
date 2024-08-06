FROM node:20

WORKDIR /usr/src/app

COPY backend/package*.json ./

RUN npm install

COPY backend .

EXPOSE 3001

CMD [ "node", "server.js" ]
FROM node:20.9.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001
CMD ["node", "src/server.js"]

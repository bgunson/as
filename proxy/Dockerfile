FROM node:16-alpine AS prod

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

ENV NODE_ENV=${NODE_ENV}

COPY . .

CMD ["node", "main.js"]
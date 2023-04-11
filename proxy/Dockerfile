FROM node:16-alpine AS prod

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=${NODE_ENV} \
    PORT=${PORT}

EXPOSE $PORT

CMD ["node", "main.js"]
# Stage - Production Environment
FROM node:18-alpine AS prod

WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install only regular dependencies for production environment
RUN npm install --omit=dev

# Copy the rest of the application files to the container
COPY . .

# Declare env vars (other way was defining build args and using those!)
ENV NODE_ENV=${NODE_ENV} \
    PEER_PORT=${PEER_PORT} \
    SERVER_URL=${SERVER_URL} \
    SERVER_URL_BACKUP_1=${SERVER_URL_BACKUP_1} \
    SERVER_URL_BACKUP_2=${SERVER_URL_BACKUP_2} \
    CONN_TIMEOUT=${CONN_TIMEOUT} \
    NUM_RETRIES=${NUM_RETRIES} \
    RETRY_INTERVAL_MS=${RETRY_INTERVAL_MS}

# Expose Peer's API at Port (value from env)
EXPOSE $PEER_PORT

# Start the application in production environment
CMD ["node", "main.js"]

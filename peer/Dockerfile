# Stage - Production Environment
FROM node:18-alpine AS prod

WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install only regular dependencies for production environment
RUN npm install --omit=dev

# Copy the rest of the application files to the container
COPY . .

# Declare build args
ARG GIT_COMMIT

# Label the image with value of GIT_COMMIT
LABEL git_commit=$GIT_COMMIT

# Expose Peer's API at Port (value from env)
EXPOSE ${PEER_PORT}

# Start the application in production environment
CMD ["npm", "start"]

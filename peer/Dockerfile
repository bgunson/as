# Stage - Production Environment
FROM node:18-alpine AS prod

WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install only regular dependencies for production environment
RUN npm install --omit=dev

# Copy the rest of the application files to the container
COPY . .

# Set the NODE_ENV environment variable to "production"
ENV NODE_ENV=production

# Start the application in production environment
CMD ["npm", "start"]

# Stage 1 - Development Environment
FROM node:18-alpine AS dev

WORKDIR /app

# Copy the package.json, and package-lock.json(if it is present), to the container
COPY package*.json ./

# Install ALL dependecies 
RUN npm install 

# Copy the rest of the application files (source code) to container
COPY . .

# Set the NODE_ENV environment variable to "development"
ENV NODE_ENV=development

# Start the application using script (check package.json to ensure this is the correct one!) 
CMD ["npm", "start"]


# Stage 2 - Production Environment
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

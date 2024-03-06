# Base image for nodejs (LTS)
FROM node:lts

# Create app directory
WORKDIR /usr/src/app

# Copy over the package.json and package-lock.json
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install app dependencies
RUN npm run installPackages

RUN npm install knex -g

# Bundle app source
COPY . .

# Build the app for production
RUN npm run build-linux

# Expose port 4173
EXPOSE 4173

# Set the node environment to production
ENV NODE_ENV production

# Define the app run command
CMD [ "npm", "run", "run" ]
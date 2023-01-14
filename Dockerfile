# Base image for nodejs v18 (LTS)
FROM node:lts

# Create app directory
WORKDIR /usr/src/app

# Copy over the package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm run installModules

# Bundle app source
COPY . .

# Build the app for production
RUN npm run build-static

# Expose port 4173 (webapp)
EXPOSE 4173

# Set the node environment to production
ENV NODE_ENV production

# Define the app run command
CMD [ "npm", "run", "serve" ]
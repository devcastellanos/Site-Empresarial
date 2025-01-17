# Use Node.js version 18 as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the application for production
RUN npm run build

# Expose port 3000 (or whatever port your app uses)
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "start"]

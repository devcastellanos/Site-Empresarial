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

RUN npm run build

# Set the port to 3001 (or whatever port you prefer)
ENV PORT=3043

# Expose the custom port
EXPOSE 3043

# Start the application in production mode
CMD ["npm", "run","start"]

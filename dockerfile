# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for efficient caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# If you're using React-Three-Fiber, you'll also need WebGL support, which requires additional libraries:
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libxi6 \
    libgconf-2-4

# Copy the rest of the application code into the container
COPY . .

# Specify the command to run the application
CMD [ "npm", "start" ]

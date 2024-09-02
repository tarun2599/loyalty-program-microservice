# Use a Node.js image with a smaller footprint
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies, including TypeScript
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the application's port
EXPOSE 3000

# Run the compiled JavaScript file
CMD ["npm", "start"]

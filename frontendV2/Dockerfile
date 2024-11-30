# Step 1: Use Node.js image
FROM node:20 AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the React app's files
COPY . .

# Step 2: Expose the port Vite uses (5173)
EXPOSE 5173

# Step 3: Run the React app with Vite in development mode and bind to all interfaces
CMD ["npm", "run", "dev", "--", "--host"]
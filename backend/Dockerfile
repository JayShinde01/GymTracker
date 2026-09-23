# Dockerfile for Backend
FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and Prisma files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "start"]

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production Image with Build Tools Installed
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache make gcc g++ python3

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["npm", "start"]

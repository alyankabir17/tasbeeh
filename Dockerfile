FROM node:20-alpine
WORKDIR /app
COPY package*.json ./

# Add these two lines to handle network drops
RUN npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5

RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
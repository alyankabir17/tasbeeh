FROM node:20.19-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
ENV DATABASE_URL=postgresql://neondb_owner:npg_FsELP6z4tqvi@ep-solitary-cake-aiv6wbqv-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&uselibpqcompat=true

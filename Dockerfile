FROM node:20

WORKDIR /app

COPY . .

ENV DATABASE_URL="postgresql://neondb_owner:npg_9vO5DLdAUMlf@ep-wispy-sun-ao6cygyi-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

ENV AUTH_SECRET="secret123"

ENV NEXTAUTH_URL="http://localhost:3000"

ENV AUTH_TRUST_HOST="true"

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

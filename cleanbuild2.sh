sh resql
rm -rf node_modules
git clean -fdx

rm -rf prisma/migrations
npm install
npx prisma generate
npx prisma migrate dev # add-user-auth
npm run db:seed
npm run dev

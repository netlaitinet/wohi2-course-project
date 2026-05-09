sh resql
rm -rf node_modules
git clean -fdx

rm -rf prisma/migrations
npm install
npx prisma generate
npx prisma migrate dev --name add-user-auth
# npx prisma migrate dev --name add_image
npm run db:seed
npm run dev


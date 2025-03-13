<!-- .env exaple fayl -->
PORT = 3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=tech_spec

ACCESS_TOKEN_KEY = MyVeryVeryAccessTokenKey
ACCESS_TOKEN_TIME = "15h"
REFRESH_TOKEN_KEY = MyVeryVeryRefreshTokenKey
REFRESH_TOKEN_TIME = "15d"
COOKIE_TIME=1296000000

code ishga tushirish uchun npm run start:dev

user qoshganingizdan song admin rolelini berish ushun giveRoleAdmin() funksiyasini qilib qoydim userServcie ichida

swaggerga kirish http://localhost:3000/api/docs
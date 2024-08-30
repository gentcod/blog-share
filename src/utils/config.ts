import dotenv from 'dotenv';

dotenv.config({
   path: './config.dev.env'
});

const dbString = process.env.MONGO_CLUSTER.replace('<password>', process.env.PASSWORD);

const mb = 3 * 1024 * 1024;

export const CONFIG = {
   DB: dbString,
   PORT: process.env.PORT || 5050,
   JWTPrivateKey: process.env.JWTPRIVATEKEY,
   JwtAuthExpiration: process.env.JWTXPIRATION,
}
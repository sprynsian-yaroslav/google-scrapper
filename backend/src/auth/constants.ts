require('dotenv').config()
export const jwtConstants = {
    secret: process.env.SESSION_SECRET,
};
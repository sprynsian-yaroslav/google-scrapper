require('dotenv').config()

console.log("process.env.SESSION_SECRET", process.env.SESSION_SECRET)
export const jwtConstants = {
    secret: process.env.SESSION_SECRET,
};
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.mongodb_uri || '';
const JWT_SECRET = process.env.jwt_secret || '';

module.exports = {
    MONGODB_URI,
    JWT_SECRET
};
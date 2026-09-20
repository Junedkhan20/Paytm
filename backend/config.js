const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.mongodb_uri || 'mongodb+srv://junaidkhanofficial98_db_user:0al1WkJMoZ4br8JF@cluster0.ajcqqa7.mongodb.net/paytmApp';
const JWT_SECRET = process.env.jwt_secret || 'jksecret';

module.exports = {
    MONGODB_URI,
    JWT_SECRET
};
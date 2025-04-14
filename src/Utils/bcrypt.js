const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "your_secret_key"; // Bu kalit JWT token yaratish uchun ishlatiladi

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};  
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
const generateToken = (userData) => {
    return jwt.sign(userData, SECRET_KEY, { expiresIn: "1h" });
};

// Tokenni tekshirish (decode qilish)
const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
};

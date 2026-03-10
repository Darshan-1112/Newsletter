const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginAdmin = async (email, password) => {
    // 1. Check if admin exists
    const admin = await Admin.findByEmail(email);
    if (!admin) {
        throw new Error('Invalid email or password');
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
        { id: admin.id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return { token, admin: { id: admin.id, email: admin.email } };
};

module.exports = { loginAdmin };
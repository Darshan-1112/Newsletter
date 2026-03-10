const authService = require('../services/authService');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, admin } = await authService.loginAdmin(email, password);

        // Set HTTP-Only Cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript access
            secure: process.env.NODE_ENV === 'production', // Only over HTTPS in production
            sameSite: 'strict', // Prevents CSRF
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({ message: 'Login successful', admin });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { login, logout };
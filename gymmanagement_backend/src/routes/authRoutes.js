const express = require('express');
const router = express.Router();
const { generateTokens, verifyRefreshToken, setTokenCookies } = require('../services/auth');

router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        const decoded = await verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const tokens = generateTokens(user);
        setTokenCookies(res, tokens);

        res.json({
            message: 'Token refreshed successfully',
            user: { id: user._id, name: user.name, email: user.email },
            accessToken: tokens.accessToken
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
});

module.exports = router; 
import express from 'express';
import { googleAuth, linkGoogleAccount, unlinkGoogleAccount, refreshToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/google', googleAuth);

router.post('/link-google', authenticateToken, linkGoogleAccount);
router.post('/unlink-google', authenticateToken, unlinkGoogleAccount);
router.post('/refresh-token', refreshToken);

router.post('/logout', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;

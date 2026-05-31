import { Router } from 'express';
import { AppConfig } from './appConfig.model.js';

const router = Router();

// Public endpoint - no auth required
router.get('/auth-media', async (req, res, next) => {
  try {
    const config = await AppConfig.findOne({ key: 'auth_background_media' }).lean();
    res.status(200).json({ 
      success: true, 
      data: config ? config.value : [] 
    });
  } catch (err) {
    next(err);
  }
});

export default router;

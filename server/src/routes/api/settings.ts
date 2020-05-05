import express from 'express';
import { setSettings, getSettings } from '../../controllers/settingsController';

const router = express.Router();

router.get('/', getSettings);
router.post('/', setSettings);

export default router;

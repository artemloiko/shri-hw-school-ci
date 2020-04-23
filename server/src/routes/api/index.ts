import express from 'express';
import settingsRoutes from './settings';
import buildsRoutes from './builds';

const router = express.Router();

router.use('/settings', settingsRoutes);
router.use('/builds', buildsRoutes);

export default router;

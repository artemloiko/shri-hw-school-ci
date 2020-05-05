import express from 'express';
import {
  getBuildList,
  addBuild,
  getBuildDetails,
  getBuildLog,
} from '../../controllers/buildsController';

const router = express.Router();

router.get('/', getBuildList);
router.post('/:commitHash', addBuild);
router.get('/:commitHash', getBuildDetails);
router.get('/:commitHash/logs', getBuildLog);

export default router;

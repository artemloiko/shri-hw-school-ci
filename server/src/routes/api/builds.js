const express = require('express');
const {
  getBuildList,
  addBuild,
  getBuildDetails,
  getBuildLog,
} = require('../../controllers/buildsController');

const router = express.Router();

router.get('/', getBuildList);
router.post('/:commitHash', addBuild);
router.get('/:commitHash', getBuildDetails);
router.get('/:commitHash/logs', getBuildLog);

module.exports = router;

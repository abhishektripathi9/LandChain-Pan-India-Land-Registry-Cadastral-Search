const express = require('express');
const router = express.Router();
const landController = require('../controllers/landController');

router.get('/', landController.getAllLands);
router.get('/:id', landController.getLandById);
router.post('/', landController.createLand);
router.put('/:id/status', landController.updateLandStatus);
router.get('/:id/history', landController.getLandHistory);

module.exports = router;

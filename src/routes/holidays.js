const express = require('express');
const router = express.Router();

const {
    getAllHolidayController,
    getNextHolidayController,
    getCurrentHolidayController,
    getSuggestionsController
} = require('../controllers/holidayController');

router.get('/', getAllHolidayController);
router.get('/next', getNextHolidayController);
router.get('/current', getCurrentHolidayController);
router.get('/suggestions', getSuggestionsController);

module.exports = router;

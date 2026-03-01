const holidayService = require('../services/holidayService');
const suggestionService = require('../services/suggestionService');

const getAllHolidayController = (req, res) => {
    const { year, month, is_joint } = req.query;
    const filters = {};

    if (year) filters.year = parseInt(year);
    if (month) filters.month = parseInt(month);
    if (is_joint !== undefined) filters.is_joint = is_joint === 'true';

    const holidays = holidayService.getAllHolidays(filters);

    res.json({
        success: true,
        data: holidays,
        meta: { total: holidays.length }
    });
}

const getNextHolidayController = (req, res) => {
    try {
        const { date } = req.query;

    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
          success: false,
          error: { code: 'INVALID_DATE', message: 'Date must be YYYY-MM-DD' }
      });
    }

    let referenceDate;

    if (date) {
        referenceDate = new Date(date);
    }

    const nextHoliday = holidayService.getNextHoliday(referenceDate);

    if (!nextHoliday) {
        return res.json({
            success: true,
            data: null,
            message: 'No upcoming holidays found'
        });
    }

    res.json({
        success: true,
        data: nextHoliday
    });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error.message
            }
        });
    }
}

const getCurrentHolidayController = (req, res) => {
    try {
        const { date } = req.query

        if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_DATE', message: 'Date must be YYYY-MM-DD' }
            });
        }

        const currentHoliday = holidayService.getCurrentHoliday(date);

        res.json({
            success: true,
            data: currentHoliday,
            message: currentHoliday ? 'Holiday Found' : 'No holiday found for this date'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error.message
            }
        });
    }
}

const getSuggestionsController = (req, res) => {
    try {
        const { year, max_leave_days } = req.query;

    const suggestionYear = year ? parseInt(year) : new Date().getFullYear();
    const maxLeaveDays = max_leave_days ? parseInt(max_leave_days) : 5;

    if (isNaN(suggestionYear) || suggestionYear < 2000 || suggestionYear > 2100) {
        return res.status(400).json({
                  success: false,
                  error: { code: 'INVALID_YEAR', message: 'Year must be between 2000 and 2100' }
              });
    }

    if (isNaN(maxLeaveDays) || maxLeaveDays < 1 || maxLeaveDays > 15) {
        return res.status(400).json({
                  success: false,
                  error: { code: 'INVALID_MAX_LEAVE', message: 'max_leave_days must be between 1 and 15' }
              });
    }

    const suggestions = suggestionService.generateSuggestions(suggestionYear, maxLeaveDays);

    res.json({
        success: true,
        data: {
            year: suggestionYear,
            max_leave_days: maxLeaveDays,
            suggestions
        }
    })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error.message
            }
        });
    }
}

module.exports = {
    getAllHolidayController,
    getNextHolidayController,
    getCurrentHolidayController,
    getSuggestionsController
};

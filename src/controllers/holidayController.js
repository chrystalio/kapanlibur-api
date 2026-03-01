const holidayService = require('../services/holidayService');
const suggestionService = require('../services/suggestionService');

/**
 * @swagger
 * /v1/holidays:
 *   get:
 *     summary: Get all holidays
 *     description: Retrieve a list of Indonesian national holidays with optional filters
 *     tags: [Holidays]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year (e.g., 2025)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filter by month (1-12)
 *       - in: query
 *         name: is_joint
 *         schema:
 *           type: boolean
 *         description: Filter for joint holidays only (cuti bersama)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2025-01-01"
 *                       day:
 *                         type: string
 *                         example: "Rabu"
 *                       name:
 *                         type: string
 *                         example: "Tahun Baru"
 *                       is_joint:
 *                         type: boolean
 *                         example: false
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 58
 */
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

/**
 * @swagger
 * /v1/holidays/next:
 *   get:
 *     summary: Get next holiday
 *     description: Find the next upcoming holiday from a reference date
 *     tags: [Holidays]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Reference date in YYYY-MM-DD format (defaults to today)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     date:
 *                       type: string
 *                       example: "2025-01-01"
 *                     day:
 *                       type: string
 *                       example: "Rabu"
 *                     name:
 *                       type: string
 *                       example: "Tahun Baru"
 *                     is_joint:
 *                       type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid date format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /v1/holidays/current:
 *   get:
 *     summary: Get holiday for specific date
 *     description: Check if a specific date is a holiday
 *     tags: [Holidays]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to check in YYYY-MM-DD format (defaults to today)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     date:
 *                       type: string
 *                       example: "2025-01-01"
 *                     day:
 *                       type: string
 *                       example: "Rabu"
 *                     name:
 *                       type: string
 *                       example: "Tahun Baru"
 *                     is_joint:
 *                       type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid date format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /v1/holidays/suggestions:
 *   get:
 *     summary: Get leave suggestions
 *     description: Get optimized leave suggestions to maximize long weekends using holiday bridging
 *     tags: [Holidays]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 2000
 *           maximum: 2100
 *         description: Year to generate suggestions for (defaults to current year)
 *       - in: query
 *         name: max_leave_days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 15
 *         description: Maximum leave days willing to take (defaults to 5)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     year:
 *                       type: integer
 *                       example: 2025
 *                     max_leave_days:
 *                       type: integer
 *                       example: 5
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Maulid Nabi Muhammad SAW"
 *                           date:
 *                             type: string
 *                             example: "2025-09-06"
 *                           suggestion:
 *                             type: string
 *                             example: "Ambil cuti Jumat (5 Sep) untuk libur 5 hari"
 *                           leave_days_required:
 *                             type: integer
 *                             example: 1
 *                           total_days_off:
 *                             type: integer
 *                             example: 5
 *                           efficiency:
 *                             type: number
 *                             example: 5
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

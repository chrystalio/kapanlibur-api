const holidayService = require('../services/holidayService');
const suggestionService = require('../services/suggestionService');
const { tError, tMessage } = require('../utils/translator');

/**
 * @swagger
 * /v1/holidays:
 *   get:
 *     summary: Get all holidays
 *     description: Retrieve a list of Indonesian national holidays with optional filters. Supports bilingual responses.
 *     tags: [Holidays]
 *     parameters:
 *       - $ref: '#/components/parameters/Lang'
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
 *                     $ref: '#/components/schemas/Holiday'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 58
 */
const getAllHolidayController = (req, res) => {
    const { year, month, is_joint } = req.query;
    const lang = req.language || 'id';
    const filters = {};

    if (year) filters.year = parseInt(year);
    if (month) filters.month = parseInt(month);
    if (is_joint !== undefined) filters.is_joint = is_joint === 'true';

    const holidays = holidayService.getAllHolidays(filters, lang);

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
 *     description: Find the next upcoming holiday from a reference date. Supports bilingual responses.
 *     tags: [Holidays]
 *     parameters:
 *       - $ref: '#/components/parameters/Lang'
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
 *               allOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     data:
 *                       nullable: true
 *                       allOf:
 *                         - $ref: '#/components/schemas/Holiday'
 *                         - type: object
 *                           properties:
 *                             days_until:
 *                               type: integer
 *                               description: Days until the holiday
 *                             is_today:
 *                               type: boolean
 *                               description: Whether the holiday is today
 *                     message:
 *                       type: string
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
        const lang = req.language || 'id';

        if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_DATE', message: tError('INVALID_DATE', lang) }
            });
        }

        let referenceDate;

        if (date) {
            referenceDate = new Date(date);
        }

        const nextHoliday = holidayService.getNextHoliday(referenceDate, lang);

        if (!nextHoliday) {
            return res.json({
                success: true,
                data: null,
                message: tMessage('NO_HOLIDAYS_FOUND', lang)
            });
        }

        res.json({
            success: true,
            data: nextHoliday
        });

    } catch {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: tError('INTERNAL_ERROR', req.language)
            }
        });
    }
}

/**
 * @swagger
 * /v1/holidays/current:
 *   get:
 *     summary: Get holiday for specific date
 *     description: Check if a specific date is a holiday. Supports bilingual responses.
 *     tags: [Holidays]
 *     parameters:
 *       - $ref: '#/components/parameters/Lang'
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
 *                   $ref: '#/components/schemas/Holiday'
 *                   nullable: true
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
        const { date } = req.query;
        const lang = req.language || 'id';

        if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_DATE', message: tError('INVALID_DATE', lang) }
            });
        }

        const currentHoliday = holidayService.getCurrentHoliday(date, lang);

        res.json({
            success: true,
            data: currentHoliday,
            message: currentHoliday ? tMessage('HOLIDAY_FOUND', lang) : tMessage('NO_HOLIDAY_FOR_DATE', lang)
        });
    } catch {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: tError('INTERNAL_ERROR', req.language)
            }
        });
    }
}

/**
 * @swagger
 * /v1/holidays/suggestions:
 *   get:
 *     summary: Get leave suggestions
 *     description: Get optimized leave suggestions to maximize long weekends using holiday bridging. Supports bilingual responses.
 *     tags: [Holidays]
 *     parameters:
 *       - $ref: '#/components/parameters/Lang'
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
 *                       example: 2026
 *                     max_leave_days:
 *                       type: integer
 *                       example: 5
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           holiday:
 *                             $ref: '#/components/schemas/Holiday'
 *                           suggested_leave_dates:
 *                             type: array
 *                             items:
 *                               type: string
 *                               format: date
 *                           leave_days_required:
 *                             type: integer
 *                           total_days_off:
 *                             type: integer
 *                           period:
 *                             type: object
 *                             properties:
 *                               start:
 *                                 type: string
 *                               end:
 *                                 type: string
 *                           reason:
 *                             type: string
 *                             description: Translated suggestion reason based on lang parameter
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
        const lang = req.language || 'id';

        const suggestionYear = year ? parseInt(year) : new Date().getFullYear();
        const maxLeaveDays = max_leave_days ? parseInt(max_leave_days) : 5;

        if (isNaN(suggestionYear) || suggestionYear < 2000 || suggestionYear > 2100) {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_YEAR', message: tError('INVALID_YEAR', lang) }
            });
        }

        if (isNaN(maxLeaveDays) || maxLeaveDays < 1 || maxLeaveDays > 15) {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_MAX_LEAVE', message: tError('INVALID_MAX_LEAVE', lang) }
            });
        }

        const suggestions = suggestionService.generateSuggestions(suggestionYear, maxLeaveDays, lang);

        res.json({
            success: true,
            data: {
                year: suggestionYear,
                max_leave_days: maxLeaveDays,
                suggestions
            }
        });
    } catch {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: tError('INTERNAL_ERROR', req.language)
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

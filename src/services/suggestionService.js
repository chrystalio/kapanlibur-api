const { loadHolidays } = require('../utils/dataParser');
const { tSuggestion } = require('../utils/translator');
const { formatDate, parseDate, daysBetween, getDayName, isWeekend } = require('../utils/dateHelpers');

const generateSuggestions = (year = new Date().getFullYear(), maxLeaveDays = 5, lang = 'id') => {
    const language = lang || 'id';
    const allHolidays = loadHolidays();
    const yearHolidays = allHolidays.filter(h => h.date.startsWith(year.toString()));
    const suggestions = [];

    for (const holiday of yearHolidays) {
        const weekendInfo = isHolidayNearWeekend(holiday, language);

        if (weekendInfo.isNearWeekend) {
            suggestions.push({
                holiday: {
                    date: holiday.date,
                    day: getDayName(holiday.date, language),
                    name: holiday.name[language] || holiday.name['id'],
                    is_joint: holiday.is_joint
                },
                suggested_leave_dates: [weekendInfo.suggestedDay],
                leave_days_required: weekendInfo.leaveDaysRequired,
                total_days_off: weekendInfo.totalDaysOff,
                period: {
                    start: weekendInfo.periodStart,
                    end: weekendInfo.periodEnd
                },
                reason: weekendInfo.reason
            });
        }
    }

    const bridges = findHolidayBridges(yearHolidays, language);
    for (const bridge of bridges) {
        const fromHoliday = yearHolidays.find(h => h.date === bridge.from);
        const toHoliday = yearHolidays.find(h => h.date === bridge.to);

        suggestions.push({
            holiday: {
                date: fromHoliday.date,
                day: getDayName(fromHoliday.date, language),
                name: fromHoliday.name[language] || fromHoliday.name['id'],
                is_joint: fromHoliday.is_joint
            },
            suggested_leave_dates: bridge.bridgeDates,
            leave_days_required: bridge.leaveDaysRequired,
            total_days_off: bridge.gapDays + 1,
            period: { start: bridge.from, end: bridge.to },
            reason: tSuggestion('bridge_between_holidays', language, {
                days: bridge.leaveDaysRequired,
                holiday1: fromHoliday.name[language] || fromHoliday.name['id'],
                holiday2: toHoliday.name[language] || toHoliday.name['id'],
                total: bridge.gapDays + 1
            })
        });
    }

    suggestions.sort((a, b) => {
        const efficiencyA = a.total_days_off / a.leave_days_required;
        const efficiencyB = b.total_days_off / b.leave_days_required;
        return efficiencyB - efficiencyA;
    });

    return suggestions.filter(s => s.leave_days_required > 0 && s.leave_days_required <= maxLeaveDays);
}

const isHolidayNearWeekend = (holiday, lang = 'id') => {
    const language = lang || 'id';
    const date = parseDate(holiday.date);
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 4) {
        const startDate = new Date(date);
        const endDate = new Date(date)
        const suggestedDate = new Date(date);

        endDate.setDate(date.getDate() + 3)
        suggestedDate.setDate(date.getDate() + 1);

        return {
            isNearWeekend: true,
            suggestedDay: formatDate(suggestedDate),
            periodStart: formatDate(startDate),
            periodEnd: formatDate(endDate),
            totalDaysOff: 4,
            leaveDaysRequired: 1,
            reason: tSuggestion('thursday_before_weekend', language),
        }
    }

    if (dayOfWeek === 5) {
        const startDate = new Date(date);
        const endDate = new Date(date)
        const suggestedDate = new Date(date);

        endDate.setDate(date.getDate() + 3)
        suggestedDate.setDate(date.getDate() + 3);

        return {
            isNearWeekend: true,
            suggestedDay: formatDate(suggestedDate),
            periodStart: formatDate(startDate),
            periodEnd: formatDate(endDate),
            totalDaysOff: 4,
            leaveDaysRequired: 1,
            reason: tSuggestion('friday_before_weekend', language),
        }
    }

    return {
        isNearWeekend: false,
        suggestedDay: null,
        reason: null
    }
}

const findHolidayBridges = (holidays, lang = 'id') => {
    const bridges = [];

    for (let i = 0; i < holidays.length - 1; i++) {
        const current = parseDate(holidays[i].date);
        const next = parseDate(holidays[i + 1].date);
        const gap = daysBetween(current, next);

        if (gap >= 1 && gap <= 3) {
            const bridgeDates = [];
            let actualLeaveDays = 0;

            for (let j = 1; j < gap; j++) {
                const bridgeDate = new Date(current);
                bridgeDate.setDate(current.getDate() + j);
                if (!isWeekend(bridgeDate)) {
                    bridgeDates.push(formatDate(bridgeDate));
                    actualLeaveDays++;
                }
            }

            // Only include if there are actual work days to take off
            if (actualLeaveDays > 0) {
                bridges.push({
                    from: holidays[i].date,
                    to: holidays[i + 1].date,
                    gapDays: gap,
                    bridgeDates: bridgeDates,
                    leaveDaysRequired: actualLeaveDays
                });
            }
        }
    }

    return bridges;
};

module.exports = {
    generateSuggestions,
    isHolidayNearWeekend,
    findHolidayBridges
};

const { loadHolidays } = require('../utils/dataParser');
const { formatDate, parseDate, daysBetween } = require('../utils/dateHelpers');

const generateSuggestions = (year = new Date().getFullYear(), maxLeaveDays = 5) => {
    const allHolidays = loadHolidays();
    const yearHolidays = allHolidays.filter(h => h.date.startsWith(year.toString()));
    const suggestions = [];

    for (const holiday of yearHolidays) {
        const weekendInfo = isHolidayNearWeekend(holiday);

        if (weekendInfo.isNearWeekend) {
            suggestions.push({
                holiday: holiday,
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

    const bridges = findHolidayBridges(yearHolidays);
    for (const bridge of bridges) {
        const fromHoliday = yearHolidays.find(h => h.date === bridge.from);
        const toHoliday = yearHolidays.find(h => h.date === bridge.to);

        suggestions.push({
            holiday: fromHoliday,
            suggested_leave_dates: bridge.bridgeDates,
            leave_days_required: bridge.leaveDaysRequired,
            total_days_off: bridge.gapDays + 1,
            period: { start: bridge.from, end: bridge.to },
            reason: `Bridge between ${fromHoliday.name} and ${toHoliday.name}`
        });
    }

    suggestions.sort((a, b) => {
        const efficiencyA = a.total_days_off / a.leave_days_required;
        const efficiencyB = b.total_days_off / b.leave_days_required;
        return efficiencyB - efficiencyA;
    });

    return suggestions.filter(s => s.leave_days_required > 0);
}

const isHolidayNearWeekend = (holiday) => {
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
            reason: 'Holiday is on Thursday, take Friday off for 4-day weekend'
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
            reason: 'Holiday is on Friday, take Monday off for 4-day weekend'
        }
    }

    return {
        isNearWeekend: false,
        suggestedDay: null,
        reason: null
    }
}

const findHolidayBridges = (holidays) => {
    const bridges = [];

    for (let i = 0; i < holidays.length - 1; i++) {
        const current = parseDate(holidays[i].date);
        const next = parseDate(holidays[i + 1].date);
        const gap = daysBetween(current, next);

        if (gap >= 1 && gap <= 3) {
            const bridgeDates = [];
            for (let j = 1; j < gap; j++) {
                const bridgeDate = new Date(current);
                bridgeDate.setDate(current.getDate() + j);
                bridgeDates.push(formatDate(bridgeDate));
            }

            bridges.push({
                from: holidays[i].date,
                to: holidays[i + 1].date,
                gapDays: gap,
                bridgeDates: bridgeDates,
                leaveDaysRequired: bridgeDates.length
            });
        }
    }

    return bridges;
};

module.exports = {
    generateSuggestions,
    isHolidayNearWeekend,
    findHolidayBridges
};

const { loadHolidays } = require("../utils/dataParser")
const { formatDate, parseDate, daysBetween } = require("../utils/dateHelpers")

const getAllHolidays = (filters = {}) => {
    let holidays = loadHolidays();

     if (filters.year) {
        holidays = holidays.filter(h => h.date.startsWith(filters.year.toString()));
    }

    if (filters.month) {
        const month = String(filters.month).padStart(2, '0');
        holidays = holidays.filter(h => {
            const dateMonth = h.date.split('-')[1];
            return dateMonth === month;
        });
    }

    if (filters.is_joint !== undefined) {
        holidays = holidays.filter(h => h.is_joint === filters.is_joint);
    }

    return holidays;
}

const getNextHoliday = (referenceDate = new Date()) => {
    const holidays = loadHolidays();
    const referenceDateFormatted = formatDate(referenceDate);
    const upcomingHoliday = holidays.find(holiday => holiday.date >= referenceDateFormatted);

    if (!upcomingHoliday) {
        return null;
    }

    const holidayDate = parseDate(upcomingHoliday.date);
    const daysUntil = daysBetween(referenceDate, holidayDate);
    const isToday = upcomingHoliday.date === referenceDateFormatted;

    return {
        ...upcomingHoliday,
        days_until: daysUntil,
        is_today: isToday
    };
}

const getCurrentHoliday = (dateInput = new Date()) => {
    let dateStr;

    if (typeof dateInput === 'string') {
        dateStr = dateInput;
    } else {
        dateStr = formatDate(dateInput);
    }

   const holidays = loadHolidays();
    const holiday = holidays.find(h => h.date === dateStr);

    if (!holiday) {
        return null;
    }

    return {
        ...holiday,
        is_today: true
    };
}


module.exports = { getAllHolidays, getNextHoliday, getCurrentHoliday };

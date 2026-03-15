const { loadHolidays } = require("../utils/dataParser")
const { formatDate, parseDate, daysBetween, getDayName } = require("../utils/dateHelpers")

const getAllHolidays = (filters = {}, lang = 'id') => {
    const language = lang || 'id';
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

    return holidays.map(holiday => ({
        date: holiday.date,
        day: getDayName(holiday.date, language),
        name: holiday.name[language] || holiday.name['id'],
        is_joint: holiday.is_joint
    }));
}

const getNextHoliday = (referenceDate = new Date(), lang = 'id') => {
    const holidays = loadHolidays();
    const referenceDateFormatted = formatDate(referenceDate);
    const upcomingHoliday = holidays.find(holiday => holiday.date >= referenceDateFormatted);
    const language = lang || 'id';

    if (!upcomingHoliday) {
        return null;
    }

    const holidayDate = parseDate(upcomingHoliday.date);
    const daysUntil = daysBetween(referenceDate, holidayDate);
    const isToday = upcomingHoliday.date === referenceDateFormatted;

    return {
        date: upcomingHoliday.date,
        day: getDayName(upcomingHoliday.date, language),
        name: upcomingHoliday.name[language] || upcomingHoliday.name['id'],
        is_joint: upcomingHoliday.is_joint,
        days_until: daysUntil,
        is_today: isToday
    };
}

const getCurrentHoliday = (dateInput = new Date(), lang = 'id') => {
    let dateStr;
    const language = lang || 'id';

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
        date: holiday.date,
        day: getDayName(holiday.date, language),
        name: holiday.name[language] || holiday.name['id'],
        is_joint: holiday.is_joint,
        is_today: true
    };
}


module.exports = { getAllHolidays, getNextHoliday, getCurrentHoliday };

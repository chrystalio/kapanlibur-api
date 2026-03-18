// WIB timezone offset (UTC+7)
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

// Format date as YYYY-MM-DD in WIB timezone (works regardless of server timezone)
const formatDate = (date) => {
    const wibTimestamp = date.getTime() + WIB_OFFSET_MS;
    const wibDate = new Date(wibTimestamp);

    const year = wibDate.getUTCFullYear();
    const month = String(wibDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(wibDate.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const isWeekend = (date) => {
    const wibTimestamp = date.getTime() + WIB_OFFSET_MS;
    const wibDate = new Date(wibTimestamp);

    const dayOfWeek = wibDate.getUTCDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
}

const getDayName = (dateInput, lang = 'id') => {
    const date = typeof dateInput === 'string' ? parseDate(dateInput) : dateInput;
    return date.toLocaleDateString(lang, { timeZone: 'Asia/Jakarta', weekday: 'long' });
}

const getDayNameIndonesian = (date) => {
    return getDayName(date, 'id');
}

const daysBetween = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
}

const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

module.exports = { formatDate, isWeekend, getDayName, getDayNameIndonesian, daysBetween, parseDate };

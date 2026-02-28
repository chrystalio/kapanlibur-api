const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const isWeekend = (date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
}

const getDayNameIndonesian = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
}

const daysBetween = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
}

const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

module.exports = { formatDate, isWeekend, getDayNameIndonesian, daysBetween, parseDate };

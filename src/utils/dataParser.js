const fs = require('fs');
const path = require('path');

const loadHolidays = () => {
    const filePath = path.join(__dirname, '../data/holidays.json');

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Failed to load holidays: ${error.message}`);
    }
};

module.exports = { loadHolidays };
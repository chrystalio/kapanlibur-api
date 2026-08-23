const { isHolidayNearWeekend, generateSuggestions } = require('../src/services/suggestionService');

describe('isHolidayNearWeekend', () => {
    describe('Thursday (dayOfWeek === 4)', () => {
        // 2024-05-09 is a Thursday (Ascension Day)
        test('Thursday holiday suggests taking Friday off', () => {
            const result = isHolidayNearWeekend({ date: '2024-05-09' }, 'en');
            expect(result.isNearWeekend).toBe(true);
            expect(result.suggestedDay).toBe('2024-05-10');
            expect(result.leaveDaysRequired).toBe(1);
            expect(result.totalDaysOff).toBe(4);
        });
    });

    describe('Friday (dayOfWeek === 5)', () => {
        // 2024-08-09 is a Friday
        test('Friday holiday suggests taking Monday off', () => {
            const result = isHolidayNearWeekend({ date: '2024-08-09' }, 'en');
            expect(result.isNearWeekend).toBe(true);
            expect(result.suggestedDay).toBe('2024-08-12');
            expect(result.leaveDaysRequired).toBe(1);
            expect(result.totalDaysOff).toBe(4);
        });
    });

    describe('Monday (dayOfWeek === 1)', () => {
        // 2026-08-17 is a Monday (Independence Day)
        test('Monday holiday extends the weekend for free', () => {
            const result = isHolidayNearWeekend({ date: '2026-08-17' }, 'en');
            expect(result.isNearWeekend).toBe(true);
            expect(result.suggestedDay).toBeNull();
            expect(result.leaveDaysRequired).toBe(0);
            expect(result.totalDaysOff).toBe(3);
            expect(result.periodStart).toBe('2026-08-15'); // Saturday
            expect(result.periodEnd).toBe('2026-08-17');   // Monday
        });
    });

    describe('Tuesday (dayOfWeek === 2)', () => {
        // 2026-08-25 is a Tuesday (Maulid Nabi Muhammad S.A.W.)
        // The bug: this case is currently NOT handled.
        test('Tuesday holiday suggests taking Monday off', () => {
            const result = isHolidayNearWeekend({ date: '2026-08-25' }, 'en');
            expect(result.isNearWeekend).toBe(true);
            expect(result.suggestedDay).toBe('2026-08-24');
            expect(result.leaveDaysRequired).toBe(1);
            expect(result.totalDaysOff).toBe(4);
            expect(result.periodStart).toBe('2026-08-22'); // Saturday
            expect(result.periodEnd).toBe('2026-08-25');   // Tuesday
        });
    });

    describe('Wednesday (dayOfWeek === 3)', () => {
        // 2024-09-18 is a Wednesday
        test('Wednesday holiday suggests taking Monday and Tuesday off', () => {
            const result = isHolidayNearWeekend({ date: '2024-09-18' }, 'en');
            expect(result.isNearWeekend).toBe(true);
            // Two leave days required: Mon (2024-09-16) and Tue (2024-09-17)
            expect(result.leaveDaysRequired).toBe(2);
            expect(result.totalDaysOff).toBe(5);
        });
    });

    describe('non-weekend-adjacent days', () => {
        // 2026-05-01 is a Friday (still handled by existing Friday branch)
        // Skip-day in middle of the week should not be marked as near-weekend.
        test('Tuesday that is mid-week (not after a weekend) is not near weekend', () => {
            // This case shouldn't actually happen for Indonesian public holidays,
            // but verifies the logic isn't over-eager. Use a Sunday — already
            // covered separately by bridge logic.
            const result = isHolidayNearWeekend({ date: '2024-04-14' }, 'en'); // Sunday
            expect(result.isNearWeekend).toBe(false);
        });
    });
});

describe('generateSuggestions for 2026', () => {
    test('produces a suggestion for 2026-08-25 (Tuesday Maulid)', () => {
        const suggestions = generateSuggestions(2026, 5, 'en');
        const aug25 = suggestions.filter(s => s.holiday.date === '2026-08-25');
        expect(aug25.length).toBeGreaterThan(0);
        const s = aug25[0];
        expect(s.suggested_leave_dates).toContain('2026-08-24');
        expect(s.leave_days_required).toBe(1);
        expect(s.total_days_off).toBe(4);
    });

    test('produces a suggestion for 2026-08-17 (Monday Independence Day)', () => {
        const suggestions = generateSuggestions(2026, 5, 'en');
        const aug17 = suggestions.filter(s => s.holiday.date === '2026-08-17');
        expect(aug17.length).toBeGreaterThan(0);
        const s = aug17[0];
        expect(s.leave_days_required).toBe(0);
        expect(s.total_days_off).toBe(3);
    });

    test('Thu/Fri branches still produce suggestions (regression check)', () => {
        const suggestions = generateSuggestions(2024, 5, 'en');
        // 2024-05-09 is a Thursday (Ascension Day)
        const thu = suggestions.filter(s => s.holiday.date === '2024-05-09');
        expect(thu.length).toBeGreaterThan(0);
    });
});
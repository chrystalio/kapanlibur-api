const http = require('http');

const get = (path) => new Promise((resolve) => {
    http.get('http://localhost:3000' + path, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
    });
});

async function runTests() {
    console.log('=== Phase 7: Testing & Documentation ===\n');

    console.log('--- 7.1: Manual Endpoint Testing ---');
    const all = await get('/v1/holidays');
    console.log('✓ Total holidays:', all.data.length);

    const y2025 = await get('/v1/holidays?year=2025');
    console.log('✓ 2025 holidays:', y2025.data.length);

    const dec2024 = await get('/v1/holidays?year=2024&month=12');
    console.log('✓ 2024-12 holidays:', dec2024.data.length);

    const joint = await get('/v1/holidays?is_joint=true');
    console.log('✓ Joint holidays:', joint.data.length);

    console.log('\n--- 7.2: Edge Case Testing ---');

    const invalidDate = await get('/v1/holidays/current?date=01-01-2025');
    console.log('✓ Invalid date format:', invalidDate.success === false ? '400 error' : 'FAIL');

    const invalidYear = await get('/v1/holidays/suggestions?year=abc');
    console.log('✓ Invalid year:', invalidYear.success === false ? '400 error' : 'FAIL');

    const invalidMax = await get('/v1/holidays/suggestions?max_leave_days=100');
    console.log('✓ Invalid max_leave_days:', invalidMax.success === false ? '400 error' : 'FAIL');

    const notFound = await get('/v1/does-not-exist');
    console.log('✓ 404 route:', notFound.success === false && notFound.error.code === 'NOT_FOUND' ? '404 error' : 'FAIL');

    const noData = await get('/v1/holidays?year=2030');
    console.log('✓ Year with no data:', noData.data.length === 0 ? 'Empty array' : 'FAIL');

    console.log('\n--- 7.3: Frontend Integration Verification ---');

    const knownHoliday = await get('/v1/holidays/current?date=2025-01-01');
    console.log('✓ Response structure:', knownHoliday.data.date ? 'Has holiday object' : 'FAIL');

    const sample = await get('/v1/holidays?year=2025');
    console.log('✓ Indonesian day name:', sample.data[0].day ? sample.data[0].day : 'FAIL');

    console.log('\n--- All Tests Complete! ---');
    process.exit(0);
}

runTests();

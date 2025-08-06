const pool = require('../config/db');

async function test() {
    try {
        const symbol = 'TEST_SYMBOL';
        const result = await pool.query(
            'SELECT COUNT(*) FROM "Events" WHERE symbol = $1',
            [symbol]
        );
        console.log(result.rows);
    } catch (err) {
        console.error(err);
    }
}

test();
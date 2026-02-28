const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'API is running!', timestamp: new Date().toISOString() });
});

app.get('/' , (req, res) => {
    res.json({
        'name': 'KapanLibur API',
        'version': '1.0.0',
        'description': 'API untuk informasi hari libur nasional Indonesia',
        'author': 'Chrystalio (Kristoff)',
    });
});

module.exports = app;

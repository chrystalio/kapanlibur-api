# KapanLibur API

RESTful API for Indonesian national holiday data including national holidays, religious observances, and "cuti bersama" (joint holidays).

**Version:** 1.2.0 - Docker deployment support!

## Features

- **Bilingual support** for Indonesian (`id`) and English (`en`) languages
- All Indonesian holidays with filtering (year, month, is_joint)
- Next upcoming holiday with countdown
- Current holiday check
- Intelligent leave day suggestions
- Localized error messages and suggestion reasons
- JSON-based storage (no database required)
- Rate limiting (100 req / 15 minutes) with bilingual error messages
- Security headers (Helmet)
- Pre-commit hooks (ESLint)
- Interactive API documentation (Swagger UI)

## Project Structure

```
kapanlibur-api/
├── src/
│   ├── config/
│   │   ├── index.js
│   │   ├── swagger.js
│   │   └── translations.js      # Translation dictionaries
│   ├── controllers/
│   │   └── holidayController.js
│   ├── data/
│   │   └── holidays.json         # Holiday data with bilingual names
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── languageHandler.js    # Language detection middleware
│   │   ├── rateLimiter.js
│   │   └── requestLogger.js
│   ├── routes/
│   │   └── holidays.js
│   ├── services/
│   │   ├── holidayService.js
│   │   └── suggestionService.js
│   ├── utils/
│   │   ├── dataParser.js
│   │   ├── dateHelpers.js
│   │   └── translator.js         # Translation utility
│   ├── app.js
│   └── server.js
├── .env.example
├── .husky/
├── package.json
└── README.md
```

## Installation

```bash
npm install
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

Server runs on port 3000 by default. Configure with `PORT` environment variable.

## Bilingual Support

The API supports Indonesian (`id`) and English (`en`) languages. Use the `lang` query parameter or `Accept-Language` header.

### Using Query Parameter

```bash
# Indonesian (default)
curl "http://localhost:3000/v1/holidays"

# English
curl "http://localhost:3000/v1/holidays?lang=en"

# Indonesian explicitly
curl "http://localhost:3000/v1/holidays?lang=id"
```

### Using Accept-Language Header

```bash
curl -H "Accept-Language: en" "http://localhost:3000/v1/holidays"
```

## API Documentation

Interactive API documentation is available via **Swagger UI**:

- **Production**: https://kapanliburapi.krisdev.my.id/docs
- **Development**: http://localhost:3000/docs

The documentation includes all endpoints, request/response schemas, language parameter, and examples you can try directly from the browser.

## Environment Variables

```bash
PORT=3000
NODE_ENV=development
```

## API Endpoints

Full interactive documentation with examples available at `/docs`

### Get All Holidays
```
GET /v1/holidays
```

Query Parameters:
- `lang` - Language preference (`en` or `id`, default: `id`)
- `year` - Filter by year
- `month` - Filter by month (1-12)
- `is_joint` - Filter by joint holiday status (true/false)

**Example:**
```bash
curl "http://localhost:3000/v1/holidays?year=2026&lang=en"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-01-01",
      "day": "Thursday",
      "name": "New Year's Day 2026",
      "is_joint": false
    }
  ],
  "meta": { "total": 1 }
}
```

### Get Next Holiday
```
GET /v1/holidays/next
```

Query Parameters:
- `lang` - Language preference (`en` or `id`)
- `date` - Reference date in YYYY-MM-DD format (defaults to today)

**Example:**
```bash
curl "http://localhost:3000/v1/holidays/next?lang=id"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2026-03-18",
    "day": "Rabu",
    "name": "Hari Suci Nyepi (Tahun Baru Saka 1948)",
    "is_joint": false,
    "days_until": 5,
    "is_today": false
  }
}
```

### Get Current Holiday
```
GET /v1/holidays/current
```

Query Parameters:
- `lang` - Language preference (`en` or `id`)
- `date` - Date in YYYY-MM-DD format (defaults to today)

**Example:**
```bash
curl "http://localhost:3000/v1/holidays/current?date=2026-01-01&lang=en"
```

### Get Leave Suggestions
```
GET /v1/holidays/suggestions
```

Query Parameters:
- `lang` - Language preference (`en` or `id`)
- `year` - Year to analyze (defaults to current year)
- `max_leave_days` - Maximum leave days to suggest (default: 5)

**Example:**
```bash
curl "http://localhost:3000/v1/holidays/suggestions?year=2026&lang=id"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "year": 2026,
    "max_leave_days": 5,
    "suggestions": [
      {
        "holiday": {
          "date": "2026-01-01",
          "day": "Kamis",
          "name": "Tahun Baru 2026 Masehi",
          "is_joint": false
        },
        "suggested_leave_dates": ["2026-01-02"],
        "leave_days_required": 1,
        "total_days_off": 4,
        "period": { "start": "2026-01-01", "end": "2026-01-04" },
        "reason": "Hari libur jatuh pada Kamis, ambil cuti Jumat untuk liburan 4 hari"
      }
    ]
  }
}
```

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-15T10:30:00.000Z",
  "uptime": "2h 15m 30s",
  "language": "en"
}
```

## Rate Limiting

- **100 requests per 15 minutes** per IP
- Returns `429 Too Many Requests` when limit exceeded
- Error message is localized based on request language

## Response Format

Success:
```json
{ "success": true, "data": {...}, "meta": {...} }
```

Error:
```json
{ "success": false, "error": { "code": "...", "message": "..." } }
```

Error messages are translated based on the `lang` parameter or `Accept-Language` header.

## Development

### Linting

ESLint runs automatically on commit. To lint manually:

```bash
npm run lint
```

### Pre-commit Hooks

Husky runs `lint-staged` before each commit, ensuring code quality.

## License

MIT License - see [LICENSE](LICENSE) file for details.

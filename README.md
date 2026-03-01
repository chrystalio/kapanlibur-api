# KapanLibur API

RESTful API for Indonesian national holiday data including national holidays, religious observances, and "cuti bersama" (joint holidays).

## Features

- All Indonesian holidays with filtering (year, month, is_joint)
- Next upcoming holiday with countdown
- Current holiday check
- Intelligent leave day suggestions
- JSON-based storage (no database required)
- Rate limiting (100 req / 15 minutes)
- Security headers (Helmet)
- Pre-commit hooks (ESLint)
- Interactive API documentation (Swagger UI)

## Project Structure

```
kapanlibur-api/
├── src/
│   ├── config/
│   │   ├── index.js
│   │   └── swagger.js
│   ├── controllers/
│   │   └── holidayController.js
│   ├── data/
│   │   └── holidays.json
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── requestLogger.js
│   ├── routes/
│   │   └── holidays.js
│   ├── services/
│   │   ├── holidayService.js
│   │   └── suggestionService.js
│   ├── utils/
│   │   ├── dataParser.js
│   │   └── dateHelpers.js
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

## API Documentation

Interactive API documentation is available via **Swagger UI**:

- **Production**: https://kapanliburapi.kristoff.my.id/docs
- **Development**: http://localhost:3000/docs

The documentation includes all endpoints, request/response schemas, and examples you can try directly from the browser.

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
- `year` - Filter by year
- `month` - Filter by month (1-12)
- `is_joint` - Filter by joint holiday status (true/false)

### Get Next Holiday
```
GET /v1/holidays/next
```

Query Parameters:
- `date` - Reference date in YYYY-MM-DD format (defaults to today)

### Get Current Holiday
```
GET /v1/holidays/current
```

Query Parameters:
- `date` - Date in YYYY-MM-DD format (defaults to today)

### Get Leave Suggestions
```
GET /v1/holidays/suggestions
```

Query Parameters:
- `year` - Year to analyze (defaults to current year)
- `max_leave_days` - Maximum leave days to suggest (default: 5)

### Health Check
```
GET /health
```

## Rate Limiting

- **100 requests per 15 minutes** per IP
- Returns `429 Too Many Requests` when limit exceeded

## Attribution

This API is provided as free for public use. Attribution is appreciated but not required. If you use this API in your project, consider adding:

```
Data provided by KapanLibur API (https://github.com/chrystalio/kapanlibur-api)
```

Or in your code:
```javascript
// API by Chrystalio (Kristoff)
// https://github.com/chrystalio/kapanlibur-api
```

## Response Format

Success:
```json
{ "success": true, "data": {...}, "meta": {...} }
```

Error:
```json
{ "success": false, "error": { "code": "...", "message": "..." } }
```

## Data Structure

```json
{
  "date": "2025-01-01",
  "day": "Rabu",
  "name": "Tahun Baru 2025 Masehi",
  "is_joint": false
}
```

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

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Additional language translations
- Rate limiting per language preferences

## [Released]

## v1.1.0 (2026-03-15)

### Added

- Bilingual support for Indonesian (`id`) and English (`en`) languages across all API endpoints
- Language detection via `?lang=` query parameter or `Accept-Language` header
- Translation utility (`src/utils/translator.js`) with interpolation support
- Translation dictionaries for errors, messages, and suggestion reasons (`src/config/translations.js`)
- `getDayName()` function using `Intl` API for bilingual day names
- Language handler middleware for automatic language detection
- English translations for all holidays in data file
- `lang` parameter documentation in Swagger/OpenAPI specification

### Changed

- All holiday service functions now accept `lang` parameter for translated responses
- All suggestion service functions return translated reason messages
- Controllers pass `req.language` to services
- Error handler returns translated error messages based on request language
- API root endpoint `/` returns detected language and English description
- Health check endpoint `/health` returns detected language

### Fixed

- Improved Indonesian phrasing for bridge suggestions ("di antara" instead of "menjembatani")
- Bridge suggestions now exclude weekends and skip holidays with no work days between them
- Translated "Maulid Nabi Muhammad S.A.W." to "Birth of Prophet Muhammad S.A.W." in English

## v1.0.0 (2026-03-01)

### Added

- Indonesian national holidays API with 2026 holiday data
- Holiday endpoints: `/v1/holidays`, `/v1/holidays/next`, `/v1/holidays/current`, `/v1/holidays/suggestions`
- Holiday filtering by year, month, and joint holiday status
- Next holiday countdown with `days_until` and `is_today` flags
- Intelligent leave day suggestions to maximize long weekends
- Holiday data with national holidays, religious observances, and "Cuti Bersama" (joint holidays)
- Rate limiting middleware (100 requests per 15 minutes per IP)
- Security headers using Helmet.js
- CORS support for cross-origin requests
- Request logging middleware with method, URL, status, and duration
- Centralized error handler with development stack traces
- 404 not found handler
- Health check endpoint `/health` with formatted uptime display
- API info endpoint `/` with available endpoints documentation
- Swagger UI interactive documentation at `/docs`
- OpenAPI 3.0 specification with JSDoc annotations
- CDN-based Swagger UI (no static files required)
- Swagger spec JSON endpoint at `/docs/swagger.json`
- ESLint configuration with auto-fix on pre-commit hooks
- Husky git hooks for pre-commit code quality checks
- lint-staged for running ESLint on staged files only
- Nodemon for hot-reloading development server
- Environment configuration with `.env` support
- Graceful server shutdown handling SIGTERM and SIGINT
- Vercel deployment configuration for serverless
- MIT license

### Changed

- Replaced swagger-ui-express with custom CDN-based implementation for Vercel compatibility

---

## v0.1.0 (2026-02-28)

### Added

- Initial project setup with Express.js
- Holiday service with filtering and date lookup functions
- Date helper utilities (format, parse, daysBetween, isWeekend, getDayNameIndonesian)
- Data parser utility for loading holidays from JSON
- Intelligent leave day suggestion service with efficiency metrics
- Holiday controller with API endpoints
- Suggestion service for leave day recommendations
- Indonesian holidays data for 2026
- Centralized config module for environment variables
- Express app setup with middleware
- Server entry point

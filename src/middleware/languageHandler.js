const SUPPORTED_LANGUAGES = ['en', 'id'];
const DEFAULT_LANGUAGE = 'id';

const languageHandler = (req, res, next) => {
    let language = DEFAULT_LANGUAGE;

    if (req.query.lang) {
        const queryLang = req.query.lang.toLowerCase();
        if (SUPPORTED_LANGUAGES.includes(queryLang)) {
            language = queryLang;
        }
    } else if (req.headers['accept-language']) {
        const acceptLanguage = req.headers['accept-language'].toLowerCase();
        if (acceptLanguage.includes('en')) {
            language = 'en';
        }
    }

    req.language = language;
    res.locals.language = language;

    next();
}

module.exports = languageHandler;

const translations = require('../config/translations');

const translate = (category, key, lang = 'id', params = {}) => {
    const language = lang || 'id';
    const categoryDict = translations[category]

    if (!categoryDict) {
        console.warn(`Translation category "${category}" not found`);
        return key;
    }

    const translation = categoryDict[key]

    if (!translation) {
        console.warn(`Translation key "${key}" not found in category "${category}"`);
        return key;
    }

    const text = translation[language] || translation['id'] || Object.values(translation)[0];

    if (params && Object.keys(params).length > 0) {
        return interpolate(text, params)
    }

    return text;
}

const interpolate = (template, params) => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? params[key] : match;
  });
}

const tError = (key, lang = 'id') => {
  return translate('errors', key, lang);
}

const tMessage = (key, lang = 'id') => {
  return translate('messages', key, lang);
}

const tSuggestion = (key, lang = 'id', params = {}) => {
  return translate('suggestions', key, lang, params);
}

module.exports = {
  translate,
  interpolate,
  tError,
  tMessage,
  tSuggestion
};

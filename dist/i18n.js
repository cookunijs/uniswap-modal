"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const react_i18next_1 = require("react-i18next");
const i18next_xhr_backend_1 = __importDefault(require("i18next-xhr-backend"));
const i18next_browser_languagedetector_1 = __importDefault(require("i18next-browser-languagedetector"));
i18next_1.default
    .use(i18next_xhr_backend_1.default)
    .use(i18next_browser_languagedetector_1.default)
    .use(react_i18next_1.initReactI18next)
    .init({
    backend: {
        loadPath: `./locales/{{lng}}.json`
    },
    react: {
        useSuspense: true
    },
    fallbackLng: 'en',
    preload: ['en'],
    keySeparator: false,
    interpolation: { escapeValue: false }
});
exports.default = i18next_1.default;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_confetti_1 = __importDefault(require("react-confetti"));
const useWindowSize_1 = require("../../hooks/useWindowSize");
// eslint-disable-next-line react/prop-types
function Confetti({ start, variant }) {
    const { width, height } = useWindowSize_1.useWindowSize();
    const _variant = variant ? variant : height && width && height > 1.5 * width ? 'bottom' : variant;
    return start && width && height ? (react_1.default.createElement(react_confetti_1.default, { style: { zIndex: 1401 }, numberOfPieces: 400, recycle: false, run: true, width: width, height: height, confettiSource: {
            h: height,
            w: width,
            x: 0,
            y: _variant === 'top' ? height * 0.25 : _variant === 'bottom' ? height * 0.75 : height * 0.5
        }, initialVelocityX: 15, initialVelocityY: 30, gravity: 0.45, tweenDuration: 100, wind: 0.05 })) : null;
}
exports.default = Confetti;

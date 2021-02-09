"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const react_spring_1 = require("react-spring");
const dialog_1 = require("@reach/dialog");
const react_device_detect_1 = require("react-device-detect");
require("@reach/dialog/styles.css");
const polished_1 = require("polished");
const react_use_gesture_1 = require("react-use-gesture");
const AnimatedDialogOverlay = react_spring_1.animated(dialog_1.DialogOverlay);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled_components_1.default(AnimatedDialogOverlay) `
  &[data-reach-dialog-overlay] {
    z-index: 2;
    background-color: transparent;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${({ theme }) => theme.modalBG};
  }
`;
const AnimatedDialogContent = react_spring_1.animated(dialog_1.DialogContent);
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled_components_1.default(({ minHeight, maxHeight, mobile, isOpen, ...rest }) => (react_1.default.createElement(AnimatedDialogContent, Object.assign({}, rest)))).attrs({
    'aria-label': 'dialog'
}) `
  overflow-y: ${({ mobile }) => (mobile ? 'scroll' : 'hidden')};

  &[data-reach-dialog-content] {
    margin: 0 0 2rem 0;
    background-color: ${({ theme }) => theme.bg1};
    box-shadow: 0 4px 8px 0 ${({ theme }) => polished_1.transparentize(0.95, theme.shadow1)};
    padding: 0px;
    width: 50vw;
    overflow-y: ${({ mobile }) => (mobile ? 'scroll' : 'hidden')};
    overflow-x: hidden;

    align-self: ${({ mobile }) => (mobile ? 'flex-end' : 'center')};

    max-width: 420px;
    ${({ maxHeight }) => maxHeight &&
    styled_components_1.css `
        max-height: ${maxHeight}vh;
      `}
    ${({ minHeight }) => minHeight &&
    styled_components_1.css `
        min-height: ${minHeight}vh;
      `}
    display: flex;
    border-radius: 20px;
    ${({ theme }) => theme.mediaWidth.upToMedium `
      width: 65vw;
      margin: 0;
    `}
    ${({ theme, mobile }) => theme.mediaWidth.upToSmall `
      width:  85vw;
      ${mobile &&
    styled_components_1.css `
          width: 100vw;
          border-radius: 20px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `}
    `}
  }
`;
function Modal({ isOpen, onDismiss, minHeight = false, maxHeight = 90, initialFocusRef, children }) {
    const fadeTransition = react_spring_1.useTransition(isOpen, null, {
        config: { duration: 200 },
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 }
    });
    const [{ y }, set] = react_spring_1.useSpring(() => ({ y: 0, config: { mass: 1, tension: 210, friction: 20 } }));
    const bind = react_use_gesture_1.useGesture({
        onDrag: state => {
            set({
                y: state.down ? state.movement[1] : 0
            });
            if (state.movement[1] > 300 || (state.velocity > 3 && state.direction[1] > 0)) {
                onDismiss();
            }
        }
    });
    return (react_1.default.createElement(react_1.default.Fragment, null, fadeTransition.map(({ item, key, props }) => item && (react_1.default.createElement(StyledDialogOverlay, { key: key, style: props, onDismiss: onDismiss, initialFocusRef: initialFocusRef },
        react_1.default.createElement(StyledDialogContent, Object.assign({}, (react_device_detect_1.isMobile
            ? Object.assign(Object.assign({}, bind()), { style: { transform: y.interpolate(y => `translateY(${y > 0 ? y : 0}px)`) } }) : {}), { "aria-label": "dialog content", minHeight: minHeight, maxHeight: maxHeight, mobile: react_device_detect_1.isMobile }),
            !initialFocusRef && react_device_detect_1.isMobile ? react_1.default.createElement("div", { tabIndex: 1 }) : null,
            children))))));
}
exports.default = Modal;

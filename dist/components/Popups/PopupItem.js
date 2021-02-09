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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Popup = exports.StyledClose = void 0;
const react_1 = __importStar(require("react"));
const react_feather_1 = require("react-feather");
const web_1 = require("react-spring/web");
const styled_components_1 = __importStar(require("styled-components"));
const react_spring_1 = require("react-spring");
const hooks_1 = require("../../state/application/hooks");
const ListUpdatePopup_1 = __importDefault(require("./ListUpdatePopup"));
const TransactionPopup_1 = __importDefault(require("./TransactionPopup"));
exports.StyledClose = styled_components_1.default(react_feather_1.X) `
  position: absolute;
  right: 10px;
  top: 10px;

  :hover {
    cursor: pointer;
  }
`;
exports.Popup = styled_components_1.default.div `
  display: inline-block;
  width: 100%;
  padding: 1em;
  background-color: ${({ theme }) => theme.bg1};
  position: relative;
  border-radius: 10px;
  padding: 20px;
  padding-right: 35px;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToSmall `
    min-width: 290px;
    &:not(:last-of-type) {
      margin-right: 20px;
    }
  `}
`;
const Fader = styled_components_1.default.div `
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.bg3};
`;
const AnimatedFader = react_spring_1.animated(Fader);
function PopupItem({ removeAfterMs, content, popKey }) {
    const removePopup = hooks_1.useRemovePopup();
    const removeThisPopup = react_1.useCallback(() => removePopup(popKey), [popKey, removePopup]);
    react_1.useEffect(() => {
        if (removeAfterMs === null)
            return undefined;
        const timeout = setTimeout(() => {
            removeThisPopup();
        }, removeAfterMs);
        return () => {
            clearTimeout(timeout);
        };
    }, [removeAfterMs, removeThisPopup]);
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    let popupContent;
    if ('txn' in content) {
        const { txn: { hash, success, summary } } = content;
        popupContent = react_1.default.createElement(TransactionPopup_1.default, { hash: hash, success: success, summary: summary });
    }
    else if ('listUpdate' in content) {
        const { listUpdate: { listUrl, oldList, newList, auto } } = content;
        popupContent = react_1.default.createElement(ListUpdatePopup_1.default, { popKey: popKey, listUrl: listUrl, oldList: oldList, newList: newList, auto: auto });
    }
    const faderStyle = web_1.useSpring({
        from: { width: '100%' },
        to: { width: '0%' },
        config: { duration: removeAfterMs !== null && removeAfterMs !== void 0 ? removeAfterMs : undefined }
    });
    return (react_1.default.createElement(exports.Popup, null,
        react_1.default.createElement(exports.StyledClose, { color: theme.text2, onClick: removeThisPopup }),
        popupContent,
        removeAfterMs !== null ? react_1.default.createElement(AnimatedFader, { style: faderStyle }) : null));
}
exports.default = PopupItem;

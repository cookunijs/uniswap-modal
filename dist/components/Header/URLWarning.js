"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyledClose = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_feather_1 = require("react-feather");
const hooks_1 = require("../../state/user/hooks");
const react_device_detect_1 = require("react-device-detect");
const PhishAlert = styled_components_1.default.div `
  width: 100%;
  padding: 6px 6px;
  background-color: ${({ theme }) => theme.blue1};
  color: white;
  font-size: 11px;
  justify-content: space-between;
  align-items: center;
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
`;
exports.StyledClose = styled_components_1.default(react_feather_1.X) `
  :hover {
    cursor: pointer;
  }
`;
function URLWarning() {
    const toggleURLWarning = hooks_1.useURLWarningToggle();
    const showURLWarning = hooks_1.useURLWarningVisible();
    return react_device_detect_1.isMobile ? (react_1.default.createElement(PhishAlert, { isActive: showURLWarning },
        react_1.default.createElement("div", { style: { display: 'flex' } },
            react_1.default.createElement(react_feather_1.AlertTriangle, { style: { marginRight: 6 }, size: 12 }),
            " Make sure the URL is",
            react_1.default.createElement("code", { style: { padding: '0 4px', display: 'inline', fontWeight: 'bold' } }, "app.uniswap.org")),
        react_1.default.createElement(exports.StyledClose, { size: 12, onClick: toggleURLWarning }))) : window.location.hostname === 'app.uniswap.org' ? (react_1.default.createElement(PhishAlert, { isActive: showURLWarning },
        react_1.default.createElement("div", { style: { display: 'flex' } },
            react_1.default.createElement(react_feather_1.AlertTriangle, { style: { marginRight: 6 }, size: 12 }),
            " Always make sure the URL is",
            react_1.default.createElement("code", { style: { padding: '0 4px', display: 'inline', fontWeight: 'bold' } }, "app.uniswap.org"),
            " - bookmark it to be safe."),
        react_1.default.createElement(exports.StyledClose, { size: 12, onClick: toggleURLWarning }))) : null;
}
exports.default = URLWarning;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = require("styled-components");
const react_1 = require("react");
function useTheme() {
    return react_1.useContext(styled_components_1.ThemeContext);
}
exports.default = useTheme;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useToggle(initialState = false) {
    const [state, setState] = react_1.useState(initialState);
    const toggle = react_1.useCallback(() => setState(state => !state), []);
    return [state, toggle];
}
exports.default = useToggle;

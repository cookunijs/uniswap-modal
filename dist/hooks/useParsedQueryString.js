"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = require("qs");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
function useParsedQueryString() {
    const { search } = react_router_dom_1.useLocation();
    return react_1.useMemo(() => (search && search.length > 1 ? qs_1.parse(search, { parseArrays: false, ignoreQueryPrefix: true }) : {}), [search]);
}
exports.default = useParsedQueryString;

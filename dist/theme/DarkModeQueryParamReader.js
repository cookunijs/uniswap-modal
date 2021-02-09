"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const qs_1 = require("qs");
const actions_1 = require("../state/user/actions");
function DarkModeQueryParamReader({ location: { search } }) {
    const dispatch = react_redux_1.useDispatch();
    react_1.useEffect(() => {
        if (!search)
            return;
        if (search.length < 2)
            return;
        const parsed = qs_1.parse(search, {
            parseArrays: false,
            ignoreQueryPrefix: true
        });
        const theme = parsed.theme;
        if (typeof theme !== 'string')
            return;
        if (theme.toLowerCase() === 'light') {
            dispatch(actions_1.updateUserDarkMode({ userDarkMode: false }));
        }
        else if (theme.toLowerCase() === 'dark') {
            dispatch(actions_1.updateUserDarkMode({ userDarkMode: true }));
        }
    }, [dispatch, search]);
    return null;
}
exports.default = DarkModeQueryParamReader;

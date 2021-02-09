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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemedGlobalStyle = exports.FixedGlobalStyle = exports.TYPE = exports.theme = exports.colors = void 0;
const polished_1 = require("polished");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const hooks_1 = require("../state/user/hooks");
const rebass_1 = require("rebass");
__exportStar(require("./components"), exports);
const MEDIA_WIDTHS = {
    upToExtraSmall: 500,
    upToSmall: 720,
    upToMedium: 960,
    upToLarge: 1280
};
const mediaWidthTemplates = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
    ;
    accumulator[size] = (a, b, c) => styled_components_1.css `
      @media (max-width: ${MEDIA_WIDTHS[size]}px) {
        ${styled_components_1.css(a, b, c)}
      }
    `;
    return accumulator;
}, {});
const white = '#FFFFFF';
const black = '#000000';
function colors(darkMode) {
    return {
        // base
        white,
        black,
        // text
        text1: darkMode ? '#FFFFFF' : '#000000',
        text2: darkMode ? '#C3C5CB' : '#565A69',
        text3: darkMode ? '#6C7284' : '#888D9B',
        text4: darkMode ? '#565A69' : '#C3C5CB',
        text5: darkMode ? '#2C2F36' : '#EDEEF2',
        // backgrounds / greys
        bg1: darkMode ? '#212429' : '#FFFFFF',
        bg2: darkMode ? '#2C2F36' : '#F7F8FA',
        bg3: darkMode ? '#40444F' : '#EDEEF2',
        bg4: darkMode ? '#565A69' : '#CED0D9',
        bg5: darkMode ? '#6C7284' : '#888D9B',
        //specialty colors
        modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
        advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',
        //primary colors
        primary1: darkMode ? '#2172E5' : '#ff007a',
        primary2: darkMode ? '#3680E7' : '#FF8CC3',
        primary3: darkMode ? '#4D8FEA' : '#FF99C9',
        primary4: darkMode ? '#376bad70' : '#F6DDE8',
        primary5: darkMode ? '#153d6f70' : '#FDEAF1',
        // color text
        primaryText1: darkMode ? '#6da8ff' : '#ff007a',
        // secondary colors
        secondary1: darkMode ? '#2172E5' : '#ff007a',
        secondary2: darkMode ? '#17000b26' : '#F6DDE8',
        secondary3: darkMode ? '#17000b26' : '#FDEAF1',
        // other
        red1: '#FD4040',
        red2: '#F82D3A',
        red3: '#D60000',
        green1: '#27AE60',
        yellow1: '#FFE270',
        yellow2: '#F3841E',
        blue1: '#2172E5'
        // dont wanna forget these blue yet
        // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
        // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
    };
}
exports.colors = colors;
function theme(darkMode) {
    return Object.assign(Object.assign({}, colors(darkMode)), { grids: {
            sm: 8,
            md: 12,
            lg: 24
        }, 
        //shadows
        shadow1: darkMode ? '#000' : '#2F80ED', 
        // media queries
        mediaWidth: mediaWidthTemplates, 
        // css snippets
        flexColumnNoWrap: styled_components_1.css `
      display: flex;
      flex-flow: column nowrap;
    `, flexRowNoWrap: styled_components_1.css `
      display: flex;
      flex-flow: row nowrap;
    ` });
}
exports.theme = theme;
function ThemeProvider({ children }) {
    const darkMode = hooks_1.useIsDarkMode();
    const themeObject = react_1.useMemo(() => theme(darkMode), [darkMode]);
    return react_1.default.createElement(styled_components_1.ThemeProvider, { theme: themeObject }, children);
}
exports.default = ThemeProvider;
const TextWrapper = styled_components_1.default(rebass_1.Text) `
  color: ${({ color, theme }) => theme[color]};
`;
exports.TYPE = {
    main(props) {
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 500, color: 'text2' }, props));
    },
    link(props) {
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 500, color: 'primary1' }, props));
    },
    black(props) {
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 500, color: 'text1' }, props));
    },
    white(props) {
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 500, color: 'white' }, props));
    },
    body(props) {
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 400, fontSize: 16, color: 'text1' }, props));
    },
    largeHeader(props) {
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 600, fontSize: 24 }, props));
    },
    mediumHeader(props) {
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 500, fontSize: 20 }, props));
    },
    subHeader(props) {
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 400, fontSize: 14 }, props));
    },
    small(props) {
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 500, fontSize: 11 }, props));
    },
    blue(props) {
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 500, color: 'blue1' }, props));
    },
    yellow(props) {
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 500, color: 'yellow1' }, props));
    },
    darkGray(props) {
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 500, color: 'text3' }, props));
    },
    gray(props) {
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 500, color: 'bg3' }, props));
    },
    italic(props) {
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 500, fontSize: 12, fontStyle: 'italic', color: 'text2' }, props));
    },
    error(_a) {
        var { error } = _a, props = __rest(_a, ["error"]);
        return react_1.default.createElement(TextWrapper, Object.assign({ fontWeight: 500, color: error ? 'red1' : 'text2' }, props));
    }
};
exports.FixedGlobalStyle = styled_components_1.createGlobalStyle `
html, input, textarea, button {
  font-family: 'Inter', sans-serif;
  font-display: fallback;
}
@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'Inter var', sans-serif;
  }
}

html,
body {
  margin: 0;
  padding: 0;
}

 a {
   color: ${colors(false).blue1}; 
 }

* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
  
}
`;
exports.ThemedGlobalStyle = styled_components_1.createGlobalStyle `
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg2};
}

body {
  min-height: 100vh;
  background-position: 0 -30vh;
  background-repeat: no-repeat;
  background-image: ${({ theme }) => `radial-gradient(50% 50% at 50% 50%, ${polished_1.transparentize(0.9, theme.primary1)} 0%, ${polished_1.transparentize(1, theme.bg1)} 100%)`};
}
`;

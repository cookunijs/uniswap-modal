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
const polished_1 = require("polished");
const react_1 = __importStar(require("react"));
const react_popper_1 = require("react-popper");
const styled_components_1 = __importDefault(require("styled-components"));
const useInterval_1 = __importDefault(require("../../hooks/useInterval"));
const portal_1 = __importDefault(require("@reach/portal"));
const PopoverContainer = styled_components_1.default.div `
  z-index: 9999;

  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  opacity: ${props => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;

  background: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg3};
  box-shadow: 0 4px 8px 0 ${({ theme }) => polished_1.transparentize(0.9, theme.shadow1)};
  color: ${({ theme }) => theme.text2};
  border-radius: 8px;
`;
const ReferenceElement = styled_components_1.default.div `
  display: inline-block;
`;
const Arrow = styled_components_1.default.div `
  width: 8px;
  height: 8px;
  z-index: 9998;

  ::before {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: 9998;

    content: '';
    border: 1px solid ${({ theme }) => theme.bg3};
    transform: rotate(45deg);
    background: ${({ theme }) => theme.bg2};
  }

  &.arrow-top {
    bottom: -5px;
    ::before {
      border-top: none;
      border-left: none;
    }
  }

  &.arrow-bottom {
    top: -5px;
    ::before {
      border-bottom: none;
      border-right: none;
    }
  }

  &.arrow-left {
    right: -5px;

    ::before {
      border-bottom: none;
      border-left: none;
    }
  }

  &.arrow-right {
    left: -5px;
    ::before {
      border-right: none;
      border-top: none;
    }
  }
`;
function Popover({ content, show, children, placement = 'auto' }) {
    var _a, _b;
    const [referenceElement, setReferenceElement] = react_1.useState(null);
    const [popperElement, setPopperElement] = react_1.useState(null);
    const [arrowElement, setArrowElement] = react_1.useState(null);
    const { styles, update, attributes } = react_popper_1.usePopper(referenceElement, popperElement, {
        placement,
        strategy: 'fixed',
        modifiers: [
            { name: 'offset', options: { offset: [8, 8] } },
            { name: 'arrow', options: { element: arrowElement } }
        ]
    });
    const updateCallback = react_1.useCallback(() => {
        update && update();
    }, [update]);
    useInterval_1.default(updateCallback, show ? 100 : null);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ReferenceElement, { ref: setReferenceElement }, children),
        react_1.default.createElement(portal_1.default, null,
            react_1.default.createElement(PopoverContainer, Object.assign({ show: show, ref: setPopperElement, style: styles.popper }, attributes.popper),
                content,
                react_1.default.createElement(Arrow, Object.assign({ className: `arrow-${(_b = (_a = attributes.popper) === null || _a === void 0 ? void 0 : _a['data-popper-placement']) !== null && _b !== void 0 ? _b : ''}`, ref: setArrowElement, style: styles.arrow }, attributes.arrow))))));
}
exports.default = Popover;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const useHttpLocations_1 = __importDefault(require("../../hooks/useHttpLocations"));
const Logo_1 = __importDefault(require("../Logo"));
const StyledListLogo = styled_components_1.default(Logo_1.default) `
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;
function ListLogo({ logoURI, style, size = '24px', alt }) {
    const srcs = useHttpLocations_1.default(logoURI);
    return react_1.default.createElement(StyledListLogo, { alt: alt, size: size, srcs: srcs, style: style });
}
exports.default = ListLogo;

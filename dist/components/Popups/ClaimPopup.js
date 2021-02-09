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
const react_1 = __importStar(require("react"));
const react_feather_1 = require("react-feather");
const styled_components_1 = __importStar(require("styled-components"));
const token_logo_png_1 = __importDefault(require("../../assets/images/token-logo.png"));
const Button_1 = require("../../components/Button");
const hooks_1 = require("../../hooks");
const actions_1 = require("../../state/application/actions");
const hooks_2 = require("../../state/application/hooks");
const hooks_3 = require("../../state/claim/hooks");
const theme_1 = require("../../theme");
const Column_1 = require("../Column");
const styled_1 = require("../earn/styled");
const StyledClaimPopup = styled_components_1.default(Column_1.AutoColumn) `
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ff007a 0%, #021d43 100%);
  border-radius: 20px;
  padding: 1.5rem;
  overflow: hidden;
  position: relative;
  max-width: 360px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;
const StyledClose = styled_components_1.default(react_feather_1.X) `
  position: absolute;
  right: 10px;
  top: 10px;

  :hover {
    cursor: pointer;
  }
`;
const rotate = styled_components_1.keyframes `
  0% {
    transform: perspective(1000px) rotateY(0deg);
  }

  100% {
    transform: perspective(1000px) rotateY(360deg);
  }
`;
const UniToken = styled_components_1.default.img `
  animation: ${rotate} 5s cubic-bezier(0.83, 0, 0.17, 1) infinite;
`;
function ClaimPopup() {
    var _a;
    const { account } = hooks_1.useActiveWeb3React();
    // dont store these in persisted state yet
    const showClaimPopup = hooks_2.useShowClaimPopup();
    const toggleShowClaimPopup = hooks_2.useToggleShowClaimPopup();
    // toggle for showing this modal
    const showClaimModal = hooks_2.useModalOpen(actions_1.ApplicationModal.SELF_CLAIM);
    const toggleSelfClaimModal = hooks_2.useToggleSelfClaimModal();
    // const userHasAvailableclaim = useUserHasAvailableClaim()
    const userHasAvailableclaim = hooks_3.useUserHasAvailableClaim(account);
    const unclaimedAmount = hooks_3.useUserUnclaimedAmount(account);
    // listen for available claim and show popup if needed
    react_1.useEffect(() => {
        if (userHasAvailableclaim) {
            toggleShowClaimPopup();
        }
        // the toggleShowClaimPopup function changes every time the popup changes, so this will cause an infinite loop.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userHasAvailableclaim]);
    return (react_1.default.createElement(react_1.default.Fragment, null, showClaimPopup && !showClaimModal && (react_1.default.createElement(StyledClaimPopup, { gap: "md" },
        react_1.default.createElement(styled_1.CardBGImage, null),
        react_1.default.createElement(styled_1.CardNoise, null),
        react_1.default.createElement(StyledClose, { stroke: "white", onClick: toggleShowClaimPopup }),
        react_1.default.createElement(Column_1.AutoColumn, { style: { padding: '2rem 0', zIndex: 10 }, justify: "center" },
            react_1.default.createElement(UniToken, { width: "48px", src: token_logo_png_1.default }),
            ' ',
            react_1.default.createElement(theme_1.TYPE.white, { style: { marginTop: '1rem' }, fontSize: 36, fontWeight: 600 }, unclaimedAmount === null || unclaimedAmount === void 0 ? void 0 :
                unclaimedAmount.toFixed(0, (_a = { groupSeparator: ',' }) !== null && _a !== void 0 ? _a : '-'),
                " UNI"),
            react_1.default.createElement(theme_1.TYPE.white, { style: { paddingTop: '1.25rem', textAlign: 'center' }, fontWeight: 600, color: "white" },
                react_1.default.createElement("span", { role: "img", "aria-label": "party" }, "\uD83C\uDF89"),
                ' ',
                "UNI has arrived",
                ' ',
                react_1.default.createElement("span", { role: "img", "aria-label": "party" }, "\uD83C\uDF89")),
            react_1.default.createElement(theme_1.TYPE.subHeader, { style: { paddingTop: '0.5rem', textAlign: 'center' }, color: "white" }, `Thanks for being part of the Uniswap community <3`)),
        react_1.default.createElement(Column_1.AutoColumn, { style: { zIndex: 10 }, justify: "center" },
            react_1.default.createElement(Button_1.ButtonPrimary, { padding: "8px", borderRadius: "8px", width: 'fit-content', onClick: toggleSelfClaimModal }, "Claim your UNI tokens"))))));
}
exports.default = ClaimPopup;

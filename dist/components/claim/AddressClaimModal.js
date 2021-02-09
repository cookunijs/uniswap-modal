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
const Modal_1 = __importDefault(require("../Modal"));
const Column_1 = require("../Column");
const styled_components_1 = __importDefault(require("styled-components"));
const styled_1 = require("../earn/styled");
const Row_1 = require("../Row");
const theme_1 = require("../../theme");
const Button_1 = require("../Button");
const hooks_1 = require("../../state/claim/hooks");
const token_logo_png_1 = __importDefault(require("../../assets/images/token-logo.png"));
const blue_loader_svg_1 = __importDefault(require("../../assets/images/blue-loader.svg"));
const rebass_1 = require("rebass");
const AddressInputPanel_1 = __importDefault(require("../AddressInputPanel"));
const useENS_1 = __importDefault(require("../../hooks/useENS"));
const hooks_2 = require("../../hooks");
const utils_1 = require("ethers/lib/utils");
const Confetti_1 = __importDefault(require("../Confetti"));
const styled_2 = require("../earn/styled");
const hooks_3 = require("../../state/transactions/hooks");
const utils_2 = require("../../utils");
const ContentWrapper = styled_components_1.default(Column_1.AutoColumn) `
  width: 100%;
`;
const ModalUpper = styled_components_1.default(styled_1.DataCard) `
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ff007a 0%, #021d43 100%);
`;
const ConfirmOrLoadingWrapper = styled_components_1.default.div `
  width: 100%;
  padding: 24px;
  position: relative;
  background: ${({ activeBG }) => activeBG &&
    'radial-gradient(76.02% 75.41% at 1.84% 0%, rgba(255, 0, 122, 0.2) 0%, rgba(33, 114, 229, 0.2) 100%), #FFFFFF;'};
`;
const ConfirmedIcon = styled_components_1.default(Column_1.ColumnCenter) `
  padding: 60px 0;
`;
function AddressClaimModal({ isOpen, onDismiss }) {
    var _a, _b;
    const { chainId } = hooks_2.useActiveWeb3React();
    // state for smart contract input
    const [typed, setTyped] = react_1.useState('');
    function handleRecipientType(val) {
        setTyped(val);
    }
    // monitor for third party recipient of claim
    const { address: parsedAddress } = useENS_1.default(typed);
    // used for UI loading states
    const [attempting, setAttempting] = react_1.useState(false);
    // monitor the status of the claim from contracts and txns
    const { claimCallback } = hooks_1.useClaimCallback(parsedAddress);
    const unclaimedAmount = hooks_1.useUserUnclaimedAmount(parsedAddress);
    // check if the user has something available
    const hasAvailableClaim = hooks_1.useUserHasAvailableClaim(parsedAddress);
    const [hash, setHash] = react_1.useState();
    // monitor the status of the claim from contracts and txns
    const claimPending = hooks_3.useIsTransactionPending(hash !== null && hash !== void 0 ? hash : '');
    const claimConfirmed = hash && !claimPending;
    // use the hash to monitor this txn
    function onClaim() {
        setAttempting(true);
        claimCallback()
            .then(hash => {
            setHash(hash);
        })
            // reset modal and log error
            .catch(error => {
            setAttempting(false);
            console.log(error);
        });
    }
    function wrappedOnDismiss() {
        setAttempting(false);
        setHash(undefined);
        setTyped('');
        onDismiss();
    }
    return (react_1.default.createElement(Modal_1.default, { isOpen: isOpen, onDismiss: wrappedOnDismiss, maxHeight: 90 },
        react_1.default.createElement(Confetti_1.default, { start: Boolean(isOpen && claimConfirmed && attempting) }),
        !attempting && (react_1.default.createElement(ContentWrapper, { gap: "lg" },
            react_1.default.createElement(ModalUpper, null,
                react_1.default.createElement(styled_2.CardBGImage, null),
                react_1.default.createElement(styled_2.CardNoise, null),
                react_1.default.createElement(styled_1.CardSection, { gap: "md" },
                    react_1.default.createElement(Row_1.RowBetween, null,
                        react_1.default.createElement(theme_1.TYPE.white, { fontWeight: 500 }, "Claim UNI Token"),
                        react_1.default.createElement(theme_1.CloseIcon, { onClick: wrappedOnDismiss, style: { zIndex: 99 }, stroke: "white" })),
                    react_1.default.createElement(theme_1.TYPE.white, { fontWeight: 700, fontSize: 36 }, unclaimedAmount === null || unclaimedAmount === void 0 ? void 0 :
                        unclaimedAmount.toFixed(0, (_a = { groupSeparator: ',' }) !== null && _a !== void 0 ? _a : '-'),
                        " UNI")),
                react_1.default.createElement(styled_1.Break, null)),
            react_1.default.createElement(Column_1.AutoColumn, { gap: "md", style: { padding: '1rem', paddingTop: '0' }, justify: "center" },
                react_1.default.createElement(theme_1.TYPE.subHeader, { fontWeight: 500 }, "Enter an address to trigger a UNI claim. If the address has any claimable UNI it will be sent to them on submission."),
                react_1.default.createElement(AddressInputPanel_1.default, { value: typed, onChange: handleRecipientType }),
                parsedAddress && !hasAvailableClaim && (react_1.default.createElement(theme_1.TYPE.error, { error: true }, "Address has no available claim")),
                react_1.default.createElement(Button_1.ButtonPrimary, { disabled: !utils_1.isAddress(parsedAddress !== null && parsedAddress !== void 0 ? parsedAddress : '') || !hasAvailableClaim, padding: "16px 16px", width: "100%", borderRadius: "12px", mt: "1rem", onClick: onClaim }, "Claim UNI")))),
        (attempting || claimConfirmed) && (react_1.default.createElement(ConfirmOrLoadingWrapper, { activeBG: true },
            react_1.default.createElement(styled_2.CardNoise, null),
            react_1.default.createElement(styled_2.CardBGImageSmaller, { desaturate: true }),
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement("div", null),
                react_1.default.createElement(theme_1.CloseIcon, { onClick: wrappedOnDismiss, style: { zIndex: 99 }, stroke: "black" })),
            react_1.default.createElement(ConfirmedIcon, null, !claimConfirmed ? (react_1.default.createElement(theme_1.CustomLightSpinner, { src: blue_loader_svg_1.default, alt: "loader", size: '90px' })) : (react_1.default.createElement(theme_1.UniTokenAnimated, { width: "72px", src: token_logo_png_1.default }))),
            react_1.default.createElement(Column_1.AutoColumn, { gap: "100px", justify: 'center' },
                react_1.default.createElement(Column_1.AutoColumn, { gap: "12px", justify: 'center' },
                    react_1.default.createElement(theme_1.TYPE.largeHeader, { fontWeight: 600, color: "black" }, claimConfirmed ? 'Claimed' : 'Claiming'),
                    !claimConfirmed && (react_1.default.createElement(rebass_1.Text, { fontSize: 36, color: '#ff007a', fontWeight: 800 }, unclaimedAmount === null || unclaimedAmount === void 0 ? void 0 :
                        unclaimedAmount.toFixed(0, (_b = { groupSeparator: ',' }) !== null && _b !== void 0 ? _b : '-'),
                        " UNI")),
                    parsedAddress && (react_1.default.createElement(theme_1.TYPE.largeHeader, { fontWeight: 600, color: "black" },
                        "for ",
                        utils_2.shortenAddress(parsedAddress)))),
                claimConfirmed && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(theme_1.TYPE.subHeader, { fontWeight: 500, color: "black" },
                        react_1.default.createElement("span", { role: "img", "aria-label": "party-hat" },
                            "\uD83C\uDF89",
                            ' '),
                        "Welcome to team Unicorn :)",
                        ' ',
                        react_1.default.createElement("span", { role: "img", "aria-label": "party-hat" }, "\uD83C\uDF89")))),
                attempting && !hash && (react_1.default.createElement(theme_1.TYPE.subHeader, { color: "black" }, "Confirm this transaction in your wallet")),
                attempting && hash && !claimConfirmed && chainId && hash && (react_1.default.createElement(theme_1.ExternalLink, { href: utils_2.getEtherscanLink(chainId, hash, 'transaction'), style: { zIndex: 99 } }, "View transaction on Etherscan")))))));
}
exports.default = AddressClaimModal;

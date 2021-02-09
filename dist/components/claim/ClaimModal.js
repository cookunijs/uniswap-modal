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
const sdk_1 = require("@uniswap/sdk");
const utils_1 = require("ethers/lib/utils");
const react_1 = __importStar(require("react"));
const rebass_1 = require("rebass");
const styled_components_1 = __importDefault(require("styled-components"));
const blue_loader_svg_1 = __importDefault(require("../../assets/images/blue-loader.svg"));
const token_logo_png_1 = __importDefault(require("../../assets/images/token-logo.png"));
const hooks_1 = require("../../hooks");
const actions_1 = require("../../state/application/actions");
const hooks_2 = require("../../state/application/hooks");
const hooks_3 = require("../../state/claim/hooks");
const hooks_4 = require("../../state/transactions/hooks");
const theme_1 = require("../../theme");
const utils_2 = require("../../utils");
const Button_1 = require("../Button");
const Column_1 = require("../Column");
const Confetti_1 = __importDefault(require("../Confetti"));
const styled_1 = require("../earn/styled");
const Modal_1 = __importDefault(require("../Modal"));
const Row_1 = require("../Row");
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
const SOCKS_AMOUNT = 1000;
const USER_AMOUNT = 400;
function ClaimModal() {
    var _a, _b, _c, _d, _e, _f, _g;
    const isOpen = hooks_2.useModalOpen(actions_1.ApplicationModal.SELF_CLAIM);
    const toggleClaimModal = hooks_2.useToggleSelfClaimModal();
    const { account, chainId } = hooks_1.useActiveWeb3React();
    // used for UI loading states
    const [attempting, setAttempting] = react_1.useState(false);
    // get user claim data
    const userClaimData = hooks_3.useUserClaimData(account);
    // monitor the status of the claim from contracts and txns
    const { claimCallback } = hooks_3.useClaimCallback(account);
    const unclaimedAmount = hooks_3.useUserUnclaimedAmount(account);
    const { claimSubmitted, claimTxn } = hooks_4.useUserHasSubmittedClaim(account !== null && account !== void 0 ? account : undefined);
    const claimConfirmed = Boolean(claimTxn === null || claimTxn === void 0 ? void 0 : claimTxn.receipt);
    function onClaim() {
        setAttempting(true);
        claimCallback()
            // reset modal and log error
            .catch(error => {
            setAttempting(false);
            console.log(error);
        });
    }
    // once confirmed txn is found, if modal is closed open, mark as not attempting regradless
    react_1.useEffect(() => {
        if (claimConfirmed && claimSubmitted && attempting) {
            setAttempting(false);
            if (!isOpen) {
                toggleClaimModal();
            }
        }
    }, [attempting, claimConfirmed, claimSubmitted, isOpen, toggleClaimModal]);
    const nonLPAmount = sdk_1.JSBI.multiply(sdk_1.JSBI.BigInt((((_a = userClaimData === null || userClaimData === void 0 ? void 0 : userClaimData.flags) === null || _a === void 0 ? void 0 : _a.isSOCKS) ? SOCKS_AMOUNT : 0) + (((_b = userClaimData === null || userClaimData === void 0 ? void 0 : userClaimData.flags) === null || _b === void 0 ? void 0 : _b.isUser) ? USER_AMOUNT : 0)), sdk_1.JSBI.exponentiate(sdk_1.JSBI.BigInt(10), sdk_1.JSBI.BigInt(18)));
    return (react_1.default.createElement(Modal_1.default, { isOpen: isOpen, onDismiss: toggleClaimModal, maxHeight: 90 },
        react_1.default.createElement(Confetti_1.default, { start: Boolean(isOpen && claimConfirmed) }),
        !attempting && !claimConfirmed && (react_1.default.createElement(ContentWrapper, { gap: "lg" },
            react_1.default.createElement(ModalUpper, null,
                react_1.default.createElement(styled_1.CardBGImage, null),
                react_1.default.createElement(styled_1.CardNoise, null),
                react_1.default.createElement(styled_1.CardSection, { gap: "md" },
                    react_1.default.createElement(Row_1.RowBetween, null,
                        react_1.default.createElement(theme_1.TYPE.white, { fontWeight: 500 }, "Claim UNI"),
                        react_1.default.createElement(theme_1.CloseIcon, { onClick: toggleClaimModal, style: { zIndex: 99 }, color: "white" })),
                    react_1.default.createElement(theme_1.TYPE.white, { fontWeight: 700, fontSize: 36 }, unclaimedAmount === null || unclaimedAmount === void 0 ? void 0 :
                        unclaimedAmount.toFixed(0, (_c = { groupSeparator: ',' }) !== null && _c !== void 0 ? _c : '-'),
                        " UNI")),
                react_1.default.createElement(styled_1.Break, null),
                react_1.default.createElement(styled_1.CardSection, { gap: "sm" },
                    ((_d = userClaimData === null || userClaimData === void 0 ? void 0 : userClaimData.flags) === null || _d === void 0 ? void 0 : _d.isSOCKS) && (react_1.default.createElement(Row_1.RowBetween, null,
                        react_1.default.createElement(theme_1.TYPE.subHeader, { color: "white" }, "SOCKS"),
                        react_1.default.createElement(theme_1.TYPE.subHeader, { color: "white" },
                            SOCKS_AMOUNT,
                            " UNI"))),
                    ((_e = userClaimData === null || userClaimData === void 0 ? void 0 : userClaimData.flags) === null || _e === void 0 ? void 0 : _e.isLP) &&
                        unclaimedAmount &&
                        sdk_1.JSBI.greaterThanOrEqual(unclaimedAmount.raw, nonLPAmount) && (react_1.default.createElement(Row_1.RowBetween, null,
                        react_1.default.createElement(theme_1.TYPE.subHeader, { color: "white" }, "Liquidity"),
                        react_1.default.createElement(theme_1.TYPE.subHeader, { color: "white" },
                            unclaimedAmount
                                .subtract(new sdk_1.TokenAmount(unclaimedAmount.token, nonLPAmount))
                                .toFixed(0, { groupSeparator: ',' }),
                            ' ',
                            "UNI"))),
                    ((_f = userClaimData === null || userClaimData === void 0 ? void 0 : userClaimData.flags) === null || _f === void 0 ? void 0 : _f.isUser) && (react_1.default.createElement(Row_1.RowBetween, null,
                        react_1.default.createElement(theme_1.TYPE.subHeader, { color: "white" }, "User"),
                        react_1.default.createElement(theme_1.TYPE.subHeader, { color: "white" },
                            USER_AMOUNT,
                            " UNI"))))),
            react_1.default.createElement(Column_1.AutoColumn, { gap: "md", style: { padding: '1rem', paddingTop: '0' }, justify: "center" },
                react_1.default.createElement(theme_1.TYPE.subHeader, { fontWeight: 500 },
                    "As a member of the Uniswap community you may claim UNI to be used for voting and governance. ",
                    react_1.default.createElement("br", null),
                    " ",
                    react_1.default.createElement("br", null),
                    react_1.default.createElement(theme_1.ExternalLink, { href: "https://uniswap.org/blog/uni" }, "Read more about UNI")),
                react_1.default.createElement(Button_1.ButtonPrimary, { disabled: !utils_1.isAddress(account !== null && account !== void 0 ? account : ''), padding: "16px 16px", width: "100%", borderRadius: "12px", mt: "1rem", onClick: onClaim }, "Claim UNI")))),
        (attempting || claimConfirmed) && (react_1.default.createElement(ConfirmOrLoadingWrapper, { activeBG: true },
            react_1.default.createElement(styled_1.CardNoise, null),
            react_1.default.createElement(styled_1.CardBGImageSmaller, { desaturate: true }),
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement("div", null),
                react_1.default.createElement(theme_1.CloseIcon, { onClick: toggleClaimModal, style: { zIndex: 99 }, stroke: "black" })),
            react_1.default.createElement(ConfirmedIcon, null, !claimConfirmed ? (react_1.default.createElement(theme_1.CustomLightSpinner, { src: blue_loader_svg_1.default, alt: "loader", size: '90px' })) : (react_1.default.createElement(theme_1.UniTokenAnimated, { width: "72px", src: token_logo_png_1.default }))),
            react_1.default.createElement(Column_1.AutoColumn, { gap: "100px", justify: 'center' },
                react_1.default.createElement(Column_1.AutoColumn, { gap: "12px", justify: 'center' },
                    react_1.default.createElement(theme_1.TYPE.largeHeader, { fontWeight: 600, color: "black" }, claimConfirmed ? 'Claimed!' : 'Claiming'),
                    !claimConfirmed && (react_1.default.createElement(rebass_1.Text, { fontSize: 36, color: '#ff007a', fontWeight: 800 }, unclaimedAmount === null || unclaimedAmount === void 0 ? void 0 :
                        unclaimedAmount.toFixed(0, (_g = { groupSeparator: ',' }) !== null && _g !== void 0 ? _g : '-'),
                        " UNI"))),
                claimConfirmed && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(theme_1.TYPE.subHeader, { fontWeight: 500, color: "black" },
                        react_1.default.createElement("span", { role: "img", "aria-label": "party-hat" },
                            "\uD83C\uDF89",
                            ' '),
                        "Welcome to team Unicorn :)",
                        ' ',
                        react_1.default.createElement("span", { role: "img", "aria-label": "party-hat" }, "\uD83C\uDF89")))),
                attempting && !claimSubmitted && (react_1.default.createElement(theme_1.TYPE.subHeader, { color: "black" }, "Confirm this transaction in your wallet")),
                attempting && claimSubmitted && !claimConfirmed && chainId && (claimTxn === null || claimTxn === void 0 ? void 0 : claimTxn.hash) && (react_1.default.createElement(theme_1.ExternalLink, { href: utils_2.getEtherscanLink(chainId, claimTxn === null || claimTxn === void 0 ? void 0 : claimTxn.hash, 'transaction'), style: { zIndex: 99 } }, "View transaction on Etherscan")))))));
}
exports.default = ClaimModal;

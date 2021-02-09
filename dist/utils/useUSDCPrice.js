"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@uniswap/sdk");
const react_1 = require("react");
const constants_1 = require("../constants");
const Reserves_1 = require("../data/Reserves");
const hooks_1 = require("../hooks");
const wrappedCurrency_1 = require("./wrappedCurrency");
/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
function useUSDCPrice(currency) {
    const { chainId } = hooks_1.useActiveWeb3React();
    const wrapped = wrappedCurrency_1.wrappedCurrency(currency, chainId);
    const tokenPairs = react_1.useMemo(() => [
        [
            chainId && wrapped && sdk_1.currencyEquals(sdk_1.WETH[chainId], wrapped) ? undefined : currency,
            chainId ? sdk_1.WETH[chainId] : undefined
        ],
        [(wrapped === null || wrapped === void 0 ? void 0 : wrapped.equals(constants_1.USDC)) ? undefined : wrapped, chainId === sdk_1.ChainId.MAINNET ? constants_1.USDC : undefined],
        [chainId ? sdk_1.WETH[chainId] : undefined, chainId === sdk_1.ChainId.MAINNET ? constants_1.USDC : undefined]
    ], [chainId, currency, wrapped]);
    const [[ethPairState, ethPair], [usdcPairState, usdcPair], [usdcEthPairState, usdcEthPair]] = Reserves_1.usePairs(tokenPairs);
    return react_1.useMemo(() => {
        if (!currency || !wrapped || !chainId) {
            return undefined;
        }
        // handle weth/eth
        if (wrapped.equals(sdk_1.WETH[chainId])) {
            if (usdcPair) {
                const price = usdcPair.priceOf(sdk_1.WETH[chainId]);
                return new sdk_1.Price(currency, constants_1.USDC, price.denominator, price.numerator);
            }
            else {
                return undefined;
            }
        }
        // handle usdc
        if (wrapped.equals(constants_1.USDC)) {
            return new sdk_1.Price(constants_1.USDC, constants_1.USDC, '1', '1');
        }
        const ethPairETHAmount = ethPair === null || ethPair === void 0 ? void 0 : ethPair.reserveOf(sdk_1.WETH[chainId]);
        const ethPairETHUSDCValue = ethPairETHAmount && usdcEthPair ? usdcEthPair.priceOf(sdk_1.WETH[chainId]).quote(ethPairETHAmount).raw : sdk_1.JSBI.BigInt(0);
        // all other tokens
        // first try the usdc pair
        if (usdcPairState === Reserves_1.PairState.EXISTS && usdcPair && usdcPair.reserveOf(constants_1.USDC).greaterThan(ethPairETHUSDCValue)) {
            const price = usdcPair.priceOf(wrapped);
            return new sdk_1.Price(currency, constants_1.USDC, price.denominator, price.numerator);
        }
        if (ethPairState === Reserves_1.PairState.EXISTS && ethPair && usdcEthPairState === Reserves_1.PairState.EXISTS && usdcEthPair) {
            if (usdcEthPair.reserveOf(constants_1.USDC).greaterThan('0') && ethPair.reserveOf(sdk_1.WETH[chainId]).greaterThan('0')) {
                const ethUsdcPrice = usdcEthPair.priceOf(constants_1.USDC);
                const currencyEthPrice = ethPair.priceOf(sdk_1.WETH[chainId]);
                const usdcPrice = ethUsdcPrice.multiply(currencyEthPrice).invert();
                return new sdk_1.Price(currency, constants_1.USDC, usdcPrice.denominator, usdcPrice.numerator);
            }
        }
        return undefined;
    }, [chainId, currency, ethPair, ethPairState, usdcEthPair, usdcEthPairState, usdcPair, usdcPairState, wrapped]);
}
exports.default = useUSDCPrice;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@uniswap/sdk");
const ethers_1 = require("ethers");
const constants_1 = require("../constants");
const computeUniCirculation_1 = require("./computeUniCirculation");
describe('computeUniCirculation', () => {
    const token = new sdk_1.Token(sdk_1.ChainId.RINKEBY, constants_1.ZERO_ADDRESS, 18);
    function expandTo18Decimals(num) {
        return sdk_1.JSBI.multiply(sdk_1.JSBI.BigInt(num), sdk_1.JSBI.exponentiate(sdk_1.JSBI.BigInt(10), sdk_1.JSBI.BigInt(18)));
    }
    function tokenAmount(num) {
        return new sdk_1.TokenAmount(token, expandTo18Decimals(num));
    }
    it('before staking', () => {
        expect(computeUniCirculation_1.computeUniCirculation(token, ethers_1.BigNumber.from(0), undefined)).toEqual(tokenAmount(150000000));
        expect(computeUniCirculation_1.computeUniCirculation(token, ethers_1.BigNumber.from(1600387200), undefined)).toEqual(tokenAmount(150000000));
    });
    it('mid staking', () => {
        expect(computeUniCirculation_1.computeUniCirculation(token, ethers_1.BigNumber.from(1600387200 + 15 * 24 * 60 * 60), undefined)).toEqual(tokenAmount(155000000));
    });
    it('after staking and treasury vesting cliff', () => {
        expect(computeUniCirculation_1.computeUniCirculation(token, ethers_1.BigNumber.from(1600387200 + 60 * 24 * 60 * 60), undefined)).toEqual(tokenAmount(224575341));
    });
    it('subtracts unclaimed uni', () => {
        expect(computeUniCirculation_1.computeUniCirculation(token, ethers_1.BigNumber.from(1600387200 + 15 * 24 * 60 * 60), tokenAmount(1000))).toEqual(tokenAmount(154999000));
    });
});

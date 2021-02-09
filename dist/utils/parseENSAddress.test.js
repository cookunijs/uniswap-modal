"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseENSAddress_1 = require("./parseENSAddress");
describe('parseENSAddress', () => {
    it('test cases', () => {
        expect(parseENSAddress_1.parseENSAddress('hello.eth')).toEqual({ ensName: 'hello.eth', ensPath: undefined });
        expect(parseENSAddress_1.parseENSAddress('hello.eth/')).toEqual({ ensName: 'hello.eth', ensPath: '/' });
        expect(parseENSAddress_1.parseENSAddress('hello.world.eth/')).toEqual({ ensName: 'hello.world.eth', ensPath: '/' });
        expect(parseENSAddress_1.parseENSAddress('hello.world.eth/abcdef')).toEqual({ ensName: 'hello.world.eth', ensPath: '/abcdef' });
        expect(parseENSAddress_1.parseENSAddress('abso.lutely')).toEqual(undefined);
        expect(parseENSAddress_1.parseENSAddress('abso.lutely.eth')).toEqual({ ensName: 'abso.lutely.eth', ensPath: undefined });
        expect(parseENSAddress_1.parseENSAddress('eth')).toEqual(undefined);
        expect(parseENSAddress_1.parseENSAddress('eth/hello-world')).toEqual(undefined);
        expect(parseENSAddress_1.parseENSAddress('hello-world.eth')).toEqual({ ensName: 'hello-world.eth', ensPath: undefined });
        expect(parseENSAddress_1.parseENSAddress('-prefix-dash.eth')).toEqual(undefined);
        expect(parseENSAddress_1.parseENSAddress('suffix-dash-.eth')).toEqual(undefined);
        expect(parseENSAddress_1.parseENSAddress('it.eth')).toEqual({ ensName: 'it.eth', ensPath: undefined });
        expect(parseENSAddress_1.parseENSAddress('only-single--dash.eth')).toEqual(undefined);
    });
});

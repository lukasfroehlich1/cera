"use strict";
//// <reference path="../../typings/globals/mocha/mocha.d.ts" />
/// <reference path="../../typings/mocules/chai/index.d.ts" />
import {expect} from "chai";

describe("Unit Tests:", () => {
    describe("2 + 4", () => {
        it("should be 6", (done) => {

            expect(2 + 4).to.equal(6);
            done();
        });
    });
});

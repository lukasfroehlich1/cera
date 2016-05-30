
"use strict";

import {expect} from "chai";
import {Coordinate} from "../models/class_defs";

describe("Unit Tests:", () => {
    describe("2 + 4", () => {
        it("should be 6", (done) => {

            let test = new Coordinate(1, 2);
            expect(test.x).to.equal(1);
            done();
        });
    });
});

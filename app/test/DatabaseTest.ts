"use strict";

import {expect} from "chai";
import {con, start, end} from "../middlewares/database";

describe("SQL connection tests:", () => {
    before(() => {
        start();
    });
    describe("create table", () => {
        it("should return one result", (done) => {

            con.query("create table test ( `id` int );", (err, result) => {
                if (err) done(err);

                con.query("insert into test (id) values (1)", (err, result) => {
                    if (err) done(err);

                    con.query("select * from test", (err, rows) => {
                        if (err) done(err);

                        expect(rows).to.have.length(1);

                        con.query("drop table test", (err, result) => {
                            if (err) done(err);

                            end();
                            done();
                        });
                    });
                });
            });
        });
    });
});
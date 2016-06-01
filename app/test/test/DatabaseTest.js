"use strict";
const chai_1 = require("chai");
const database_1 = require("../app/middlewares/database");
describe("SQL connection tests:", () => {
    before(() => {
        database_1.start();
    });
    describe("create table", function () {
        this.timeout(10000);
        it("should return one result", (done) => {
            database_1.con.query("create table test ( `id` int );", (err, result) => {
                if (err)
                    done(err);
                database_1.con.query("insert into test (id) values (1)", (err, result) => {
                    if (err)
                        done(err);
                    database_1.con.query("select * from test", (err, rows) => {
                        if (err)
                            done(err);
                        chai_1.expect(rows).to.have.length(1);
                        database_1.con.query("drop table test", (err, result) => {
                            if (err)
                                done(err);
                            database_1.end();
                            done();
                        });
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=DatabaseTest.js.map
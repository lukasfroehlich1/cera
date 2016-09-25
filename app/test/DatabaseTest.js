/* eslint-disable no-shadow, no-unused-vars */

import { expect } from 'chai';
import { con, start, end } from '../middlewares/database';
import async from 'async';

// describe('SQL connection tests:', () => {
//   before(() => {
//     start();
//   });
//   after(() => {
//     end();
//   });
//   describe('create table', function () { // eslint-disable-line func-names
//     this.timeout(10000);
//     it('should return one result', (done) => {
//       async.series([
//         (callback) => {
//           con.query('create table test ( `id` int );', (err, result) => {
//             if (err) done(err);
//             callback(null);
//           });
//         },
//         (callback) => {
//           con.query('insert into test (id) values (1)', (err, result) => {
//             if (err) done(err);
//             callback(null);
//           });
//         },
//         (callback) => {
//           con.query('select * from test', (err, rows) => {
//             if (err) done(err);
//             expect(rows).to.have.length(1);
//             callback(null);
//           });
//         },
//         (callback) => {
//           con.query('drop table test', (err, result) => {
//             if (err) done(err);
//             callback(null);
//           });
//         },
//       ], (err, result) => {
//         if (err) done(err);
//         done();
//       });
//     });
//   });
// });

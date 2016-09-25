/* eslint-disable */
import { expect } from 'chai';
import { map_riders_to_drivers } from '../models/match';
import { Rider, Driver, Coordinate, Time } from '../models/class_defs';

// describe('Matching', () => {
//   const sf = new Coordinate(37.7749, -122.4194);
//   const sj = new Coordinate(37.3382, -121.8863);
//   // const oaktown = new Coordinate(37.8044, -122.2711);
//   // const san_mateo = new Coordinate(37.5630, -122.3255);
//   const cp = new Coordinate(35.3050, -120.6625);
// 
//   describe('testing basic functionality', () => {
//     it('should match when given two overlapping riders and drivers', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(16, 34), new Time(19, 24), [sj], cp);
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'), new Time(15, 0),
//                                  new Time(17, 0), [], sf, cp, 1600, 20, 3);
//       map_riders_to_drivers([rider1], [driver1], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(1);
//         done();
//       });
//     });
// 
//     it('should match when given two overlapping users even with the Date' +
//        'having leftover time', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-01 20:00:00'), new Time(14, 34),
//                                new Time(15, 21), [sj], cp);
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:23:00'), new Time(13, 21),
//                                  new Time(17, 0), [], sf, cp, 1200, 20, 3);
//       map_riders_to_drivers([rider1], [driver1], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(1);
//         done();
//       });
//     });
//   });
// 
//   describe('testing various timings', () => {
//     it('should produce no results with times that dont overlap using minute form', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-01 00:00:00'), new Time(803),
//                                new Time(1320), [sj], cp);
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'), new Time(0),
//                                  new Time(758), [], sf, cp, 1200, 20, 3);
//       map_riders_to_drivers([rider1], [driver1], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(0);
//         done();
//       });
//     });
// 
//     it('should produce one result with overlapping times and using minute form', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(703), new Time(920), [sj], cp);
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'), new Time(510),
//                                  new Time(858), [], sf, cp, 1600, 20, 3);
// 
//       map_riders_to_drivers([rider1], [driver1], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(1);
//         done();
//       });
//     });
// 
//     it('should produce no results since times dont overlap', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-01 00:00:00'), new Time(14, 34),
//                                new Time(15, 21), [sj], cp);
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'), new Time(15, 21),
//                                  new Time(17, 0), [], sf, cp, 1200, 20, 3);
//       map_riders_to_drivers([rider1], [driver1], (err, res) => {
//         if (err) done(err);
//         expect(res).to.have.length(0);
//         done();
//       });
//     });
// 
//     it('should produce no results since months dont overlap', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-11-01 00:00:00'), new Time(14, 34),
//                                new Time(15, 21), [sj], cp);
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'), new Time(13, 21),
//                                  new Time(17, 0), [], sf, cp, 1200, 20, 3);
//       map_riders_to_drivers([rider1], [driver1], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(0);
//         done();
//       });
//     });
// 
//     it('should produce no results since dates dont overlap', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-02 00:00:00'), new Time(14, 34),
//                                new Time(15, 21), [sj], cp);
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'), new Time(13, 21),
//                                  new Time(17, 0), [], sf, cp, 1200, 20, 3);
//       map_riders_to_drivers([rider1], [driver1], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(0);
//         done();
//       });
//     });
// 
//     it('should produce no results since dates dont overlap and extra time on dates', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-02 00:00:00'), new Time(14, 34),
//                                new Time(15, 21), [sj], cp);
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 20:20:00'), new Time(13, 21),
//                                  new Time(17, 0), [], sf, cp, 1200, 20, 3);
//       map_riders_to_drivers([rider1], [driver1], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(0);
//         done();
//       });
//     });
// 
//     it('should produce no results since years differ', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2012-12-01 00:00:00'), new Time(14, 34),
//                                new Time(15, 21), [sj], cp);
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'), new Time(13, 21),
//                                  new Time(17, 0), [], sf, cp, 1200, 20, 3);
//       map_riders_to_drivers([rider1], [driver1], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(0);
//         done();
//       });
//     });
//   });
// 
//   describe('matching multiple riders and drivers', () => {
//     it('should return two results with two riders + one driver and all times overlap', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(800), new Time(1300), [sj], cp);
//       const rider2 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(703), new Time(920), [sj], cp);
// 
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(510), new Time(858), [], sf, cp, 1600, 20, 3);
// 
//       map_riders_to_drivers([rider1, rider2], [driver1], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(2);
//         done();
//       });
//     });
//     it('should return two results with one rider + two drivers and all times overlap', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(800), new Time(1300), [sj], cp);
// 
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(400), new Time(810), [], sf, cp, 1600, 20, 3);
//       const driver2 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(1200), new Time(1400), [], sf, cp, 1600, 20, 3);
// 
//       map_riders_to_drivers([rider1], [driver1, driver2], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(2);
//         done();
//       });
//     });
//     it('should return four results with two riders + two drivers and all' +
//        'overlapping times', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(800), new Time(1300), [sj], cp);
//       const rider2 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(800), new Time(1300), [sj], cp);
// 
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(400), new Time(810), [], sf, cp, 1600, 20, 3);
//       const driver2 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(1200), new Time(1400), [], sf, cp, 1600, 20, 3);
// 
//       map_riders_to_drivers([rider1, rider2], [driver1, driver2], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(4);
//         done();
//       });
//     });
//     it('should return four results with two riders + two drivers where riders' +
//        'dont overlap', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(800), new Time(1200), [sj], cp);
//       const rider2 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(1300), new Time(1400), [sj], cp);
// 
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(1100), new Time(1400), [], sf, cp, 1600, 20, 3);
//       const driver2 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(1150), new Time(1350), [], sf, cp, 1600, 20, 3);
// 
//       map_riders_to_drivers([rider1, rider2], [driver1, driver2], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(4);
//         done();
//       });
//     });
//     it('should return three results with two of each and only three overlaps exist', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(400), new Time(600), [sj], cp);
//       const rider2 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(800), new Time(900), [sj], cp);
// 
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(500), new Time(850), [], sf, cp, 1600, 20, 3);
//       const driver2 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(860), new Time(1050), [], sf, cp, 1600, 20, 3);
// 
//       map_riders_to_drivers([rider1, rider2], [driver1, driver2], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(3);
//         done();
//       });
//     });
//     it('should return four results with three rider and two driver with only' +
//        'four overlaps', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(400), new Time(600), [sj], cp);
//       const rider2 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(400), new Time(600), [sj], cp);
//       const rider3 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(1000), new Time(1100), [sj], cp);
// 
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(500), new Time(1050), [], sf, cp, 1600, 20, 3);
//       const driver2 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(1050), new Time(1250), [], sf, cp, 1600, 20, 3);
// 
//       map_riders_to_drivers([rider1, rider2, rider3], [driver1, driver2], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(4);
//         done();
//       });
//     });
//     it('should return no results with two of each and no overlaps', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(500), new Time(800), [sj], cp);
//       const rider2 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(600), new Time(700), [sj], cp);
// 
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(1000), new Time(1100), [], sf, cp, 1600, 20, 3);
//       const driver2 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(1150), new Time(1250), [], sf, cp, 1600, 20, 3);
// 
//       map_riders_to_drivers([rider1, rider2], [driver1, driver2], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(0);
//         done();
//       });
//     });
//   });
// 
//   describe('threshold', () => {
//     it('should return one result with an approriate threshold', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(500), new Time(800), [sj], cp);
// 
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(700), new Time(1100), [], sf, cp, 1000, 20, 3);
// 
//       map_riders_to_drivers([rider1], [driver1], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(1);
//         done();
//       });
//     });
//     it('should return no results with a small threshold', (done) => {
//       const rider1 = new Rider(1, 10, new Date('2011-12-01 00:00:00'),
//                                new Time(500), new Time(800), [sj], cp);
// 
//       const driver1 = new Driver(1, 11, new Date('2011-12-01 00:00:00'),
//                                  new Time(400), new Time(1100), [], sf, cp, 400, 20, 3);
// 
//       map_riders_to_drivers([rider1], [driver1], (err, res) => {
//         if (err) throw err;
//         expect(res).to.have.length(0);
//         done();
//       });
//     });
//   });
// });

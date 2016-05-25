-- adding a new user
insert into `User` (username, password, email, phone) values ('bobbytables', 'abc', 'tb@me.com', '415'), ('jwu', '123test', 'tje@c.com', '582'), ('lukfro', 'pear', 'lf@lf.lf', '530-350-9992'), ('catsteve', 'jazz', 'jazzlover@66.com', '86753'), ('pbj', 'peanut', 'ppp@jj.com', '33'), ('runnerman', 'scared', 'exscapell@4.com', '4322'), ('picker', 'offruit', 'fruit@ismy.lyfe', '41992');


-- make bobbytables a driver

-- first check if bobbytables is a rider. if he is return an empty set
-- takes a user id 
-- select * from Rider where 'input_id' = id

insert into `Driver` (userId, leave_date, leave_earliest, leave_latest, waypoints, end_point, startId, trip_time, threshold, price_seat, seats) values (1, str_to_date('5 April, 2016', '%e %M, %Y'), '10:04', '18:09', '', 'SF', 1, 26100, 3600, 20, 4), (2, str_to_date('5 April, 2016', '%e %M, %Y'), '15:04', '19:33', '', 'Santa Monica', 1, 7200, 1200, 20, 4);


-- make jwu a rider

-- first check if jwu is a driver. if he is return an empty set
-- takes a user id 
-- select * from Driver where 'jwu_id' = id

insert into `Rider` (userId, leave_date, leave_earliest, leave_latest, startId, end_points) values (3, str_to_date('5 April, 2016', '%e %M, %Y')  , '11:04', '20:18', 1, 'San Clemente|Temecula'), (4, str_to_date('5 April, 2016', '%e %M, %Y')  , '07:04', '012:10', 1, 'San Jose');



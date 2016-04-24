-- adding a new user
insert into `User` (username, password, email, phone) values ('bobbytables', 'abc', 'tb@me.com', '415'), ('jwu', '123test', 'tje@c.com', '582');


-- add valid stop locations
insert into `ValidStarts` (name, coordinate) values ('UCSB', '34.4140,-119.8489');
insert into `ValidStarts` (name, coordinate) values ('cp', '31.40338, 3.17403');


-- make bobbytables a driver

-- first check if bobbytables is a rider. if he is return an empty set
-- takes a user id 
-- select * from Rider where 'input_id' = id

insert into `Driver` (userId, leave_date, leave_earliest, leave_latest, waypoints, end_point, startId, trip_time, threshold, price_seat, seats) values (1, str_to_date('5 April, 2016', '%e %M, %Y'), '15:04', '18:09', '', 'SF', 1, 17820, 3600, 20, 4);


-- make jwu a rider

-- first check if jwu is a driver. if he is return an empty set
-- takes a user id 
-- select * from Driver where 'jwu_id' = id

insert into `Rider` (userId, leave_date, leave_earliest, leave_latest, startId, end_points) values (2, str_to_date('5 April, 2016', '%e %M, %Y')  , '15:04', '18:09', 1, 'San Jose');



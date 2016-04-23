-- adding a new user
insert into `User` (username, email, phone) values ('bobbytables', 'tb@me.com', '415'), ('jwu', 'tje@c.com', '582');


-- add valid stop locations
insert into `ValidStarts` (name, coordinate) values ('UCSB', '21.40338, 19.17403');
insert into `ValidStarts` (name, coordinate) values ('cp', '31.40338, 3.17403');


-- make bobbytables a driver

-- first check if bobbytables is a rider. if he is return an empty set
-- takes a user id 
-- select * from Rider where 'input_id' = id

insert into `Driver` values (1, timestamp('2016-05-06 11:23:34'), timestamp('2016-05-07 11:23:34'), '41.40338,2.17403|41.40338,2.17403', '61.40338,3.17403', 1, 3600, 1200, 20, 4);


-- make jwu a rider

-- first check if jwu is a driver. if he is return an empty set
-- takes a user id 
-- select * from Driver where 'jwu_id' = id

insert into `Rider` values (2, timestamp('2016-05-06 12:23:34'), timestamp('2016-05-08 11:23:34'), 1, '41.40338,2.17403|41.40338,2.17403');



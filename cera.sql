drop database if exists cera;
create database cera;
use cera;

-- These are the expected long/lat formats. all will be stored as strings(varchar)
--
-- Degrees, minutes, and seconds (DMS): 41°24'12.2"N 2°10'26.5"E
-- Degrees and decimal minutes (DMM): 41 24.2028, 2 10.4418
-- Decimal degrees (DD): 41.40338, 2.17403

-- A list of coords is stored as
-- "41.40338, 2.17403|41.40338, 2.17403"


create table User (
    `id` int primary key auto_increment,
    `username` varchar(30),
    `password` varchar(30),
    `email` varchar(100),
    `phone` varchar(12),
    unique(username, password)
    -- feel free to add crap to this
);

create table ValidStarts (
    `id` int primary key auto_increment,
    `name` varchar(30),
    `coordinate` varchar(30)
);

create table Driver (
    `id` int primary key auto_increment,
    `userId` int,
    constraint FKDriver_userId foreign key (userid) references User(id) on update cascade on delete cascade,
    `leave_earliest` Timestamp,
    `leave_latest` Timestamp,
    `waypoints` varchar(255),   -- if errors come up with this limit let lukas know
    `end_point` varchar(30),
    `startId` int,
    constraint FKDriver_startId foreign key (startId) references ValidStarts(id) on update cascade,
    `trip_time` int, -- in seconds competed when new driver is added
    `threshold` int, -- in seconds
    `price_seat` int, 
    `seats` int
);

create table Rider (
    `id` int primary key auto_increment,
    `userId` int,
    constraint FKRider_userId foreign key (userId) references User(id) on update cascade on delete cascade,
    `leave_earliest` Timestamp,
    `leave_latest` Timestamp,
    `startId` int,
    constraint FKRider_startId foreign key (startId) references ValidStarts(id) on update cascade,
    `end_points` varchar(100)
);

create table Bond (
    `driverId` int,
    constraint FKBond_driverId foreign key (driverId) references Driver(id) on delete cascade on update cascade,
    `riderId` int,
    constraint FKBond_riderId foreign key (riderId) references Rider(id) on delete cascade on update cascade
);

create table `Match` (
    `id` int primary key,
    constraint FKMatch_riderId foreign key (id) references Rider(id) on delete cascade on update cascade,
    `driverId` int,
    constraint FKMatch_driverId foreign key (driverId) references Driver(id) on delete cascade on update cascade,
	driver_end_point varchar(30),
	new_trip_time int
);

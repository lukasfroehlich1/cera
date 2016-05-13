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
    `username` varchar(30) not null,
    `password` varchar(30) not null,
    `email` varchar(100) not null,
    `phone` varchar(12) not null,
    unique(username)
    -- feel free to add crap to this
);

create table ValidStarts (
    `id` int primary key auto_increment,
    `name` varchar(30) not null,
    `coordinate` varchar(30) not null
);

create table Driver (
    `id` int primary key auto_increment,
    `userId` int,
    constraint FKDriver_userId foreign key (userid) references User(id) on update cascade on delete cascade,
    `leave_date` Date not null,
    `leave_earliest` Time not null,
    `leave_latest` Time not null,
    `waypoints` varchar(255),   -- if errors come up with this limit let lukas know
    `end_point` varchar(30),
    `startId` int not null,
    constraint FKDriver_startId foreign key (startId) references ValidStarts(id) on update cascade,
    `trip_time` int not null, -- in seconds competed when new driver is added
    `threshold` int default 1200, -- in seconds
    `price_seat` int not null, 
    `seats` int not null
);

create table Rider (
    `id` int primary key auto_increment,
    `userId` int,
    constraint FKRider_userId foreign key (userId) references User(id) on update cascade on delete cascade,
    `leave_date` Date not null,
    `leave_earliest` Time not null,
    `leave_latest` Time not null,
    `startId` int not null,
    constraint FKRider_startId foreign key (startId) references ValidStarts(id) on update cascade,
    `end_points` varchar(100) not null
);

create table Bond (
    `driverId` int not null,
    constraint FKBond_driverId foreign key (driverId) references Driver(id) on delete cascade on update cascade,
    `riderId` int not null,
    constraint FKBond_riderId foreign key (riderId) references Rider(id) on delete cascade on update cascade
);

create table `Match` (
    `id` int not null,
    constraint FKMatch_riderId foreign key (id) references Rider(id) on delete cascade on update cascade,
    `driverId` int not null,
    constraint FKMatch_driverId foreign key (driverId) references Driver(id) on delete cascade on update cascade,
	rider_end_point varchar(30) not null,
	new_trip_time int not null
);


insert into `ValidStarts` (name, coordinate) values ('UCSD', '32.8801,-117.2340');
insert into `ValidStarts` (name, coordinate) values ('UCSB', '34.4140,-119.8489');
insert into `ValidStarts` (name, coordinate) values ('CP', '35.3050,-120.6625');



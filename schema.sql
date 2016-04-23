


create table User (
    `id` int primary key auto_increment,
    `username` varchar(30),
    `email` varchar(30)


create table Driver (
    `id` int primary key,
    `leave_earliest` Date,
    `leave_latest` Date,
    `waypoints` varchar(300),
    `end_point` type??,
    `startId` int,
    constraint FKDriver_startId foreign key (startId) references ValidStarts(id),
    `trip_time` int, -- in seconds 
    `threshold` int, -- in seconds
    `price_seat` decimal, 
    `seats` int
);

create table Rider (
    `id` int primary key,
    `leave_earliest` Date,
    `leave_latest` Date,
    `startId` int,
    constraint FKDriver_startId foreign key (startId) references ValidStarts(id),
    `end_points` type?? --has order limit to 3  
)

create table Bond (


)













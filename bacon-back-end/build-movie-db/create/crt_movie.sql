drop materialized view popular_actors_mv;
drop table cast_and_crew;
drop table dailymode;
drop table multiplayer;
drop table movie;
drop table person;

create table movie
	(movie_id number(12) PRIMARY KEY,
	title varchar2(255) NOT NULL,
	release_date date,
	poster_path varchar2(255));

exit;

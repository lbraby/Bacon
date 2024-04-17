load data infile 'csvfiles/cast_data.csv'
insert into table cast_and_crew
fields terminated by "," optionally enclosed by '"'
(movie_id, person_id, role)

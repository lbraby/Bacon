load data infile 'csvfiles/directors_data.csv'
append into table cast_and_crew
fields terminated by "," optionally enclosed by '"'
(movie_id, person_id, role)

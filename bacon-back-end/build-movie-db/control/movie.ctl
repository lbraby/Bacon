load data infile 'csvfiles/movie_data.csv'
insert into table movie
fields terminated by "," optionally enclosed by '"'
(movie_id, title, poster_path, release_date DATE 'YYYY-MM-DD')

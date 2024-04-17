load data infile 'csvfiles/person_data.csv'
insert into table person
fields terminated by "," optionally enclosed by '"'
(person_id, name, image_path, known_for_department)

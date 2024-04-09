load data infile 'db/test.csv'
insert into table test
fields terminated by "," optionally enclosed by '"'
(id, text)

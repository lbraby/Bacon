create materialized view popular_actors_mv
as
select person_id, name, image_path, known_for_department, num_movies 
from person natural join (
	select person_id, count(*) num_movies
	from cast_and_crew natural join movie
	group by person_id 
	having count(*) > 40 and TO_NUMBER(AVG(EXTRACT(YEAR FROM release_date))) > 1990
)
where lower(KNOWN_FOR_DEPARTMENT) like 'acting%';

exit;

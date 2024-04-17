DROP sequence cast_and_crew_id_sequence;

CREATE sequence cast_and_crew_id_sequence
START WITH 1
INCREMENT BY 1
NOMAXVALUE;

create table cast_and_crew
	(id number(12) PRIMARY KEY,
	movie_id number(12),
	person_id number(12),
	role varchar2(10) NOT NULL,
	FOREIGN KEY (movie_id)
		REFERENCES movie(movie_id)
		ON DELETE CASCADE,
	FOREIGN KEY (person_id)
		REFERENCES person(person_id)
		ON DELETE CASCADE);

CREATE or REPLACE trigger trig_cast_and_crew_id
BEFORE INSERT ON cast_and_crew
FOR EACH ROW
BEGIN
	select cast_and_crew_id_sequence.nextval into :new.id from dual;
END;
/

exit;

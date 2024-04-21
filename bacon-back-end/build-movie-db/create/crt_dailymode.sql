DROP sequence dailymode_id_sequence;

CREATE sequence dailymode_id_sequence
START WITH 1
INCREMENT BY 1
NOMAXVALUE;

create table dailymode
	(id number(12) PRIMARY KEY,
	person1_id number(12),
	person2_id number(12),
	todays_date date,
	FOREIGN KEY (person1_id)
		REFERENCES person(person_id)
		ON DELETE CASCADE,
	FOREIGN KEY (person2_id)
		REFERENCES person(person_id)
		ON DELETE CASCADE);

CREATE or REPLACE trigger trig_dailymode_id
BEFORE INSERT ON dailymode
FOR EACH ROW
BEGIN
	select dailymode_id_sequence.nextval into :new.id from dual;
END;
/

exit;

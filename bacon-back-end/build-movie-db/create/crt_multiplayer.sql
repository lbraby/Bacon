DROP sequence game_id_sequence;

CREATE sequence game_id_sequence
START with 4835
INCREMENT by 1
NOMAXVALUE;

create table multiplayer
        (game_id number(12) PRIMARY KEY,
        ready number(1) NOT NULL,
        userhost_name varchar2(255) NOT NULL,
        otheruser_name varchar2(255),
        userhost_person_id number(12),
        otheruser_person_id number(12),
        userhost_time_seconds number(10),
        otheruser_time_seconds number(10),
        userhost_link_count number(10),
        otheruser_link_count number(10),
        userhost_last_pulse date,
        otheruser_last_pulse date,
        FOREIGN KEY (userhost_person_id)
                REFERENCES person(person_id)
                ON DELETE CASCADE,
        FOREIGN KEY (otheruser_person_id)
                REFERENCES person(person_id)
                ON DELETE CASCADE);

exit;


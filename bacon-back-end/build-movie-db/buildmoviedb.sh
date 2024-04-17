sqlplus -S guest/guest @create/crt_movie
sqlplus -S guest/guest @create/crt_person
sqlplus -S guest/guest @create/crt_cast_and_crew
sqlldr guest/guest control=control/movie.ctl
sqlldr guest/guest control=control/person.ctl
sqlldr guest/guest control=control/cast.ctl
sqlldr guest/guest control=control/directors.ctl


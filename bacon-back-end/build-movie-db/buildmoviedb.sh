sqlplus -S guest/guest @create/crt_movie
sqlplus -S guest/guest @create/crt_person
sqlplus -S guest/guest @create/crt_cast_and_crew
sqlplus -S guest/guest @create/crt_dailymode
sqlldr guest/guest control=control/movie.ctl
sqlldr guest/guest control=control/person.ctl
sqlldr guest/guest control=control/cast.ctl errors=9999999
sqlldr guest/guest control=control/directors.ctl errors=9999999


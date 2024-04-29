sqlplus -S guest/guest @create/crt_movie
sqlplus -S guest/guest @create/crt_person
sqlplus -S guest/guest @create/crt_cast_and_crew
sqlplus -S guest/guest @create/crt_dailymode
sqlplus -S guest/guest @create/crt_multiplayer
sqlplus -S guest/guest @create/crt_popular_actors_mv
sqlldr guest/guest control=control/movie.ctl errors=9999999
sqlldr guest/guest control=control/person.ctl errors=9999999
sqlldr guest/guest control=control/cast.ctl errors=9999999
sqlldr guest/guest control=control/directors.ctl errors=9999999


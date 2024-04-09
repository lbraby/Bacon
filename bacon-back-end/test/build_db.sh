# using test account (username=guest, password=guest)
sqlplus -S guest/guest @db/crt_test
sqlldr guest/guest control=db/test.ctl

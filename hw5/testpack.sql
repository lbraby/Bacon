-- run the report given a SP's id
--  (shows an SP's customers)
set verify off
set feedback off
set serveroutput on
begin
  hw5pack.custlist('&sp_id');
  hw5pack.custtransactions('&c_id');
  hw5pack.mytransactions('&sp_id2');
end;
/


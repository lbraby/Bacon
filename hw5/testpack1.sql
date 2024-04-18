-- run the report given a SP's id
-- (shows an SP's customers and their transactions)
set verify off
set feedback off
set serveroutput on
declare 
  salpers_id salesperson.salpers_id%type := '&salpers_id';
begin
  hw5pack.custlist(salpers_id);
  hw5pack.mytransactions(salpers_id);
end;
/


-- run the report given a SP's id
-- (shows an SP's customers and their transactions)
set verify off
set feedback off
set serveroutput on
declare 
  cust_id customer.cust_id%type := '&cust_id';
begin
  hw5pack.custtransactions(cust_id);
end;
/


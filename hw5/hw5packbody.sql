create or replace package body hw5pack
is
  function getcustname(id customer.cust_id%type)
    return customer.cust_name%type
  is
    name customer.cust_name%type;
  begin
    select cust_name
    into name
    from customer
    where cust_id = id;
    return name;
  exception
    when no_data_found then
      dbms_output.put_line('getcustname eror: ' || id || ' not found');
      return null;
  end;
end hw5pack;
/

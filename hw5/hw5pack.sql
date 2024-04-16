create or replace package hw5pack
is
  function getcustname(id customer.cust_id%type)
    return customer.cust_name%type;
  function getsalpersname(id salesperson.salpers_id%type)
    return salesperson.salpers_name%type;
  procedure custlist (sid salesperson.salpers_id%type);
end hw5pack;
/

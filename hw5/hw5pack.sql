create or replace package hw5pack
is
 function getcustname(id customer.cust_id%type)
    return customer.cust_name%type;
  
end hw5pack;
/

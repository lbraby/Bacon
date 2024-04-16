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
      dbms_output.put_line('getcustname error: ' || id || ' not found');
      return null;
  end;

  function getsalpersname(id salesperson.salpers_id%type)
    return salesperson.salpers_name%type
  is
    name salesperson.salpers_name%type;
  begin
    select salpers_name
    into name
    from salesperson
    where salpers_id = id;
    return name;
  exception
    when no_data_found then
      dbms_output.put_line('getsalpersname error ' || id || ' not found');
      return null;
  end;

  procedure custlist (sid salesperson.salpers_id%type)
  is
    cursor cust_c (id salesperson.salpers_id%type)
    is
      select distinct s.cust_id
      from sale s
      where s.salpers_id = id;
    
  cid customer.cust_id%type;
  counter binary_integer := 0;

  nothing exception;

  begin
    dbms_output.put_line('Salesperson: ' || getsalpersname(sid)); 
    dbms_output.put_line('Customers:');

    open cust_c(sid);
    loop
      fetch cust_c into cid;
      exit when cust_c%notfound;
      counter := counter + 1;
      dbms_output.put_line('   ' || counter || '. ' || getcustname(cid));
    end loop;
    close cust_c;

    if counter = 0 then
      raise nothing;
    end if;

  exception
    when nothing then
      dbms_output.put_line('no customers found');
    when no_data_found then
      dbms_output.put_line('no such salesperson');
  end;
    
end hw5pack;
/

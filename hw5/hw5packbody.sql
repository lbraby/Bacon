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
  
  function getqty(id sale.sale_id%type)
    return sale.qty%type
  is
    q sale.qty%type;
  begin
    select qty into q from sale where sale_id=id;
    return q;
  exception
    when no_data_found then
	dbms_output.put_line('getprodid error ' || id || ' not found');
	return null;
  end;

  function getprodid(id sale.sale_id%type)
    return sale.prod_id%type
  is
    pid sale.prod_id%type;
  begin
    select prod_id into pid from sale where sale_id=id;
    return pid;
  exception
    when no_data_found then
	dbms_output.put_line('getprodid error ' || id || ' not found');
	return null;
  end;
   
  function getprodprice(id product.prod_id%type)
    return product.price%type
  is
    prc product.price%type;
  begin
    select price
    into prc
    from product
    where prod_id = id;
    return prc;
  exception
    when no_data_found then
	dbms_output.put_line('getprodprice error ' || id || ' not found');
	return null;
  end;

  function addition(n1 float, n2 float)
    return float
  is
    s float := 0.00;
  begin
    s := n1 + n2;
    return s;
  end;

  function multiplication(n1 float, n2 float)
    return float
  is
    s float := 0.00;
  begin
    s := n1 * n2;
    return s;
  end;

  procedure custtransactions (cid customer.cust_id%type)
  is 
    cursor sales (id customer.cust_id%type)
    is 
      select distinct sale_id from sale where cid=id;

  sid sale.sale_id%type;
  counter binary_integer := 0;
  total float := 0.00;

  nothing exception;

  begin
    dbms_output.put_line('Customer: ' || getcustname(cid));
    dbms_output.put_line('Sales:');

    open sales(sid);
    loop
      fetch sales into sid;
      exit when sales%notfound;
      counter := counter + 1;
      total := total + multiplication(getqty(sid), getprodprice(getprodid(sid)));
      dbms_output.put_line('   ' || counter || '. ' || multiplication(getqty(sid), getprodprice(getprodid(sid))));
    end loop;
    close sales;
    dbms_output.put_line('Sum: ' || total);
    if counter = 0 then
      raise nothing;
    end if;
  end;

end hw5pack;
/

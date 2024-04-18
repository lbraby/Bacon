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


  function getprodcost(id product.prod_id%type)
    return product.cost%type
  is
    prc product.cost%type;
  begin
    select cost
    into prc
    from product
    where prod_id = id;
    return prc;
  exception
    when no_data_found then
	dbms_output.put_line('getprodcost error ' || id || ' not found');
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

  function subtraction(n1 float, n2 float)
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
    cursor sales_c (id customer.cust_id%type)
    is 
      select distinct s.sale_id from sale s where s.cust_id=id;

  sid sale.sale_id%type;
  counter binary_integer := 0;
  total float := 0.00;

  nothing exception;

  begin
    dbms_output.put_line('Customer: ' || getcustname(cid));
    dbms_output.put_line('Transactions:');

    open sales_c(cid);
    loop
      fetch sales_c into sid;
      exit when sales_c%notfound;
      counter := counter + 1;
      total := total + multiplication(getqty(sid), getprodprice(getprodid(sid)));
      dbms_output.put_line('   ' || sid || '. ' || multiplication(getqty(sid), getprodprice(getprodid(sid))));
    end loop;
    close sales_c;
    dbms_output.put_line('Sum: ' || total);
    if counter = 0 then
      raise nothing;
    end if;

  exception
    when nothing then
      dbms_output.put_line('no sales found');
    when no_data_found then
      dbms_output.put_line('no such customer');
  end;
  procedure mytransactions (sp_id salesperson.salpers_id%type)
  is 
    cursor sales_c (id salesperson.salpers_id%type)
    is 
      select distinct s.sale_id from sale s where s.salpers_id=id;

  sid sale.sale_id%type;
  counter binary_integer := 0;
  total_rev float := 0.00;
  total_cost float := 0.00;

  nothing exception;

  begin
    dbms_output.put_line('Salesperson: ' || getsalpersname(sp_id));
    dbms_output.put_line('Transactions:');

    open sales_c(sp_id);
    loop
      fetch sales_c into sid;
      exit when sales_c%notfound;
      counter := counter + 1;
      total_rev := total_rev + multiplication(getqty(sid), getprodprice(getprodid(sid)));
      total_cost := total_cost + multiplication(getqty(sid), getprodcost(getprodid(sid)));
      dbms_output.put_line('   ' || sid || '. ' || multiplication(getqty(sid), getprodprice(getprodid(sid))));
    end loop;
    close sales_c;
    dbms_output.put_line('Total Cost: ' || total_rev);
    dbms_output.put_line('Total Profit: ' || subtraction(total_rev, total_cost));
    if counter = 0 then
      raise nothing;
    end if;

  exception
    when nothing then
      dbms_output.put_line('no sales found');
    when no_data_found then
      dbms_output.put_line('no such salesperson');
  end;

end hw5pack;
/

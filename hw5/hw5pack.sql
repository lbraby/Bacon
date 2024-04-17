create or replace package hw5pack
is
  function getcustname(id customer.cust_id%type)
    return customer.cust_name%type;
  function getsalpersname(id salesperson.salpers_id%type)
    return salesperson.salpers_name%type;
  procedure custlist (sid salesperson.salpers_id%type);
  function getqty(id sale.sale_id%type)
    return sale.qty%type;
  function getprodid(id sale.sale_id%type)
    return sale.prod_id%type;
  function getprodprice(id product.prod_id%type)
    return product.price%type;
  function addition(n1 float, n2 float)
    return float;
  function multiplication(n1 float, n2 float)
    return float;
end hw5pack;
/

select s.sale_id, s.sdate, c.cust_name, sp.salpers_name, p.prod_desc, qty from sale s natural join customer c natural join product p natural join salesperson sp order by s.sale_id;

select s.sale_id, sp.salpers_name, s.qty*(p.price-p.cost) as profit from sale s natural join salesperson sp natural join product p order by s.sale_id;

select sp1.salpers_name as name, count(sp1.salpers_name) as manages from salesperson sp1, salesperson sp2 where sp1.salpers_id = sp2.manager_id group by sp1.salpers_name;
create table sale
       (sale_id number(3),
        sdate date ,
        cust_id number(3),
        salpers_id number(2),
        prod_id number(4),
        qty int,
        primary key (sale_id),
        foreign key(cust_id) references customer (cust_id),
        foreign key(salpers_id) references salesperson (salpers_id),
        foreign key(prod_id) references product (prod_id));
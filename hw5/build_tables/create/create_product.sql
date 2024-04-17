create table product
       (prod_id number(4),
        prod_desc varchar(30),
        manufactr_id number(3),
        cost float,
        price float,
        primary key (prod_id),
        foreign key(manufactr_id) references manufacturer(manufactr_id));
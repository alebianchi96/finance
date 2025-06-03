-- Ammontare per ogni fondo patrimoniale
select pf.code, sum(m.amount) as total_amount
    from movements  m
        join patrimonial_funds pf on pf.id = m.fk_patrimonial_fund
group by pf.code
order by sum(m.amount) desc


-- Ammontare totale
select sum(m.amount) as total_amount
from movements  m
         join patrimonial_funds pf on pf.id = m.fk_patrimonial_fund
order by sum(m.amount) desc


-- Ultimo movimento
select * from movements order by dt desc, id desc limit 1;
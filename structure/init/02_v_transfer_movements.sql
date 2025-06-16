create or replace view v_transfer_movements as
select 
	m.block_id as id, m.created_at, m.updated_at, m.dt as dt, m.note, 
	m.id as id_to, m.fk_patrimonial_fund as fk_patrimonial_fund_to, m.amount, 
	mf.id as id_from, mf.fk_patrimonial_fund as fk_patrimonial_fund_from
from movements m
	left join movements mf on mf.block_id = m.block_id and mf.id <> m.id
where m.amount > 0
	and m.fk_economic_account is null
order by m.dt desc
;	
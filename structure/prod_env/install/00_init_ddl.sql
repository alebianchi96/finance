-- file `structure/init/00_init_ddl.sql`

CREATE TABLE economic_categories (
id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
code        VARCHAR(100) NOT NULL UNIQUE,
label       VARCHAR(255),
nature		VARCHAR(1), /* C or R */
created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE economic_accounts (
id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
code        VARCHAR(100) NOT NULL UNIQUE,
label       VARCHAR(255),
fk_economic_category BIGINT NOT NULL REFERENCES economic_categories (id) ON DELETE SET NULL,
created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE patrimonial_funds (
id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
code        VARCHAR(100) NOT NULL UNIQUE,
label       VARCHAR(255),
created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE movements (
id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
dt          TIMESTAMP WITH TIME ZONE,
fk_economic_account BIGINT REFERENCES economic_accounts (id) ON DELETE SET NULL,
note       VARCHAR(255),
fk_patrimonial_fund BIGINT NOT null REFERENCES  patrimonial_funds (id) ON DELETE SET NULL,
amount      NUMERIC(20, 2) NOT NULL, /* costi hanno valori negativi come i prelievi */
created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
block_id    BIGINT NOT NULL
);

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
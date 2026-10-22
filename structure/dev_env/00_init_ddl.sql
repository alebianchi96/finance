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


-- -----------------------------------------------------------------


alter table economic_categories add ordering INT default 0;

CREATE OR REPLACE VIEW v_economic_results
AS SELECT tab0.ys,
        CASE
            WHEN tab0.ms = 99 THEN 'TOTALE'::text
            ELSE tab0.ms || ''::text
        END AS mm,
    tab0.totale_ricavi,
    tab0.totale_costi,
    tab0.totale_ricavi + tab0.totale_costi AS totale
   FROM ( SELECT years.ys,
            months.ms,
            ( SELECT COALESCE(sum(m1.amount), 0::numeric) AS "coalesce"
                   FROM movements m1
                     JOIN economic_accounts ea ON ea.id = m1.fk_economic_account
                     JOIN economic_categories ec ON ea.fk_economic_category = ec.id AND ec.nature::text = 'R'::text
                  WHERE m1.fk_economic_account IS NOT NULL AND (EXTRACT(month FROM m1.dt)::integer = months.ms OR months.ms = 99) AND EXTRACT(year FROM m1.dt)::integer = years.ys) AS totale_ricavi,
            ( SELECT COALESCE(sum(m1.amount), 0::numeric) AS "coalesce"
                   FROM movements m1
                     JOIN economic_accounts ea ON ea.id = m1.fk_economic_account
                     JOIN economic_categories ec ON ea.fk_economic_category = ec.id AND ec.nature::text = 'C'::text
                  WHERE m1.fk_economic_account IS NOT NULL AND (EXTRACT(month FROM m1.dt)::integer = months.ms OR months.ms = 99) AND EXTRACT(year FROM m1.dt)::integer = years.ys) AS totale_costi
           FROM ( SELECT 1 AS ms
                UNION
                 SELECT 2
                UNION
                 SELECT 3
                UNION
                 SELECT 4
                UNION
                 SELECT 5
                UNION
                 SELECT 6
                UNION
                 SELECT 7
                UNION
                 SELECT 8
                UNION
                 SELECT 9
                UNION
                 SELECT 10
                UNION
                 SELECT 11
                UNION
                 SELECT 12
                UNION
                 SELECT 99) months
             JOIN ( SELECT y0.ys
                   FROM ( SELECT DISTINCT EXTRACT(year FROM m0.dt)::integer AS ys
                           FROM movements m0
                          WHERE m0.fk_economic_account IS NOT NULL) y0) years ON 1 = 1
          ORDER BY years.ys, months.ms) tab0;

CREATE OR REPLACE VIEW v_economic_results_detail
AS SELECT tab0.ys,
    tab0.categoria,
    tab0.conto,
    tab0.gen,
    tab0.feb,
    tab0.mar,
    tab0.apr,
    tab0.mag,
    tab0.giu,
    tab0.lug,
    tab0.ago,
    tab0.sett,
    tab0.ott,
    tab0.nov,
    tab0.dic,
    tab0.gen + tab0.feb + tab0.mar + tab0.apr + tab0.mag + tab0.giu + tab0.lug + tab0.ago + tab0.sett + tab0.ott + tab0.nov + tab0.dic AS total_for_year
   FROM ( SELECT g.ys,
            g.categoria,
            g.conto,
                CASE
                    WHEN g.id_conto IS NOT NULL THEN COALESCE(aa.gen, 0::numeric)
                    ELSE COALESCE(ac.gen, 0::numeric)
                END AS gen,
                CASE
                    WHEN g.id_conto IS NOT NULL THEN COALESCE(aa.feb, 0::numeric)
                    ELSE COALESCE(ac.feb, 0::numeric)
                END AS feb,
                CASE
                    WHEN g.id_conto IS NOT NULL THEN COALESCE(aa.mar, 0::numeric)
                    ELSE COALESCE(ac.mar, 0::numeric)
                END AS mar,
                CASE
                    WHEN g.id_conto IS NOT NULL THEN COALESCE(aa.apr, 0::numeric)
                    ELSE COALESCE(ac.apr, 0::numeric)
                END AS apr,
                CASE
                    WHEN g.id_conto IS NOT NULL THEN COALESCE(aa.mag, 0::numeric)
                    ELSE COALESCE(ac.mag, 0::numeric)
                END AS mag,
                CASE
                    WHEN g.id_conto IS NOT NULL THEN COALESCE(aa.giu, 0::numeric)
                    ELSE COALESCE(ac.giu, 0::numeric)
                END AS giu,
                CASE
                    WHEN g.id_conto IS NOT NULL THEN COALESCE(aa.lug, 0::numeric)
                    ELSE COALESCE(ac.lug, 0::numeric)
                END AS lug,
                CASE
                    WHEN g.id_conto IS NOT NULL THEN COALESCE(aa.ago, 0::numeric)
                    ELSE COALESCE(ac.ago, 0::numeric)
                END AS ago,
                CASE
                    WHEN g.id_conto IS NOT NULL THEN COALESCE(aa.sett, 0::numeric)
                    ELSE COALESCE(ac.sett, 0::numeric)
                END AS sett,
                CASE
                    WHEN g.id_conto IS NOT NULL THEN COALESCE(aa.ott, 0::numeric)
                    ELSE COALESCE(ac.ott, 0::numeric)
                END AS ott,
                CASE
                    WHEN g.id_conto IS NOT NULL THEN COALESCE(aa.nov, 0::numeric)
                    ELSE COALESCE(ac.nov, 0::numeric)
                END AS nov,
                CASE
                    WHEN g.id_conto IS NOT NULL THEN COALESCE(aa.dic, 0::numeric)
                    ELSE COALESCE(ac.dic, 0::numeric)
                END AS dic
           FROM ( SELECT ec.ordering AS ord,
                    ec.id AS id_categoria,
                    ec.label AS categoria,
                    NULL::integer AS id_conto,
                    ''::text AS conto,
                    y.ys
                   FROM economic_categories ec
                     JOIN ( SELECT DISTINCT EXTRACT(year FROM m0.dt)::integer AS ys
                           FROM movements m0
                          WHERE m0.fk_economic_account IS NOT NULL) y ON 1 = 1
                  WHERE ec.ordering > 0
                UNION ALL
                 SELECT ec.ordering AS ord,
                    ec.id AS id_categoria,
                    ec.label AS categoria,
                    ea.id AS id_conto,
                    ea.label AS conto,
                    y.ys
                   FROM economic_accounts ea
                     JOIN economic_categories ec ON ec.id = ea.fk_economic_category AND ec.ordering > 0
                     JOIN ( SELECT DISTINCT EXTRACT(year FROM m0.dt)::integer AS ys
                           FROM movements m0
                          WHERE m0.fk_economic_account IS NOT NULL) y ON 1 = 1) g
             LEFT JOIN ( SELECT EXTRACT(year FROM m.dt)::integer AS ys,
                    m.fk_economic_account,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 1::numeric) AS gen,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 2::numeric) AS feb,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 3::numeric) AS mar,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 4::numeric) AS apr,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 5::numeric) AS mag,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 6::numeric) AS giu,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 7::numeric) AS lug,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 8::numeric) AS ago,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 9::numeric) AS sett,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 10::numeric) AS ott,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 11::numeric) AS nov,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 12::numeric) AS dic
                   FROM movements m
                  WHERE m.fk_economic_account IS NOT NULL
                  GROUP BY (EXTRACT(year FROM m.dt)::integer), m.fk_economic_account) aa ON aa.ys = g.ys AND aa.fk_economic_account = g.id_conto
             LEFT JOIN ( SELECT EXTRACT(year FROM m.dt)::integer AS ys,
                    ea.fk_economic_category,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 1::numeric) AS gen,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 2::numeric) AS feb,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 3::numeric) AS mar,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 4::numeric) AS apr,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 5::numeric) AS mag,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 6::numeric) AS giu,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 7::numeric) AS lug,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 8::numeric) AS ago,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 9::numeric) AS sett,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 10::numeric) AS ott,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 11::numeric) AS nov,
                    sum(m.amount) FILTER (WHERE EXTRACT(month FROM m.dt) = 12::numeric) AS dic
                   FROM movements m
                     JOIN economic_accounts ea ON ea.id = m.fk_economic_account
                  WHERE m.fk_economic_account IS NOT NULL
                  GROUP BY (EXTRACT(year FROM m.dt)::integer), ea.fk_economic_category) ac ON ac.ys = g.ys AND ac.fk_economic_category = g.id_categoria
          ORDER BY g.ys, g.ord, g.conto) tab0;
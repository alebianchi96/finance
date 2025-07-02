DO $$
    declare
        v_category_code VARCHAR(100);
        v_category_id BIGINT;
    BEGIN

        RAISE NOTICE '> patrimonial_funds';
        INSERT INTO patrimonial_funds (code, label, created_at, updated_at)
        VALUES
            ('BBVA', 'BBVA', NOW(), NOW()),
            ('N26', 'N26', NOW(), NOW()),
            ('PORTAFOGLIO', 'PORTAFOGLIO', NOW(), NOW()),
            ('HYPE', 'HYPE', NOW(), NOW()),
            ('MEDIOLANUM', 'MEDIOLANUM', NOW(), NOW()),
            ('RISPARMI', 'RISPARMI', NOW(), NOW()),
            ('SATISPAY', 'SATISPAY', NOW(), NOW()),
            ('POSTA', 'POSTA', NOW(), NOW()),
            ('INVESTIMENTI', 'INVESTIMENTI', NOW(), NOW());

        RAISE NOTICE '> initial funds amounts';
        INSERT INTO MOVEMENTS (dt, fk_economic_account, note, fk_patrimonial_fund, amount, created_at, updated_at, block_id)
        VALUES
            ('2025-05-24 20:00:00+00', NULL, 'Saldo iniziale',
             ( select id from patrimonial_funds where code= 'BBVA' ),
             31620.11, NOW(), NOW(), 1),
            ('2025-05-24 20:00:00+00', NULL, 'Saldo iniziale',
             ( select id from patrimonial_funds where code= 'N26' ),
             1110.50, NOW(), NOW(), 2),
            ('2025-05-24 20:00:00+00', NULL, 'Saldo iniziale',
             ( select id from patrimonial_funds where code= 'PORTAFOGLIO' ),
             37.00, NOW(), NOW(), 3),
            ('2025-05-24 20:00:00+00', NULL, 'Saldo iniziale',
             ( select id from patrimonial_funds where code= 'HYPE' ),
             398.55, NOW(), NOW(), 4),
            ('2025-05-24 20:00:00+00', NULL, 'Saldo iniziale',
             ( select id from patrimonial_funds where code= 'MEDIOLANUM' ),
             79.00, NOW(), NOW(), 5),
            ('2025-05-24 20:00:00+00', NULL, 'Saldo iniziale',
             ( select id from patrimonial_funds where code= 'RISPARMI' ),
             350.00, NOW(), NOW(), 6),
            ('2025-05-24 20:00:00+00', NULL, 'Saldo iniziale',
             ( select id from patrimonial_funds where code= 'SATISPAY'),
             0.00, NOW(), NOW(), 7),
            ('2025-05-24 20:00:00+00', NULL, 'Saldo iniziale',
             ( select id from patrimonial_funds where code= 'POSTA'),
             3210.89, NOW(), NOW(), 8),
            ('2025-05-24 20:00:00+00', NULL, 'Saldo iniziale',
             ( select id from patrimonial_funds where code= 'INVESTIMENTI' ),
             0, NOW(), NOW(), 9);

        RAISE NOTICE '> economic categories';
        INSERT INTO economic_categories (code, label, nature, created_at, updated_at)
        VALUES
            (UPPER('Casa'), 'Casa', 'C', NOW(), NOW()),
            (UPPER('Spesa'), 'Spesa', 'C', NOW(), NOW()),
            (UPPER('Auto'), 'Auto', 'C', NOW(), NOW()),
            (UPPER('Banche'), 'Banche', 'C', NOW(), NOW()),
            (UPPER('Extra'), 'Extra', 'C', NOW(), NOW()),
            (UPPER('Matrimonio'), 'Matrimonio', 'C', NOW(), NOW()),
            (UPPER('Tasse'), 'Tasse', 'C', NOW(), NOW()),
            (UPPER('Tempo_libero'), 'Tempo libero', 'C', NOW(), NOW()),
            (UPPER('Trasporti'), 'Trasporti', 'C', NOW(), NOW()),
            (UPPER('Personale'), 'Personale', 'C', NOW(), NOW());
        INSERT INTO economic_categories (code, label, nature, created_at, updated_at)
        VALUES
            (UPPER('Stipendio'), 'Stipendio', 'R', NOW(), NOW()),
            (UPPER('Regali'), 'Regali', 'R', NOW(), NOW()),
            (UPPER('Rendite'), 'Rendite', 'R', NOW(), NOW()),
            (UPPER('Altri'), 'Altri', 'R', NOW(), NOW());

        COMMIT;

        RAISE NOTICE '> economic accounts';

        -- insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper(''), '');
        v_category_code:=upper('Casa'); -- 6
        SELECT id INTO v_category_id FROM economic_categories WHERE code = v_category_code;
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Affitto'), 'Affitto');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Acqua'), 'Acqua');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Gas'), 'Gas');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Internet'), 'Internet');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Luce'), 'Luce');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Tari'), 'Tari');

        v_category_code:=upper('Spesa'); -- 3
        SELECT id INTO v_category_id FROM economic_categories WHERE code = v_category_code;
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Alimenti'), 'Alimenti');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Varia'), 'Varia');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Accessori_iniziali'), 'Accessori iniziali');

        v_category_code:=upper('Auto'); -- 6
        SELECT id INTO v_category_id FROM economic_categories WHERE code = v_category_code;
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Acquisto'), 'Acquisto');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Assicurazione'), 'Assicurazione');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Bollo'), 'Bollo');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Carburante'), 'Carburante');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Manutenzione'), 'Manutenzione');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Parcheggi'), 'Parcheggi');

        v_category_code:=upper('Banche'); -- 2
        SELECT id INTO v_category_id FROM economic_categories WHERE code = v_category_code;
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Commissioni'), 'Commissioni');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Canoni'), 'Canoni');

        v_category_code:=upper('Extra'); -- 3
        SELECT id INTO v_category_id FROM economic_categories WHERE code = v_category_code;
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Insussistenze'), 'Insussistenze');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Regali'), 'Regali');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Vacanze'), 'Vacanze');

        v_category_code:=upper('Matrimonio'); -- 4
        SELECT id INTO v_category_id FROM economic_categories WHERE code = v_category_code;
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Viaggio'), 'Viaggio');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Cena'), 'Cena');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Fedi'), 'Fedi');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Altro'), 'Altro');

        v_category_code:=upper('Tasse'); -- 2
        SELECT id INTO v_category_id FROM economic_categories WHERE code = v_category_code;
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Caf'), 'Caf');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('F24'), 'F24');

        v_category_code:=upper('Tempo_libero'); -- 3
        SELECT id INTO v_category_id FROM economic_categories WHERE code = v_category_code;
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Accessi'), 'Accessi');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Bar'), 'Bar');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Pasti_fuori'), 'Pasti fuori');

        v_category_code:=upper('Trasporti'); -- 1
        SELECT id INTO v_category_id FROM economic_categories WHERE code = v_category_code;
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Biglietti'), 'Biglietti');

        v_category_code:=upper('Personale'); -- 6
        SELECT id INTO v_category_id FROM economic_categories WHERE code = v_category_code;
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Acquisti_vari'), 'Acquisti vari');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Capelli'), 'Capelli');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('F'), 'F');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Salute'), 'Salute');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Sport'), 'Sport');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Telefono'), 'Telefono');

        v_category_code:=upper('Stipendio'); -- 3
        SELECT id INTO v_category_id FROM economic_categories WHERE code = v_category_code;
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('E4L'), 'E4L');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('GinnerHub'), 'GinnerHub');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('HawkAML'), 'HawkAML');

        v_category_code:=upper('Regali'); -- 3
        SELECT id INTO v_category_id FROM economic_categories WHERE code = v_category_code;
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Mamma'), 'Mamma');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Parenti'), 'Parenti');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Compleanno'), 'Compleanno');

        v_category_code:=upper('Rendite'); -- 1
        SELECT id INTO v_category_id FROM economic_categories WHERE code = v_category_code;
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Interessi_attivi'), 'Interessi attivi');

        v_category_code:=upper('Altri'); -- 2
        SELECT id INTO v_category_id FROM economic_categories WHERE code = v_category_code;
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Rimborsi_vari'), 'Rimborsi vari');
        insert into economic_accounts(fk_economic_category, code, label) values (v_category_id, upper('Sopravvenienze'), 'Sopravvenienze');

        COMMIT;


    END;
$$ LANGUAGE plpgsql;








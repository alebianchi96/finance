@echo off
echo.
@echo ########################################
@echo ######### BUILD PROJECT /ms/ ###########
@echo ########################################
echo.

set baseUrlDb="%cd%/database-prod"
set initDbSql=00_init_ddl.sql
set dockerComposeFile=docker-compose.yml
set baseUrlPlaceholder="zzBASEDIRECTORYzz"
set baseUrlDb="%cd%/database-prod"


:: creo il file che dara il nome a tutto il contesto applicativo
:: creo la directory di base
echo [1] Creazione contesto applicativo e directory per database
echo COMPOSE_PROJECT_NAME=personal_finance_prod > ./.env
mkdir %baseUrlDb%

echo.

:: la sostituisco nel docker-compose.yml
echo [2] Preparazione del file docker-compose.yml
powershell -Command "(Get-Content %dockerComposeFile%) -replace '%baseUrlPlaceholder%', '%baseUrlDb%' | Set-Content temp.txt"
move /Y temp.txt %dockerComposeFile%

echo.

:: lancio dell'applicazione
echo [3] Lancio dell'applicazione
docker compose up -d

echo.

echo [4] Attesa di 60 secondi per l'avvio del database...
timeout /t 60 /nobreak

echo.

:: preparo per l'inizializzazione del database copiando il file SQL da usare
:: inizializzo il db
echo [5] Inizializzazione del database
docker cp 00_init_ddl.sql personal_finance_db_prod:./00_init_ddl.sql
docker exec -it personal_finance_db_prod psql personal_finance_db -U alepf -f /00_init_ddl.sql

echo.

echo [6] Processo finito!

echo.

@echo #####################################################################

echo.

echo [INFORMAZIONI UTILI PER L'APPLICAZIONE]
echo [DB]  Database port=8280
echo [APP] Per accedere all'applicazione, apri il browser e vai su: http://localhost:8281

echo.

@echo #####################################################################
pause
# BUGFIX:
___
### [ ] INSERIMENTO IMPORTO = 0 <br>
Nelle caselle degli importi delle form spesso non viene accettato il valore 0 =>
_Esempio: form dei trasferimenti_ <br>

### [ ] HOVER EFFECT SULLE TABELLE <br>
Manca l'hover effect nelle righe delle tabelle presenti in Dashboard => _Controlla differenze di codice rispetto alle tabelle di amministrazione_  <br>

### [ ] ALWAYS RESTART MS BACKEND <br>
Inserire nel docker-compose.yml _(servizio di Backend)_ l'always restart

# FEATURE:
___
### [ ] FLAG "ESCLUDI DA GESTIONE OPERATIVA" <br>
Nella gestione delle Categorie inserire la gestione di un nuovo flag che consenta
di escludere la categoria che lo presenti a "TRUE" dal computo della gestione economica operativa.
Il default previsto per questo flag è "FALSE". 
Dopo averlo implementato, occorre intervenire sui servizi che restituiscono i dati dei risultati economici
al fine di arricchirli anche dei valori calcolati solo sulla base della gestione operativa.
Tali valori dovranno essere mostrati a FE tra parentesi accanto al loro corrispettivo globale (non solo operativo).
<br>

### [ ] ANDAMENTO ECONOMICO ANNO PER ANNO
_Nuova pagina dedicata ai Report_

### [ ] ANDAMENTO ECONOMICO MESE PER MESE <br>
_Nuova pagina dedicata ai Report_

# DOCUMENTAZIONE (README.md):
___
### [ ] DESCRIZIONE CON SCREENSHOT DEL FUNZIONAMENTO APPLICATIVO <br>
Tour guidato dell'applicazione con screenshots esplicativi 
<br>

### [ ] FILE PER INSTALLAZIONE TRAMITE BASH <br>

### [ ] CONSIGLI SU PROCEDURA DI BACKUP <br>

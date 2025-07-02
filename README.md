how to install

# Creazione app creando build dei progetti in locale 

### Dipendenze necessarie:
- Docker
- Maven
- Java JDK 24

### Steps:
- assicurati che docker sia in esecuzione sul pc
- clona il repository github
- vai nella cartella ./structure/prod_env
- inserisci nel docker-compose al tag "volumes" il path di una cartella realmente esistente sul tuo pc
- lancia 
```sh build_to_production.sh```
- inizializza il database con la serie di script sql presenti in:
  ```./structure/00_init_ddl.sql```
- vai col browser all'indirizzo:
  ```http://localhost:8281/```
- inserisci le categorie d'interesse
  ```Amministrazione > Categorie Economiche```
- inserisci, per ogni categoria, il dettaglio dei conti cui far riferimento
    ```Amministrazione > Conti Economici```
  - inserisci le tue disponibilità iniziali
    ```Amministrazione > Fondi Patrimoniali```

Congratulazioni, sei pronto per iniziare a utilizzare l'applicazione!

# Creazione app usando le immagini online su Docker Hub

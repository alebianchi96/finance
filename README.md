[![Docker][Docker.bdg]][Docker-url]
[![Bash][Bash.bdg]][Bash-url]
[![Postgres][Postgres.bdg]][Postgres-url]
[![React][React.js]][React-url]
[![Springboot][Springboot.bdg]][springboot-url]

# 🚀 Installazione App con Docker

### 🔗 Dipendenze necessarie:
- [![Docker][Docker.bdg]][Docker-url] <br>
    _per info in merito all'installazione consultare i seguenti path: <br>
      - Windows -> https://docs.docker.com/desktop/setup/install/windows-install <br>
      - Linux -> https://docs.docker.com/desktop/setup/install/linux <br>
      - Mac -> https://docs.docker.com/desktop/setup/install/mac-install <br>_

### 📦 Steps di installazione ( Windows ):
- Avviare [![Docker][Docker.bdg]][Docker-url]
- Creare una cartella dedicata al progetto nel proprio filesystem ( attenzione alla variabile ```{nome_utente}``` ):
  - ```C:/Users/{nome_utente}/personal_finance```
- All'interno della stessa cartella, inserire i files di installazione e configurazione recuperati dalla cartella di progetto ```./structure/prod_env/install/microsoft```
  - ```./00_init_ddl.sql```
  - ```./01_install_app.bat```
  - ```./docker-compose.yml```
- Lanciare il file
  - ```01_install_app.bat``` _( basta un click sul file )_
- Attendere la fine del processo...

### 🛠️ Accesso e inizializzazione applicazione:
- Collegarsi con un browser a piacere all'indirizzo:
  ```http://localhost:8281/```
- Inserire le **categorie** d'interesse
  ```Amministrazione > Categorie Economiche```
- Inserire, per ogni **categoria**, il **dettaglio dei conti** cui far riferimento
    ```Amministrazione > Conti Economici```
- Inserire le **disponibilità iniziali**
  ```Amministrazione > Fondi Patrimoniali```

### 🎯 Congratulazioni, sei pronto per iniziare a utilizzare l'applicazione!

___

### 📜 Note finali
- Una volta completata la prima installazione non sarà più necessario ripetere i passaggi di cui sopra.
- Laddove l'indirizzo ```http://localhost:8281/``` non risponda correttamente, accertare il corretto avvio di [![Docker][Docker.bdg]][Docker-url].
- Tutti i dati inseriti nel software verranno salvati solo localmente nella cartella ```C:/Users/{nome_utente}/personal_finance/database-prod``` 

___

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Springboot.bdg]: https://img.shields.io/badge/Springboot-20232A?style=for-the-badge&logo=springboot&logoColor=8dc891
[springboot-url]: https://e7.pngegg.com/pngimages/931/804/png-clipart-spring-framework-software-framework-java-application-framework-web-framework-java-leaf-text-thumbnail.png
[Docker.bdg]: https://img.shields.io/badge/Docker-20232A?style=for-the-badge&logo=docker&logoColor=61DAFB
[Docker-url]: https://w7.pngwing.com/pngs/219/411/png-transparent-docker-logo-kubernetes-microservices-cloud-computing-dockers-logo-text-logo-cloud-computing.png
[Postgres.bdg]: https://img.shields.io/badge/Postgres-20232A?style=for-the-badge&logo=postgresql&logoColor=61DAFB
[Postgres-url]: https://www.postgresql.org/
[Bash.bdg]: https://img.shields.io/badge/Bash-20232A?style=for-the-badge&logo=gnubash&logoColor=D3D3D3
[Bash-url]: https://www.gnu.org/software/bash/

Per ogni Entity da creare occorre:

1. ./entity/**Entity.java
2. ./dto/**Dto.java
3. ./dao/**JpaRepo.java
4. ./adapter/**Adapter.java
5. ./service/**Service.java
6. ./controller/**Controller.java

Per fare tutto in automatico puoi:

A. lanciare il comando singolo attendendo la richiesta dei parametri dalla procedura
```bash
bun run create_entity
```

B. lanciare il comando con i parametri direttamente dalla riga di comando
```bash
bun run create_entity MovementEntity PfEntity movements
```

C. lanciare il comando con i parametri da un file bash come il launch.sh

Dopo aver effettuato la creazione, è necessario seguire le istruzioni
restituite dalla procedura di creazione stessa per sapere dove occorrono implementazioni manuali.

#
# Script per la creazione del pacchetti .jar del progetto di Backend
# contenente anche la compilazione del frontend
#


echo " "
echo "#################################"
echo "######### BUILD PROJECT #########"
echo "#################################"
echo " "


# mostro il .jar creato
echo ">>> ELIMINAZIONE VECCHIE BUILD"
rm -r ../../frontend/dist
rm -r ../../backend/target

echo " "
echo ">>> FRONTEND"
echo "[FE] Starting frontend build..."
cd ../../frontend
bun run build
cd ../structure/prod_env

echo " "
echo ">>> BACKEND"
echo "[BE] Starting backend build..."
cd ../../backend
mvn clean package
cd ../structure/prod_env

# mostro il .jar creato
echo " "
echo ">>> PACCHETTO JAR CREATO"
echo "Path: ./backend/target"
ls -lha ../../backend/target | grep .jar


echo " "
echo "Vuoi creare una nuova immagine docker? [s/N]"
read -r risposta
if [[ "$risposta" =~ ^[sS]$ ]]; then

  echo " "
  echo "Ecco la lista delle immagini docker esistenti a sistema:"
  docker images | grep personal-finance-service
  echo " "
  echo "Questa dovrebbe essere l'ultima versione creata:"
  echo ">> " && cat latest_docker_version.info
  echo "Inserisci di seguito la nuova versione che vuoi creare... (es. 0.0.1):"
  read -r vv

  cd ../../backend
  docker build -t mixer812/personal-finance-service:$vv .
  echo "$vv" > ../structure/prod_env/latest_docker_version.info

  echo "Ecco la lista delle immagini docker per il servizio indicato:"
  docker images | grep personal-finance-service
  echo " "

  echo "Vuoi caricare sul DockerHub la nuova immagine? [s/N]"
  read -r rispostaUpload
  if [[ "$rispostaUpload" =~ ^[sS]$ ]]; then
    docker login
    docker push mixer812/personal-finance-service:$vv
  fi

fi

cd ../structure/prod_env
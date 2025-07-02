echo "#### DOCKER COMPOSE ####"

cat docker-compose.yml | grep -A1 "volumes:"

echo "Hai inserito il path corretto per il volume nel docker-compose (prop. volumes)? [s/N]"
read -r risposta
if [[ "$risposta" =~ ^[nN]$ ]]; then
  echo "Procedi al set e rilancia questo script."
  exit 1
fi


echo "#### FRONTEND ####"
echo "Vuoi eseguire il build FE? [s/N]"
read -r risposta
if [[ "$risposta" =~ ^[sS]$ ]]; then
  echo "[FE] Starting frontend build..."
  cd ../../frontend
  bun run build
  cd ../structure/prod_env
fi

echo "#### BACKEND ####"
echo "Vuoi eseguire il build BE? [s/N]"
read -r risposta
if [[ "$risposta" =~ ^[sS]$ ]]; then
  echo "[BE] Starting backend build..."
  cd ../../backend
  mvn clean package
  cd ../structure/prod_env
fi

echo "#### STOP DEI SERVIZI ####"
docker compose down

echo "#### RIMOZIONE IMMAGINE BACKEND ####"
docker rmi personal_finance_prod-backend

echo "#### AVVIO DEI SERVIZI ####"
docker compose up -d

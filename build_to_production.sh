echo "#### FRONTEND ####"
echo "Vuoi eseguire il build FE? [s/N]"
read -r risposta
if [[ "$risposta" =~ ^[sS]$ ]]; then
  echo "[FE] Starting frontend build..."
  cd ./frontend
  bun run build
  cd ..
fi

echo "#### BACKEND ####"
echo "Vuoi eseguire il build BE? [s/N]"
read -r risposta
if [[ "$risposta" =~ ^[sS]$ ]]; then
  echo "[BE] Starting backend build..."
  cd ./backend
  mvn clean package
  cd ..
fi

echo "#### STOP DEI SERVIZI ####"
docker compose down

echo "#### RIMOZIONE IMMAGINE BACKEND ####"
docker rmi personal_finance_prod-backend


echo "#### AVVIO DEI SERVIZI ####"
docker compose up -d

mysql -u root -padmin -e "CREATE DATABASE IF NOT EXISTS db_challenge_ensolvers;"

cd Backend/backend-java/
mvn spring-boot:run &

sleep 10

mysql -u root -padmin -D db_challenge_ensolvers -e "INSERT INTO roles (name) VALUES ('ROLE_USER');"

cd -
cd ./frontend/
npm install
ng serve --port 4200


echo "Application started successfully"

# chmod +x ./run_app.sh && ./run_app.sh
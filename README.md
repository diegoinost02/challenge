# Requeriments

- Angular 17: For frontend development.
- Node version greater than or equal to 18.13.0.
- MySQL: Ensure it's installed in your system.
- Maven: Make sure it's installed in your system.
- JDK 21: Java Development Kit version 21 or higher installed in your system.
- Spring Tools: Tools for Spring application development.

# Steps

1. You need to configure the username and password of your local MySQL in the application.properties file of the backend-java.

```code
spring.datasource.url=jdbc:mysql://localhost:3306/db_challenge
spring.datasource.username=root
spring.datasource.password=admin
```

2. Also, configure it in the run_app.sh script

```script
mysql -u username -ppassword -e "CREATE DATABASE IF NOT EXISTS db_challenge;"

mysql -u username -ppassword -D db_challenge -e "INSERT INTO roles (name) VALUES ('ROLE_USER');"
```

EXAMPLE:

```script
mysql -u root -padmin -e "CREATE DATABASE IF NOT EXISTS db_challenge;"

mysql -u root -padmin -D db_challenge -e "INSERT INTO roles (name) VALUES ('ROLE_USER');"
```

3. Then, you should run the script (inside 'Challenge' folder):
```script
chmod +x ./run_app.sh && ./run_app.sh
```

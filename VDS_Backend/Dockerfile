# Etapa 1: Construcción
FROM maven:3.9.5-eclipse-temurin-21 AS builder

# Configura el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . .

# Ejecuta Maven para compilar y empaquetar el proyecto
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución
FROM amazoncorretto:21-alpine-jdk

# Configura el directorio de trabajo para la aplicación
WORKDIR /app

# Copia el archivo .jar generado al contenedor final
COPY --from=builder /app/target/vds-backend-0.0.1-SNAPSHOT.jar app.jar

# Ejecuta la aplicación
ENTRYPOINT ["java", "-jar", "/app.jar"]

package com.uoc.tfm.vds_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

/* @SpringBootApplication
public class VdsBackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
							  .directory(System.getProperty("user.dir") + "/VDS_Backend")
							  .ignoreIfMissing()
							  .load();
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
		SpringApplication.run(VdsBackendApplication.class, args);
	}

}
 */

 @SpringBootApplication
public class VdsBackendApplication {

	public static void main(String[] args) {
		// Se cargan las variables desde .env en desarrollo
		String dotenvPath = System.getProperty("user.dir") + "/VDS_Backend";
		if (System.getenv("SPRING_PROFILES_ACTIVE") == null || "dev".equals(System.getenv("SPRING_PROFILES_ACTIVE"))) {
			Dotenv dotenv = Dotenv.configure()
								  .directory(dotenvPath)
								  .ignoreIfMissing()
								  .load();
			dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
		}

		// Se inicia Spring Boot
		SpringApplication.run(VdsBackendApplication.class, args);
	}
}

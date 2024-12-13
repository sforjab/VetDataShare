/* package com.uoc.tfm.vds_backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class MailTestRunner implements CommandLineRunner {

    @Autowired
    private JavaMailSender javaMailSender;

    @Override
    public void run(String... args) throws Exception {
        // Crear mensaje
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo("sergio.forja88@gmail.com"); // Cambia por tu correo personal para pruebas
        mensaje.setSubject("Correo de prueba desde VetDataShare");
        mensaje.setText("¡Hola! Este es un correo de prueba enviado desde tu aplicación.");
        mensaje.setFrom("vetdatashare@gmail.com"); // Tu correo configurado

        // Enviar mensaje
        try {
            javaMailSender.send(mensaje);
            System.out.println("Correo enviado correctamente.");
        } catch (Exception e) {
            System.err.println("Error al enviar correo: " + e.getMessage());
        }
    }
} */


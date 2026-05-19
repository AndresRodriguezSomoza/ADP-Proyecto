package edu.db.com.cewasbackend;

import jakarta.ws.rs.ApplicationPath;

import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.media.multipart.MultiPartFeature;

@ApplicationPath("api")
public class HelloApplication extends ResourceConfig {

    public HelloApplication() {

        // Escanear todos los resources
        packages("edu.db.com.cewasbackend");

        // Habilitar multipart/form-data
        register(MultiPartFeature.class);
    }
}

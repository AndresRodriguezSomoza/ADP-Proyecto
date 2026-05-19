package edu.db.com.cewasbackend.resource;

import edu.db.com.cewasbackend.dto.LoginRequest;
import edu.db.com.cewasbackend.model.Usuario;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UsuarioResource {

    @PersistenceContext(unitName = "CEWAS_PU")
    private EntityManager em;

    @POST
    @Path("login")
    public Response login(LoginRequest request) {

        try {

            List<Usuario> usuarios =
                    em.createQuery(
                            "SELECT u FROM Usuario u WHERE u.correo = :correo",
                            Usuario.class
                    )
                    .setParameter("correo", request.getEmail())
                    .getResultList();

            if (usuarios.isEmpty()) {

                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity("Usuario no encontrado")
                        .build();
            }

            Usuario usuario = usuarios.get(0);

            // temporal sin hash
            if (!usuario.getPassword_hash()
                    .equals(request.getPassword())) {

                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity("Contraseña incorrecta")
                        .build();
            }

            return Response.ok(usuario).build();

        } catch (Exception e) {

            e.printStackTrace();

            return Response.serverError()
                    .entity(e.getMessage())
                    .build();
        }
    }
}

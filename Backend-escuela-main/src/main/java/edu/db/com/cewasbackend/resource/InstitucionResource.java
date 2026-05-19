package edu.db.com.cewasbackend.resource;

import edu.db.com.cewasbackend.model.InstitucionConfig;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


@Path("/institucion")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class InstitucionResource {

    @PersistenceContext(unitName = "CEWAS_PU")
    private EntityManager em;

    // Método para obtener la información actual
    @GET
    public Response obtenerInfo() {
        InstitucionConfig config = em.find(InstitucionConfig.class, 1);
        if (config == null) return Response.status(Response.Status.NOT_FOUND).build();
        return Response.ok(config).build();
    }

    // Método que llamaremos desde el Admin de Angular
    @POST
    @Path("/actualizar")
    @Transactional
    public Response actualizar(InstitucionConfig datos) {
        try {
            // Buscamos el ID 1 que insertamos con el script SQL
            InstitucionConfig actual = em.find(InstitucionConfig.class, 1);

            if (actual != null) {
                actual.setQuienesSomos(datos.getQuienesSomos());
                actual.setMision(datos.getMision());
                actual.setVision(datos.getVision());
                em.merge(actual); // Guarda los cambios en MySQL
                return Response.ok(actual).build();
            }
            return Response.status(Response.Status.NOT_FOUND).build();
        } catch (Exception e) {
            return Response.serverError().entity("Error al actualizar: " + e.getMessage()).build();
        }
    }

}

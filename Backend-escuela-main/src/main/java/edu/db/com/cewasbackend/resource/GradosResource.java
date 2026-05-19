package edu.db.com.cewasbackend.resource;

import edu.db.com.cewasbackend.model.Grado;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("grados")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class GradosResource {

    @PersistenceContext(unitName = "CEWAS_PU")
    private EntityManager em;

    // =========================
    // OBTENER TODOS
    // =========================
    @GET
    public List<Grado> obtenerGrados() {

        return em.createQuery(
                "SELECT g FROM Grado g ORDER BY g.id ASC",
                Grado.class
        ).getResultList();
    }

    // =========================
// CREAR
// =========================
    @POST
    @Transactional
    public Grado crearGrado(Grado data) {

        Grado g = new Grado();

        g.setNombre(data.getNombre());
        g.setDescripcion(data.getDescripcion());
        g.setActivado(true);
        g.setTipo(data.getTipo());

        // TEMPORAL
        g.setIdUsuarioEditor(1);

        em.persist(g);

        return g;
    }

    // =========================
    // ACTUALIZAR
    // =========================
    @PUT
    @Path("{id}")
    @Transactional
    public Grado actualizarGrado(
            @PathParam("id") Integer id,
            Grado data
    ) {

        Grado g = em.find(Grado.class, id);

        if (g == null) {
            throw new NotFoundException("Grado no encontrado");
        }

        g.setNombre(data.getNombre());
        g.setDescripcion(data.getDescripcion());
        g.setActivado(data.getActivado());
        g.setTipo(data.getTipo());

        return em.merge(g);
    }

    // =========================
    // ELIMINAR
    // =========================
    @DELETE
    @Path("{id}")
    @Transactional
    public void eliminarGrado(@PathParam("id") Integer id) {

        Grado g = em.find(Grado.class, id);

        if (g != null) {
            em.remove(g);
        }
    }
}

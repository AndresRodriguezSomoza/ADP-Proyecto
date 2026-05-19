package edu.db.com.cewasbackend.resource;

import edu.db.com.cewasbackend.model.Multimedia;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Path("multimedia")
@Produces(MediaType.APPLICATION_JSON)
public class MultimediaResource {

    @PersistenceContext(unitName = "CEWAS_PU")
    private EntityManager em;

    private static final String RUTA
            = "C:/Users/Andres/Downloads/Unificar/EscuelaManager-main/public/Imagenes/";

    // =========================
    // GET TODAS
    // =========================
    @GET
    public List<Multimedia> obtenerImagenes() {
        return em.createQuery(
                "SELECT m FROM Multimedia m",
                Multimedia.class
        ).getResultList();
    }

    // =========================
    // DELETE (ARREGLA TU ERROR CORS)
    // =========================
    @OPTIONS
    @Path("{id}")
    public Response optionsDelete() {
        return Response.ok().build();
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public Response eliminar(@PathParam("id") Integer id) {

        System.out.println("DELETE RECIBIDO ID: " + id);

        Multimedia m = em.find(Multimedia.class, id);

        if (m == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        em.remove(m);

        return Response.ok().build();
    }

    // =========================
    // UPLOAD
    // =========================
    @POST
    @Path("upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Transactional
    public Response subirImagen(
            @FormDataParam("file") InputStream fileInputStream,
            @FormDataParam("file") FormDataContentDisposition fileMetaData,
            @FormDataParam("seccion") String seccion
    ) {

        try {
            String original = fileMetaData.getFileName();
            String extension = original.substring(original.lastIndexOf("."));

            System.out.println("SECCION RECIBIDA: " + seccion);

            // =========================
            // GALERÍA (MAX 8)
            // =========================
            if (seccion.startsWith("galeria")) {

                List<Multimedia> galeria = em.createQuery(
                        "SELECT m FROM Multimedia m WHERE m.seccion LIKE 'galeria%' ORDER BY m.id_imagen ASC",
                        Multimedia.class
                ).getResultList();

                if (galeria.size() >= 8) {

                    Multimedia viejo = galeria.get(0);

                    Files.deleteIfExists(Paths.get(RUTA + viejo.getRuta_archivo()));

                    em.remove(viejo);
                }

                String nombreArchivo
                        = "galeria_" + System.currentTimeMillis() + extension;

                Files.copy(
                        fileInputStream,
                        Paths.get(RUTA + nombreArchivo),
                        StandardCopyOption.REPLACE_EXISTING
                );

                Multimedia m = new Multimedia();
                m.setSeccion("galeria");
                m.setRuta_archivo(nombreArchivo);
                m.setNombre_original(original);

                em.persist(m);

                return Response.ok("GALERIA OK").build();
            }

            // =========================
            // IDENTIDAD
            // =========================
            List<Multimedia> existentes = em.createQuery(
                    "SELECT m FROM Multimedia m WHERE m.seccion = :sec",
                    Multimedia.class
            ).setParameter("sec", seccion).getResultList();

            Multimedia m;

            if (!existentes.isEmpty()) {
                m = existentes.get(0);
                Files.deleteIfExists(Paths.get(RUTA + m.getRuta_archivo()));
            } else {
                m = new Multimedia();
                m.setSeccion(seccion);
            }

            String nombreArchivo = seccion + extension;

            Files.copy(
                    fileInputStream,
                    Paths.get(RUTA + nombreArchivo),
                    StandardCopyOption.REPLACE_EXISTING
            );

            m.setRuta_archivo(nombreArchivo);
            m.setNombre_original(original);

            if (existentes.isEmpty()) {
                em.persist(m);
            } else {
                em.merge(m);
            }

            return Response.ok("OK").build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().entity(e.getMessage()).build();
        }
    }
}

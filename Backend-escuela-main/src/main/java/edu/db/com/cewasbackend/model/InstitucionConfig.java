package edu.db.com.cewasbackend.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "institucion_config")
public class InstitucionConfig implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_config;

    @Column(name = "quienes_somos", columnDefinition = "TEXT")
    private String quienesSomos;

    @Column(columnDefinition = "TEXT")
    private String mision;

    @Column(columnDefinition = "TEXT")
    private String vision;

    // Constructor vacío (Obligatorio para JPA)
    public InstitucionConfig() {}

    // Getters y Setters
    public Integer getId_config() { return id_config; }
    public void setId_config(Integer id_config) { this.id_config = id_config; }
    public String getQuienesSomos() { return quienesSomos; }
    public void setQuienesSomos(String quienesSomos) { this.quienesSomos = quienesSomos; }
    public String getMision() { return mision; }
    public void setMision(String mision) { this.mision = mision; }
    public String getVision() { return vision; }
    public void setVision(String vision) { this.vision = vision; }



}

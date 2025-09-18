package com.plantmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "diseases")
@Data
public class Disease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Lob
    private String description;

    @Lob
    private String symptoms;

    private String cause;

    @Lob
    private String prevention;

    @Lob
    private String treatment;

    private String severity;

    @Column(name = "affected_plants")
    private String affectedPlants;
}
package com.plantmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "medicines")
@Data
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String type;

    @Column(name = "active_ingredient")
    private String activeIngredient;

    @Lob
    private String description;

    private String dosage;

    @Column(name = "application_method")
    private String applicationMethod;

    @Column(name = "target_diseases")
    private String targetDiseases;

    @Lob
    @Column(name = "safety_instructions")
    private String safetyInstructions;

    private String manufacturer;
}
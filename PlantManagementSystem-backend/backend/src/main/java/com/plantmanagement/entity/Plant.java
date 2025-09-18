package com.plantmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "plants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "scientific_name")
    private String scientificName;

    @Column(nullable = false)
    private String category;

    @Lob
    private String description;

    @Column(name = "growth_season")
    private String growthSeason;

    @Column(name = "growth_rate")
    private String growthRate;

    @Column(name = "water_requirements")
    private String waterRequirements;

    @Column(name = "light_requirements")
    private String lightRequirements;

    @Column(name = "soil_type")
    private String soilType;

    @Lob
    private String careInstructions;
}
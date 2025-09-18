package com.plantmanagement.controller;

import com.plantmanagement.entity.Plant;
import com.plantmanagement.service.PlantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plants")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8081")
public class PlantController {

    private final PlantService plantService;

    @GetMapping
    public ResponseEntity<List<Plant>> getAllPlants() {
        return ResponseEntity.ok(plantService.getAllPlants());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Plant> createPlant(@RequestBody Plant plant) {
        return ResponseEntity.ok(plantService.createPlant(plant));
    }
}
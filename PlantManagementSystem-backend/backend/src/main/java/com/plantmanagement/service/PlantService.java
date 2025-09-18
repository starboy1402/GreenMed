package com.plantmanagement.service;

import com.plantmanagement.entity.Plant;
import com.plantmanagement.repository.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlantService {

    private final PlantRepository plantRepository;

    public List<Plant> getAllPlants() {
        return plantRepository.findAll();
    }

    public Plant createPlant(Plant plant) {
        return plantRepository.save(plant);
    }
}
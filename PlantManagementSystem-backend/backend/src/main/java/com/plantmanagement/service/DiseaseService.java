package com.plantmanagement.service;

import com.plantmanagement.entity.Disease;
import com.plantmanagement.repository.DiseaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DiseaseService {

    private final DiseaseRepository diseaseRepository;

    public List<Disease> getAllDiseases() {
        return diseaseRepository.findAll();
    }

    public Disease createDisease(Disease disease) {
        return diseaseRepository.save(disease);
    }
}
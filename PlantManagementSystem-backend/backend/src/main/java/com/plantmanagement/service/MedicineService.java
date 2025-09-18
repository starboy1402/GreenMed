package com.plantmanagement.service;

import com.plantmanagement.entity.Medicine;
import com.plantmanagement.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Medicine createMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }
}
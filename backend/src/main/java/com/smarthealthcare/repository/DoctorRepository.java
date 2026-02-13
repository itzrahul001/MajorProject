package com.smarthealthcare.repository;

import com.smarthealthcare.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByHospitalId(Long hospitalId);

    List<Doctor> findBySpecializationContaining(String specialization);
}

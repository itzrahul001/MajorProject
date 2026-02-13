package com.smarthealthcare.service.impl;

import com.smarthealthcare.dto.DoctorDto;
import com.smarthealthcare.entity.Doctor;
import com.smarthealthcare.entity.Hospital;
import com.smarthealthcare.exception.ResourceNotFoundException;
import com.smarthealthcare.repository.DoctorRepository;
import com.smarthealthcare.repository.HospitalRepository;
import com.smarthealthcare.service.DoctorService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    private DoctorRepository doctorRepository;
    private HospitalRepository hospitalRepository;
    private ModelMapper modelMapper;

    public DoctorServiceImpl(DoctorRepository doctorRepository, HospitalRepository hospitalRepository,
            ModelMapper modelMapper) {
        this.doctorRepository = doctorRepository;
        this.hospitalRepository = hospitalRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public DoctorDto createDoctor(DoctorDto doctorDto) {
        Hospital hospital = hospitalRepository.findById(doctorDto.getHospitalId())
                .orElseThrow(() -> new ResourceNotFoundException("Hospital", "id", doctorDto.getHospitalId()));

        Doctor doctor = modelMapper.map(doctorDto, Doctor.class);
        doctor.setHospital(hospital);

        Doctor savedDoctor = doctorRepository.save(doctor);

        DoctorDto savedDoctorDto = modelMapper.map(savedDoctor, DoctorDto.class);
        savedDoctorDto.setHospitalId(hospital.getId());

        return savedDoctorDto;
    }

    @Override
    public DoctorDto getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        DoctorDto doctorDto = modelMapper.map(doctor, DoctorDto.class);
        doctorDto.setHospitalId(doctor.getHospital().getId());
        return doctorDto;
    }

    @Override
    public List<DoctorDto> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return doctors.stream().map(doctor -> {
            DoctorDto dto = modelMapper.map(doctor, DoctorDto.class);
            dto.setHospitalId(doctor.getHospital().getId());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<DoctorDto> getDoctorsByHospital(Long hospitalId) {
        List<Doctor> doctors = doctorRepository.findByHospitalId(hospitalId);
        return doctors.stream().map(doctor -> {
            DoctorDto dto = modelMapper.map(doctor, DoctorDto.class);
            dto.setHospitalId(doctor.getHospital().getId());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public DoctorDto updateDoctor(Long id, DoctorDto doctorDto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));

        if (doctorDto.getHospitalId() != null) {
            Hospital hospital = hospitalRepository.findById(doctorDto.getHospitalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hospital", "id", doctorDto.getHospitalId()));
            doctor.setHospital(hospital);
        }

        doctor.setName(doctorDto.getName());
        doctor.setSpecialization(doctorDto.getSpecialization());

        Doctor updatedDoctor = doctorRepository.save(doctor);
        DoctorDto updatedDto = modelMapper.map(updatedDoctor, DoctorDto.class);
        updatedDto.setHospitalId(updatedDoctor.getHospital().getId());
        return updatedDto;
    }

    @Override
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        doctorRepository.delete(doctor);
    }
}

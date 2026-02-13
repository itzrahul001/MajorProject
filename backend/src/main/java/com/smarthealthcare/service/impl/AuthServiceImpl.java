package com.smarthealthcare.service.impl;

import com.smarthealthcare.dto.LoginDto;
import com.smarthealthcare.dto.RegisterDto;
import com.smarthealthcare.entity.User;
import com.smarthealthcare.exception.APIException;
import com.smarthealthcare.repository.UserRepository;
import com.smarthealthcare.security.JwtTokenProvider;
import com.smarthealthcare.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;
    private com.smarthealthcare.repository.DoctorRepository doctorRepository;
    private com.smarthealthcare.repository.HospitalRepository hospitalRepository;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            com.smarthealthcare.repository.DoctorRepository doctorRepository,
            com.smarthealthcare.repository.HospitalRepository hospitalRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.doctorRepository = doctorRepository;
        this.hospitalRepository = hospitalRepository;
    }

    @Override
    public String login(LoginDto loginDto) {

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getEmail(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        return token;
    }

    @Override
    public String register(RegisterDto registerDto) {

        // check for email exists in database
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Email is already exists!.");
        }

        User user = new User();
        user.setName(registerDto.getName());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRole(registerDto.getRole());

        userRepository.save(user);

        // If the user is registering as a DOCTOR, create a Doctor entity
        if (registerDto.getRole() == com.smarthealthcare.entity.Role.DOCTOR) {
            // Validate that hospitalId and specialization are provided
            if (registerDto.getHospitalId() == null || registerDto.getSpecialization() == null
                    || registerDto.getSpecialization().isEmpty()) {
                throw new APIException(HttpStatus.BAD_REQUEST,
                        "Hospital and Specialization are required for Doctor registration.");
            }

            // Fetch the hospital
            com.smarthealthcare.entity.Hospital hospital = hospitalRepository.findById(registerDto.getHospitalId())
                    .orElseThrow(() -> new APIException(HttpStatus.BAD_REQUEST,
                            "Hospital not found with ID: " + registerDto.getHospitalId()));

            // Create Doctor entity
            com.smarthealthcare.entity.Doctor doctor = new com.smarthealthcare.entity.Doctor();
            doctor.setName(user.getName());
            doctor.setSpecialization(registerDto.getSpecialization());
            doctor.setHospital(hospital);
            doctor.setUser(user);

            doctorRepository.save(doctor);
        }

        return "User registered successfully!.";
    }
}

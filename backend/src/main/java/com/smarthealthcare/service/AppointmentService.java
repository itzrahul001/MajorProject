package com.smarthealthcare.service;

import com.smarthealthcare.dto.AppointmentDto;
import java.util.List;

public interface AppointmentService {
    AppointmentDto bookAppointment(AppointmentDto appointmentDto);

    AppointmentDto getAppointmentById(Long id);

    List<AppointmentDto> getAppointmentsByPatient(Long patientId);

    List<AppointmentDto> getAppointmentsByDoctor(Long doctorId);

    AppointmentDto cancelAppointment(Long id);
    // Add logic to check slot availability later
}

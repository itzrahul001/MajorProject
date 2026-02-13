package com.smarthealthcare.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService() {
        // You should move these to application.properties and inject them
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "djow7yqxw",
                "api_key", "634915868694885",
                "api_secret", "6FC24_k8S5TAewp5V9WhwSZeXsg"));
    }

    public String uploadFile(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed");
        }
    }
}

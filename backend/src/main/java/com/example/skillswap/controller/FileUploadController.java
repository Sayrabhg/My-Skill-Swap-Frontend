package com.example.skillswap.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.skillswap.service.FileUploadService;

@RestController
@RequestMapping("/api/files")
@CrossOrigin("*")
public class FileUploadController {

    @Autowired
    private FileUploadService service;

    // ✅ IMAGE API
    @PostMapping("/upload/image")
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        return service.uploadImage(file);
    }

    // ✅ PDF API
    @PostMapping("/upload/pdf")
    public String uploadPdf(@RequestParam("file") MultipartFile file) {
        return service.uploadPdf(file);
    }
}
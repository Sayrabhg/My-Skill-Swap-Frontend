package com.example.skillswap.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.skillswap.model.User;
import com.example.skillswap.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class FileUploadService {

    @Autowired
    private Cloudinary cloudinary;
    
    @Autowired
    private UserRepository userRepository;

    // ✅ Upload User Avatar & Save in DB
    public String uploadUserAvatarByEmail(String email, MultipartFile file) {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String type = file.getContentType();

        if (type == null || !(type.equals("image/png") ||
                              type.equals("image/jpeg"))) {
            throw new RuntimeException("Only PNG/JPEG images allowed");
        }

        try {
            // 🔥 Generate custom filename
            String fileName = file.getOriginalFilename();

            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "auto",
                            "folder", "myskillswap/avatars",
                            "public_id", fileName   // ✅ store name in cloud
                    )
            );

            String imageUrl = uploadResult.get("secure_url").toString();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // ✅ Save URL + Name
            user.setAvatar(imageUrl);
            user.setAvatarName(fileName);

            userRepository.save(user);

            return imageUrl;

        } catch (Exception e) {
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }
    
    public String uploadUserBgImage(String email, MultipartFile file) {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String type = file.getContentType();

        if (type == null || !(type.equals("image/png") ||
                              type.equals("image/jpeg"))) {
            throw new RuntimeException("Only PNG/JPEG images allowed");
        }

        try {
            // 🔥 Get original name
            String originalName = file.getOriginalFilename();

            String nameWithoutExt = originalName != null
                    ? originalName.replaceAll("(?i)\\.(png|jpg|jpeg)$", "")
                    : "bg_image";

            // (optional) add timestamp to avoid overwrite
            String fileName = nameWithoutExt;

            // 🔥 Upload to Cloudinary
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "auto",
                            "folder", "myskillswap/backgrounds",
                            "public_id", fileName
                    )
            );

            String imageUrl = uploadResult.get("secure_url").toString();

            // 🔥 Save to DB
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            user.setBgImg(imageUrl);
            user.setBgImgName(fileName);

            userRepository.save(user);

            return imageUrl;

        } catch (Exception e) {
            throw new RuntimeException("Background upload failed: " + e.getMessage());
        }
    }
    
    public String uploadUserPdf(String email, MultipartFile file) {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String type = file.getContentType();
        if (type == null || !type.equals("application/pdf")) {
            throw new RuntimeException("Only PDF files allowed");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File too large (Max 10MB)");
        }

        try {
            // ✅ Get original filename
            String originalName = file.getOriginalFilename();

            // ✅ Remove .pdf and sanitize
            String cleanName = (originalName != null)
                    ? originalName.replaceAll("\\.pdf$", "")
                                  .replaceAll("[^a-zA-Z0-9]", "_")
                    : "resume";

            // ✅ Use original filename as public_id
            String publicId = cleanName;

            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "raw",
                            "folder", "myskillswap/pdfs",
                            "public_id", publicId,
                            "format", "pdf",
                            "type", "upload",
                            "access_mode", "public"
                    )
            );

            String pdfUrl = uploadResult.get("secure_url").toString()
                    .replace("/image/upload/", "/raw/upload/");

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            user.setResumePdf(pdfUrl);
            user.setResumePdfName(cleanName + ".pdf");

            userRepository.save(user);

            return pdfUrl;

        } catch (Exception e) {
            throw new RuntimeException("PDF upload failed: " + e.getMessage());
        }
    }
    
    // ✅ IMAGE UPLOAD
    public String uploadImage(MultipartFile file) {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String type = file.getContentType();

        if (type == null || !(type.equals("image/png") ||
                              type.equals("image/jpeg"))) {
            throw new RuntimeException("Only PNG/JPEG images allowed");
        }

        return uploadToCloudinary(file, "myskillswap/images");
    }

    // ✅ PDF UPLOAD
    public String uploadPdf(MultipartFile file) {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String type = file.getContentType();

        if (type == null || !type.equals("application/pdf")) {
            throw new RuntimeException("Only PDF allowed");
        }

        return uploadToCloudinary(file, "myskillswap/pdfs");
    }

    // 🔁 COMMON METHOD
    private String uploadToCloudinary(MultipartFile file, String folderName) {
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "auto",
                            "folder", folderName   // ✅ folder added here
                    )
            );

            return uploadResult.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }
}
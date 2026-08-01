package com.example.demo;

import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class ImageUploadService {

    public String processAndSaveImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // ./uploads/ फोल्डर नभए आफैँ बनाउने
        String uploadDir = "./uploads/";
        File uploadFolder = new File(uploadDir);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        // युनिक फाइल नेम बनाउने
        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        File destinationFile = new File(uploadDir + uniqueFileName);

        // Thumbnailator मार्फत इमेज क्रप, रिसाइज र कम्प्रेस गर्ने
        Thumbnails.of(file.getInputStream())
                .size(800, 600)
                .crop(Positions.TOP_CENTER)
                .outputQuality(0.8)
                .keepAspectRatio(true)
                .toFile(destinationFile);

        return "/uploads/" + uniqueFileName;
    }
}
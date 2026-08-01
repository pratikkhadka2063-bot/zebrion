package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "*")
public class ArticleController {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    // १. सबै आर्टिकल लिस्ट तान्ने
    @GetMapping
    public List<Article> getAll() {
        return articleRepository.findAll();
    }

    // २. सर्च गर्ने
    @GetMapping("/search")
    public List<Article> searchArticles(@RequestParam("query") String query) {
        if (query == null || query.trim().isEmpty()) {
            return articleRepository.findAll(); 
        }
        return articleRepository.searchArticlesByKeyword(query.trim());
    }

    // ३. सेभ गर्ने
    @PostMapping("/save")
    public Article save(@RequestBody Article article) {
        if (article.getId() == null) {
            article.setCreatedAt(LocalDateTime.now());
        }
        return articleRepository.save(article);
    }

    // ४. फाइलसहित आर्टिकल सेभ गर्ने (मुख्य तस्बिर क्रप हुने र Tags सहित)
    @PostMapping("/save-with-file")
    public ResponseEntity<?> saveArticleWithFile(
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            @RequestParam("category") String category,
            @RequestParam("summary") String summary,
            @RequestParam("content") String content,
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestParam(value = "imageFile2", required = false) MultipartFile imageFile2,
            @RequestParam(value = "imageFile3", required = false) MultipartFile imageFile3,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "slug", required = false) String slug,
            @RequestParam(value = "tags", required = false) String tags) { // 🎯 यहाँको कमा र ब्र्याकेट मिलाइयो
           
        try {
            Article article;
            if (id != null) {
                article = articleRepository.findById(id).orElse(new Article());
            } else {
                article = new Article();
                article.setCreatedAt(LocalDateTime.now());
            }

            article.setTitle(title);
            article.setAuthor(author);
            article.setCategory(category);
            article.setSummary(summary);
            article.setContent(content);
            article.setTags(tags); // 🎯 सही ठाउँमा Tags सेट गरियो
            article.setStatus(status != null ? status : "draft");   // default draft
article.setSlug(slug);

            // मुख्य तस्बिरमा ImageUploadService मार्फत क्रप लजिक लागू गरिएको
            if (imageFile != null && !imageFile.isEmpty()) {
                String croppedImagePath = imageUploadService.processAndSaveImage(imageFile);
                article.setImage(croppedImagePath);
            }

            // अन्य थप तस्बिरहरू २ र ३
            if (imageFile2 != null && !imageFile2.isEmpty()) {
                String imagePath2 = saveUploadedFile(imageFile2);
                article.setImage2(imagePath2);
            }

            if (imageFile3 != null && !imageFile3.isEmpty()) {
                String imagePath3 = saveUploadedFile(imageFile3);
                article.setImage3(imagePath3);
            }

            articleRepository.save(article);
            return ResponseEntity.ok("Article saved with local files successfully!");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("File operational upload failure: " + e.getMessage());
        }
    }

    // ५. डिलेट गर्ने
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        articleRepository.deleteById(id);
    }
    // ७. आर्टिकल हेर्दा Views १ ले बढाउने API
    @PostMapping("/view/{id}")
    public ResponseEntity<?> incrementViews(@PathVariable Long id) {
        return articleRepository.findById(id).map(article -> {
            article.setViews(article.getViews() + 1);
            articleRepository.save(article);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // ६. अन्य फाइल सेभ गर्ने मेथड
    private String saveUploadedFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String uploadDir = "./uploads/";
        File uploadFolder = new File(uploadDir);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs(); 
        }

        String originalFileName = file.getOriginalFilename();
        String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;

        Path targetPath = Paths.get(uploadDir + uniqueFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + uniqueFileName;
    }
}
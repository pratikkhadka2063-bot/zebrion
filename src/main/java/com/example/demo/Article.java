package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "articles")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String author;
    private String date;
    private String category; // क्याटेगोरी फिल्ड
    private String status;   // "draft" or "published" – default "draft"
    private String slug;     // URL-friendly string, e.g. "future-of-ai"
    
    @Column(columnDefinition = "TEXT")
    private String summary;
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private String image;
    private String image2;
    private String image3;
    
    private int views = 0; 
    private String tags;// भ्युज ट्र्याक गर्न
    private LocalDateTime createdAt;  // समय ट्र्याक गर्न

   public String getTags() { return tags; }
   public void setTags(String tags) { this.tags = tags; }

    // --- Standard Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    // 🌟 CATEGORY GETTER (यो थपियो)
    public String getCategory() { return category; }
    // 🌟 CATEGORY SETTER (यो थपियो)
    public void setCategory(String category) { this.category = category; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getImage2() { return image2; }
    public void setImage2(String image2) { this.image2 = image2; }

    public String getImage3() { return image3; }
    public void setImage3(String image3) { this.image3 = image3; }

    public int getViews() { return views; }
    public void setViews(int views) { this.views = views; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
   
    public String getStatus() { return status; }
public void setStatus(String status) { this.status = status; }

public String getSlug() { return slug; }
public void setSlug(String slug) { this.slug = slug; }
}
package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    
    // 🎯 SEO र Hashtags समेत खोज्ने पूर्ण र शुद्ध क्वेरी
    @Query(value = "SELECT * FROM articles WHERE " +
                   "LOWER(title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
                   "LOWER(summary) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
                   "LOWER(category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
                   "LOWER(tags) LIKE LOWER(CONCAT('%', :query, '%'))", 
           nativeQuery = true)
    List<Article> searchArticlesByKeyword(@Param("query") String query);
    List<Article> findByStatus(String status);
}

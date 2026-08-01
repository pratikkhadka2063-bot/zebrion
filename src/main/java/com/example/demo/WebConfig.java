package com.example.demo;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // बाहिरी './uploads/' फोल्डरलाई ब्राउजरको /uploads/** URL सँग सिधै लिंक गर्ने म्याजिक कमाण्ड
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./uploads/");
    }
}
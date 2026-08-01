package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public String login(@RequestBody User loginRequest) {
        Optional<User> user = userRepository.findByUsername(loginRequest.getUsername());

        if (user.isPresent() && user.get().getPassword().equals(loginRequest.getPassword())) {
            return "{\"status\": \"success\", \"message\": \"Login successful!\"}";
        } else {
            return "{\"status\": \"error\", \"message\": \"Milyena password athawa username!\"}";
        }
    }
    // नयाँ युजर दर्ता (Signup) गर्ने API
    @PostMapping("/signup")
    public String signup(@RequestBody User signupRequest) {
        // यदि यो युजरनेम पहिल्यै छ भने एरर दिने
        if (userRepository.findByUsername(signupRequest.getUsername()).isPresent()) {
            return "{\"status\": \"error\", \"message\": \"यो User Username पहिल्यै छ! अर्को रोज्नुहोस्।\"}";
        }
        
        // नयाँ युजर डेटाबेसमा सेभ गर्ने
        User newUser = new User();
        newUser.setUsername(signupRequest.getUsername());
        newUser.setPassword(signupRequest.getPassword()); // रियल प्रोजेक्टमा यसलाई इन्क्रिप्ट गरिन्छ
        userRepository.save(newUser);
        
        return "{\"status\": \"success\", \"message\": \"Signup सफल भयो! अब Login गर्न सक्नुहुन्छ।\"}";
    }
}
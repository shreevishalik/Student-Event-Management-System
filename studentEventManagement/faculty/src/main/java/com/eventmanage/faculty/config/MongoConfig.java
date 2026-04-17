package com.eventmanage.faculty.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.ConnectionString;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoConfig {

    @Bean
    public MongoTemplate mongoTemplate() {
        ConnectionString connectionString = new ConnectionString("mongodb://localhost:27017/faculty_db");
        MongoClient mongoClient = MongoClients.create(connectionString);
        return new MongoTemplate(mongoClient, "faculty_db");
    }
}

package com.example.skillswap.config;

import org.springframework.stereotype.Component;

import com.example.skillswap.model.ChatMessage;

import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Component
public class ChatMessageListener extends AbstractMongoEventListener<ChatMessage> {

    @Override
    public void onBeforeConvert(BeforeConvertEvent<ChatMessage> event) {
        ChatMessage message = event.getSource();
        if (message.getDate() == null) message.setDate(LocalDate.now());
        if (message.getTime() == null) 
            message.setTime(LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
    }
}
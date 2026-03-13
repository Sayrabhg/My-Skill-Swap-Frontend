package com.example.skillswap.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.skillswap.model.Contact;
import com.example.skillswap.service.ContactService;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin("*")
public class ContactController {

    @Autowired
    private ContactService contactService;

    // Save Contact Message
    @PostMapping("/create")
    public Contact createContact(@RequestBody Contact contact) {
        return contactService.saveContact(contact);
    }

    // Get All Contact Messages
    @PreAuthorize("hasAnyRole('ADMIN','MODERATOR')")
    @GetMapping("/all")
    public List<Contact> getAllContacts() {
        return contactService.getAllContacts();
    }
    
    // Delete a contact message by ID (Admin/Moderator only)
    @PreAuthorize("hasAnyRole('ADMIN','MODERATOR')")
    @DeleteMapping("/delete/{id}")
    public void deleteContact(@PathVariable String id) {
        contactService.deleteContactById(id);
    }
}
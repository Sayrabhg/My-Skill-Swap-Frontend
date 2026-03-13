package com.example.skillswap.service;

import java.util.List;
import com.example.skillswap.model.Contact;

public interface ContactService {

    Contact saveContact(Contact contact);

    List<Contact> getAllContacts();

}
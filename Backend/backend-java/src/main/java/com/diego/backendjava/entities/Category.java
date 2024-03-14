package com.diego.backendjava.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @ManyToOne
    @JsonIgnoreProperties({"username", "notes", "categories", "roles", "handler", "hibernateLazyInitializer"})
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JsonIgnoreProperties({"categories", "handler", "hibernateLazyInitializer"})
    @JoinTable(
            name = "notes_categories",
            joinColumns = @JoinColumn(name = "note_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"),
            uniqueConstraints = {@UniqueConstraint(columnNames = {"note_id", "category_id"}) }
    )
    private List<Note> notes;


    public Category() {
        this.notes = new ArrayList<>();
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public List<Note> getNotes() {
        return notes;
    }
    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }
}

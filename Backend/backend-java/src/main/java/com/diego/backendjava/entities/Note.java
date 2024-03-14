package com.diego.backendjava.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String description;

    @ManyToOne
    @JsonIgnoreProperties({"username", "notes", "categories", "roles", "handler", "hibernateLazyInitializer"})
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JsonIgnoreProperties({"notes", "handler", "hibernateLazyInitializer"})
    @JoinTable(
        name = "notes_categories",
        joinColumns = @JoinColumn(name = "note_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id"),
        uniqueConstraints = {@UniqueConstraint(columnNames = {"note_id", "category_id"}) }
    )
    private List<Category> categories;

    public Note() {
        this.categories = new ArrayList<>();
    }
    private boolean enabled;

    @PrePersist
    public void prePersist() {
        this.enabled = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}

package com.diego.backendjava.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diego.backendjava.entities.Note;
import com.diego.backendjava.services.NoteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@Valid @RequestBody @NonNull Note note, BindingResult result) {
        if(result.hasFieldErrors()){
            return this.validation(result);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(this.noteService.save(note));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Note note, BindingResult result) {
        if(result.hasFieldErrors()){
            return this.validation(result);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(this.noteService.update(id, note));
    }

    @GetMapping("/user/{userId}")
    public List<Note> listByUserId(@PathVariable @NonNull Long userId) {
        return this.noteService.findAllByUserId(userId);
    }

    @GetMapping("/user/{userId}/archive")
    public List<Note> listArchivedByUserId(@PathVariable @NonNull Long userId) {
        return this.noteService.findAllArchiverByUserId(userId);
    }

    @GetMapping("/user/{userId}/category/{categoryId}")
    public List<Note> listByUserIdAndCategory(@PathVariable @NonNull Long userId, @PathVariable @NonNull Long categoryId) {
        return this.noteService.findAllByCategoryId(userId, categoryId);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable @NonNull Long id) {
        this.noteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<?> validation(BindingResult result) {
        Map<String, String> errors = new HashMap<>();

        result.getFieldErrors().forEach(err -> {
            errors.put(err.getField(), "Error: " + err.getField() + " " + err.getDefaultMessage());
        });

        return ResponseEntity.badRequest().body(errors);
    }
}

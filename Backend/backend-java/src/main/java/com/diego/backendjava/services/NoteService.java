package com.diego.backendjava.services;

import com.diego.backendjava.entities.Note;
import com.diego.backendjava.repositories.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Transactional(readOnly = true)
    public List<Note> findAll() {
        return (List<Note>) noteRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Note> findAllByUserId(@NonNull Long userId) {
        return (List<Note>) noteRepository.findAllByUserIdAndEnabled(userId, true);
    }

    @Transactional(readOnly = true)
    public List<Note> findAllArchiverByUserId(@NonNull Long userId) {
        return (List<Note>) noteRepository.findAllByUserIdAndEnabled(userId, false);
    }

    @Transactional(readOnly = true)
    public List<Note> findAllByCategoryId(@NonNull Long userId, @NonNull Long categoryId) {
        return (List<Note>) noteRepository.findAllByUserIdAndCategoriesId(userId, categoryId);
    }

    @Transactional
    public Note save(@NonNull Note note) {
        return noteRepository.save(note);
    }

    @Transactional
    public Optional<Note> update(@NonNull Long id, Note note) {
        Optional<Note> noteOptional = this.noteRepository.findById(id);
        if(noteOptional.isPresent()) {
            Note noteDb = noteOptional.orElseThrow();
            noteDb.setDescription(note.getDescription());
            noteDb.setCategories(note.getCategories());
            noteDb.setEnabled(note.isEnabled());
            return Optional.of(this.noteRepository.save(noteDb));
        }
        return noteOptional;
    }

    @Transactional
    public Optional<Note> delete(@NonNull Long id) {
        Optional<Note> noteOptional = this.noteRepository.findById(id);
        noteOptional.ifPresent(noteDb -> {
                this.noteRepository.delete(noteDb);
        });
        return noteOptional;
    }
}

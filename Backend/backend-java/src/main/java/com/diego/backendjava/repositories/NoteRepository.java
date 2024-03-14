package com.diego.backendjava.repositories;

import com.diego.backendjava.entities.Note;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface NoteRepository extends CrudRepository<Note, Long>{
    
    List<Note> findAllByUserIdAndEnabled(Long userId, boolean enabled);
    List<Note> findAllByUserIdAndCategoriesId(Long userId, Long id);
}

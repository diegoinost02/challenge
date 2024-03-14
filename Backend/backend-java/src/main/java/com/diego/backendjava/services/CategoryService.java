package com.diego.backendjava.services;

import com.diego.backendjava.entities.Category;
import com.diego.backendjava.repositories.CategoryRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<Category> findAllByUserId(@NonNull Long userId) {
        return (List<Category>) categoryRepository.findAllByUserId(userId);
    }

    @Transactional
    public Category save(@NonNull Category category) {
        return categoryRepository.save(category);
    }

    @Transactional
    public void delete(@NonNull Long id) {
        categoryRepository.deleteById(id);
    }
}

package com.diego.backendjava.repositories;

import com.diego.backendjava.entities.Category;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface CategoryRepository extends CrudRepository<Category, Long>{
    List<Category> findAllByUserId(Long userId);
}

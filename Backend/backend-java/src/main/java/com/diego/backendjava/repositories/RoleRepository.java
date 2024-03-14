package com.diego.backendjava.repositories;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import com.diego.backendjava.entities.Role;

public interface RoleRepository extends CrudRepository<Role, Long>{

    Optional<Role> findByName(String name);
}

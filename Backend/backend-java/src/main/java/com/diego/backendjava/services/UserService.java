package com.diego.backendjava.services;

import com.diego.backendjava.entities.Role;
import com.diego.backendjava.entities.User;
import com.diego.backendjava.repositories.RoleRepository;
import com.diego.backendjava.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;
    
     @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        if(username == null) {
            return Optional.empty();
        }
        return this.userRepository.findByUsername(username);
    }

    @Transactional
    public User save(@NonNull User user) {
        Optional<Role> roleOptional = this.roleRepository.findByName("ROLE_USER");
        List<Role> roles = new ArrayList<>();

        user.setRoles(roles);
        roleOptional.ifPresent(role -> roles.add(role));

        user.setPassword(this.passwordEncoder.encode(user.getPassword()));
        return this.userRepository.save(user);
    }

    @SuppressWarnings("null")
    @Transactional
    public Optional<User> delete(@NonNull Long id) {
        Optional<User> userOptional = this.userRepository.findById(id);
        userOptional.ifPresent(userDb -> {
                this.userRepository.delete(userDb);
        });
        return userOptional;
    }

}

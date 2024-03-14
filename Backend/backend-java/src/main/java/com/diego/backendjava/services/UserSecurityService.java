package com.diego.backendjava.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.diego.backendjava.entities.User;
import com.diego.backendjava.repositories.UserRepository;



@Service
public class UserSecurityService implements UserDetailsService{ // busca al usuario en la base de datos para loguearse

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<User> userOptional = userRepository.findByUsername(username);

        if(!userOptional.isPresent()){
            throw new UsernameNotFoundException("Username not found");
        }
        User user = userOptional.orElseThrow();

        List<GrantedAuthority> authorities = user.getRoles()
        .stream()
        .map(role -> new SimpleGrantedAuthority(role.getName()))
        .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            true,
            true,
            true,
            true,
            authorities);
    }

}
 
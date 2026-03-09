package com.imdb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
//
//    @Column(unique = true)
//    private String username;

    private String firstName;

    private String lastName;

    @Column(unique = true)
    private String email;

    private String password;

    private Boolean enabled = true;

    private Provider provider = Provider.LOCAL; // LOCAL / GOOGLE

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Role> roles = new HashSet<>();

    public String getFullName() {
        return this.firstName + " " + this.lastName;
    }

    public enum Provider{
        GOOGLE, LOCAL
    }
}
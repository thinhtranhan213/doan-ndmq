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
    // @Column(unique = true)
    // private String username;

    private String firstName;

    private String lastName;

    @Column(unique = true)
    private String email;

    private String password;

    private Boolean enabled = true;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;

    private Provider provider = Provider.LOCAL; // LOCAL / GOOGLE

    private String otp; // One-Time Password for forgot password

    private Long otpExpirationTime; // OTP expiration time in milliseconds

    private Long lastOtpSentTime; // Timestamp of last OTP sent (for rate limiting)

    private Integer otpAttempts = 0; // Number of OTP send attempts (resets every hour)

    private Long otpAttemptStartTime; // Timestamp when first OTP attempt started (for resetting attempts after 1
                                      // hour)

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Role> roles = new HashSet<>();

    public String getFullName() {
        return this.firstName + " " + this.lastName;
    }

    public enum Provider {
        GOOGLE, LOCAL
    }
}
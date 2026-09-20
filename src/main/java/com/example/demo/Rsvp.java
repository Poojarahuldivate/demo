package com.example.demo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Rsvp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private boolean attending;

    @Min(1)
    private int guests;

    private String message;

    protected Rsvp() {
    }

    public Rsvp(String name, boolean attending, int guests, String message) {
        this.name = name;
        this.attending = attending;
        this.guests = guests;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public boolean isAttending() {
        return attending;
    }

    public int getGuests() {
        return guests;
    }

    public String getMessage() {
        return message;
    }
}

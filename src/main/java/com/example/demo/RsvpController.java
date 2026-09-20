package com.example.demo;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rsvps")
@CrossOrigin(origins = "*")
public class RsvpController {

    private final RsvpRepository rsvpRepository;

    public RsvpController(RsvpRepository rsvpRepository) {
        this.rsvpRepository = rsvpRepository;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody RsvpRequest request) {
        if (request.name() == null || request.name().isBlank() || request.guests() < 1) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please provide a name and at least one guest."));
        }

        Rsvp saved = rsvpRepository.save(new Rsvp(
                request.name().trim(),
                request.attending(),
                request.guests(),
                request.message() == null ? "" : request.message().trim()));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", saved.getId(), "message", "Your RSVP is saved. We cannot wait to celebrate with you!"));
    }

    @GetMapping("/count")
    public Map<String, Long> attendingCount() {
        return Map.of("attending", rsvpRepository.countByAttendingTrue());
    }

    public record RsvpRequest(String name, boolean attending, int guests, String message) {
    }
}

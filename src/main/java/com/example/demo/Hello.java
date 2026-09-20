package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Hello {

	@GetMapping("/api/health")
	public String hello() {
		return "Ojal's birthday site is running";
	}
}

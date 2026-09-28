package com.techinventory.backend_inventory.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.techinventory.backend_inventory.service.InventarioService;
import com.techinventory.backend_inventory.service.InventarioService.ItemReserva;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final InventarioService inventarioService;

    public ReservaController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    public record ReservaRequest(List<ItemReserva> items) {}

    @PostMapping
    public ResponseEntity<Map<String, String>> reservar(@RequestBody ReservaRequest request) {
        try {
            inventarioService.reservar(request.items());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("mensaje", "Reserva realizada"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("mensaje", e.getMessage()));
        }
    }
}
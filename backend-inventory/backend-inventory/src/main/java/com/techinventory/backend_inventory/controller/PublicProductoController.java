package com.techinventory.backend_inventory.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.techinventory.backend_inventory.entity.Producto;
import com.techinventory.backend_inventory.service.InventarioService;

@RestController
@RequestMapping("/api/public/productos")
@CrossOrigin(origins = "*")
public class PublicProductoController {

    private final InventarioService inventarioService;

    public PublicProductoController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    // Endpoint PÚBLICO: Cualquier usuario puede ver el catálogo sin estar autenticado
    @GetMapping
    public ResponseEntity<List<Producto>> listarProductosPublicos() {
        return ResponseEntity.ok(inventarioService.obtenerTodosLosProductos());
    }
}
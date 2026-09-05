package com.techinventory.backend_inventory.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.techinventory.backend_inventory.entity.MovimientoInventario;
import com.techinventory.backend_inventory.entity.Producto;
import com.techinventory.backend_inventory.service.InventarioService;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    // Endpoint LECTURA PROTEGIDA: Requiere estar autenticado (Token JWT válido)
    @GetMapping("/productos/{id}")
    public ResponseEntity<Producto> obtenerDetalleProducto(@PathVariable Long id) {
        return ResponseEntity.ok(inventarioService.obtenerProductoPorId(id));
    }

    // Endpoint ESCRITURA PROTEGIDA: Requiere rol/scope con permiso de modificación (e.g. SCOPE_recurso.write / ROLE_ADMIN)
    @PostMapping("/movimientos")
    public ResponseEntity<MovimientoInventario> registrarMovimiento(
            @RequestParam Long productoId,
            @RequestParam Integer cantidad,
            @RequestParam String tipo,
            @RequestParam(required = false, defaultValue = "Centro Distribución Principal") String ubicacion) {

        MovimientoInventario nuevoMovimiento = inventarioService.registrarMovimiento(productoId, cantidad, tipo, ubicacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoMovimiento);
    }
}

package com.techinventory.backend_inventory.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.techinventory.backend_inventory.entity.MovimientoInventario;
import com.techinventory.backend_inventory.entity.Producto;
import com.techinventory.backend_inventory.service.InventarioService;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @GetMapping
    public ResponseEntity<List<Producto>> obtenerTodosLosProductos() {
        return ResponseEntity.ok(inventarioService.obtenerTodosLosProductos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerDetalleProducto(@PathVariable Long id) {
        return ResponseEntity.ok(inventarioService.obtenerProductoPorId(id));
    }

    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = inventarioService.guardarProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        producto.setId(id);
        Producto productoActualizado = inventarioService.guardarProducto(producto);
        return ResponseEntity.ok(productoActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        inventarioService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

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
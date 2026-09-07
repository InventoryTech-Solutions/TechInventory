package com.techinventory.backend_inventory.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.techinventory.backend_inventory.entity.MovimientoInventario;
import com.techinventory.backend_inventory.entity.Producto;
import com.techinventory.backend_inventory.repository.MovimientoInventarioRepository;
import com.techinventory.backend_inventory.repository.ProductoRepository;

@Service
public class InventarioService {

    private final ProductoRepository productoRepository;
    private final MovimientoInventarioRepository movimientoRepository;

    public InventarioService(ProductoRepository productoRepository, MovimientoInventarioRepository movimientoRepository) {
        this.productoRepository = productoRepository;
        this.movimientoRepository = movimientoRepository;
    }

    public List<Producto> obtenerTodosLosProductos() {
        return productoRepository.findAll();
    }

    public Producto obtenerProductoPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con el ID: " + id));
    }

    // Nuevo método para CREAR/ACTUALIZAR
    @Transactional
    public Producto guardarProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    // Nuevo método para ELIMINAR
    @Transactional
    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }

    @Transactional
    public MovimientoInventario registrarMovimiento(Long productoId, Integer cantidad, String tipo, String ubicacion) {
        Producto producto = obtenerProductoPorId(productoId);

        if ("SALIDA".equalsIgnoreCase(tipo) || "DESPACHO".equalsIgnoreCase(tipo)) {
            if (producto.getStock() < cantidad) {
                throw new IllegalArgumentException("Stock insuficiente para realizar el despacho.");
            }
            producto.setStock(producto.getStock() - cantidad);
        } else if ("ENTRADA".equalsIgnoreCase(tipo)) {
            producto.setStock(producto.getStock() + cantidad);
        } else {
            throw new IllegalArgumentException("Tipo de movimiento inválido: " + tipo);
        }

        productoRepository.save(producto);

        MovimientoInventario movimiento = MovimientoInventario.builder()
                .producto(producto)
                .cantidad(cantidad)
                .tipoMovimiento(tipo.toUpperCase())
                .ubicacionGeoreferenciada(ubicacion)
                .build();

        return movimientoRepository.save(movimiento);
    }
}
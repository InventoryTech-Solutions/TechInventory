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

    public record ItemReserva(Long productoId, Integer cantidad) {}

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

    @Transactional
    public Producto guardarProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    @Transactional
    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }

    @Transactional
    public MovimientoInventario registrarMovimiento(Long productoId, Integer cantidad, String tipo, String ubicacion) {
        Producto producto = obtenerProductoPorId(productoId);

        if ("SALIDA".equalsIgnoreCase(tipo) || "DESPACHO".equalsIgnoreCase(tipo)) {
            if (producto.getStock() < cantidad) {
                throw new IllegalArgumentException("Stock insuficiente para " + producto.getNombre());
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

    @Transactional
    public Producto actualizarStock(Long id, Integer nuevoStock) {
        Producto producto = obtenerProductoPorId(id);
        producto.setStock(nuevoStock);
        return productoRepository.save(producto);
    }

    // Reserva desde el catálogo: descuenta stock de todos los ítems o de ninguno
    @Transactional
    public void reservar(List<ItemReserva> items) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("La reserva no tiene productos");
        }
        for (ItemReserva item : items) {
            if (item.cantidad() == null || item.cantidad() <= 0) {
                throw new IllegalArgumentException("Cantidad inválida");
            }
            registrarMovimiento(item.productoId(), item.cantidad(), "SALIDA", "Reserva desde catálogo");
        }
    }
}
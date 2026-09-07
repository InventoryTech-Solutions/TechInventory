package com.techinventory.backend_inventory.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Permitir nulo para no romper el guardado si el formulario no envía SKU
    @Column(nullable = true)
    private String sku;

    @Column(nullable = false)
    private String nombre;

    private String categoria;

    @Column(nullable = false)
    private BigDecimal precio;

    @Column(nullable = false)
    private Integer stock;

    // Campos adicionados para coincidir con el formulario de Angular
    private String codigoBarras;
    private String ubicacionBodega;
    private String urlImagen;
}
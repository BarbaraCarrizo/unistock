package com.app.unistock.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos_inventario")
public class MovimientoInventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    @Column(name = "fecha_movimiento")
    private LocalDateTime fechaMovimiento;

    @Enumerated(EnumType.STRING)
    private TipoMovimiento tipo;

    private Integer cantidad;

    private String observacion;

    // Constructor vacío
    public MovimientoInventario() {}

    // Constructor útil
    public MovimientoInventario(Producto producto, TipoMovimiento tipo, Integer cantidad, String observacion) {
        this.producto = producto;
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.observacion = observacion;
    }

    // Inicializa fecha automáticamente al persistir
    @PrePersist
    public void prePersist() {
        this.fechaMovimiento = LocalDateTime.now();
    }

    // Getters y Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public LocalDateTime getFechaMovimiento() {
        return fechaMovimiento;
    }

    public void setFechaMovimiento(LocalDateTime fechaMovimiento) {
        this.fechaMovimiento = fechaMovimiento;
    }

    public TipoMovimiento getTipo() {
        return tipo;
    }

    public void setTipo(TipoMovimiento tipo) {
        this.tipo = tipo;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    // toString opcional
    @Override
    public String toString() {
        return "MovimientoInventario{id=" + id + ", tipo=" + tipo + ", cantidad=" + cantidad + "}";
    }
}
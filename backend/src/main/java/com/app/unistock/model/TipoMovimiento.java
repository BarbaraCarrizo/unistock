package com.app.unistock.model;

public enum TipoMovimiento {
    ENTRADA("Entrada"),
    SALIDA("Salida");

    private final String descripcion;

    TipoMovimiento(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
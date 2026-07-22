package com.mitienda.exception;

public class StockInsuficienteException extends RuntimeException {
    private final String sku;
    private final int solicitado;
    private final int disponible;

    public StockInsuficienteException(String sku, int solicitado, int disponible) {
        super("Stock insuficiente para variante " + sku + ": solicitado " + solicitado + ", disponible " + disponible);
        this.sku = sku;
        this.solicitado = solicitado;
        this.disponible = disponible;
    }

    public String getSku() { return sku; }
    public int getSolicitado() { return solicitado; }
    public int getDisponible() { return disponible; }
}

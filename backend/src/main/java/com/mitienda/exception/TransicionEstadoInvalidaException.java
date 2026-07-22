package com.mitienda.exception;

import com.mitienda.model.EstadoPedido;

public class TransicionEstadoInvalidaException extends IllegalArgumentException {

    public TransicionEstadoInvalidaException(EstadoPedido actual, EstadoPedido destino) {
        super("No se puede cambiar de estado " + actual + " a " + destino);
    }
}

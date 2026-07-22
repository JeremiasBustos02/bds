package com.mitienda.service;

import com.mitienda.dto.admin.MetricasResponse;
import com.mitienda.dto.pedido.CambiarEstadoRequest;
import com.mitienda.dto.pedido.CrearPedidoRequest;
import com.mitienda.dto.pedido.DatosFacturacionRequest;
import com.mitienda.dto.pedido.PedidoDetalleResponse;
import com.mitienda.dto.pedido.PedidoResponse;
import com.mitienda.exception.StockInsuficienteException;
import com.mitienda.exception.TransicionEstadoInvalidaException;
import com.mitienda.model.Categoria;
import com.mitienda.model.DatosFacturacion;
import com.mitienda.model.EstadoPedido;
import com.mitienda.model.ItemPedido;
import com.mitienda.model.MetodoEnvio;
import com.mitienda.model.Pedido;
import com.mitienda.model.TipoDocumento;
import com.mitienda.model.Usuario;
import com.mitienda.model.Variante;
import com.mitienda.repository.PedidoRepository;
import com.mitienda.repository.ProductoRepository;
import com.mitienda.repository.UsuarioRepository;
import com.mitienda.repository.VarianteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class PedidoService {

    private static final int LOW_STOCK_THRESHOLD = 5;

    private static final Map<EstadoPedido, Set<EstadoPedido>> TRANSICIONES_VALIDAS = Map.of(
        EstadoPedido.CONFIRMADO, Set.of(EstadoPedido.PREPARANDO, EstadoPedido.CANCELADO),
        EstadoPedido.PREPARANDO, Set.of(EstadoPedido.ENVIADO, EstadoPedido.CANCELADO),
        EstadoPedido.ENVIADO, Set.of(EstadoPedido.ENTREGADO)
    );

    private final PedidoRepository pedidoRepository;
    private final VarianteRepository varianteRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public PedidoResponse crear(UUID usuarioId, CrearPedidoRequest request) {
        if (request.metodoEnvio() == MetodoEnvio.DOMICILIO
            && (request.codigoPostal() == null || request.codigoPostal().isBlank())) {
            throw new IllegalArgumentException("El código postal es obligatorio para envío a domicilio");
        }

        DatosFacturacionRequest dfReq = request.datosFacturacion();
        if (dfReq.tipoDocumento() == TipoDocumento.CUIT && dfReq.numeroDocumento().length() != 11) {
            throw new IllegalArgumentException("CUIT debe tener 11 dígitos");
        }
        if (dfReq.tipoDocumento() == TipoDocumento.DNI
            && (dfReq.numeroDocumento().length() < 7 || dfReq.numeroDocumento().length() > 8)) {
            throw new IllegalArgumentException("DNI debe tener 7 u 8 dígitos");
        }
        if (!dfReq.mismaDireccionEnvio()) {
            if (dfReq.direccionCalle() == null || dfReq.direccionCalle().isBlank()
                || dfReq.direccionNumero() == null || dfReq.direccionNumero().isBlank()
                || dfReq.direccionCiudad() == null || dfReq.direccionCiudad().isBlank()
                || dfReq.direccionProvincia() == null || dfReq.direccionProvincia().isBlank()
                || dfReq.direccionCodigoPostal() == null || dfReq.direccionCodigoPostal().isBlank()) {
                throw new IllegalArgumentException("Si la dirección de facturación es diferente, completá todos los campos de dirección");
            }
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        List<ItemPedido> items = new java.util.ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (var itemReq : request.items()) {
            Variante variante = varianteRepository.findById(itemReq.varianteId())
                .orElseThrow(() -> new EntityNotFoundException("Variante no encontrada: " + itemReq.varianteId()));

            var stock = variante.getStock();
            if (stock == null || stock.getCantidadDisponible() < itemReq.cantidad()) {
                int disponible = stock != null ? stock.getCantidadDisponible() : 0;
                throw new StockInsuficienteException(variante.getSku(), itemReq.cantidad(), disponible);
            }

            BigDecimal precioUnitario = variante.getProducto().getPrecioBase()
                .add(variante.getPrecioAdicional());
            total = total.add(precioUnitario.multiply(BigDecimal.valueOf(itemReq.cantidad())));

            items.add(ItemPedido.create(variante, itemReq.cantidad(), precioUnitario));
            stock.descontar(itemReq.cantidad());
        }

        Pedido pedido = Pedido.create(usuario, request.metodoEnvio(), request.codigoPostal(), total);
        if (request.metodoEnvio() == MetodoEnvio.DOMICILIO) {
            pedido.setEnvCalle(request.envCalle());
            pedido.setEnvNumero(request.envNumero());
            pedido.setEnvPiso(request.envPiso());
            pedido.setEnvLocalidad(request.envLocalidad());
            pedido.setEnvProvincia(request.envProvincia());
        }
        items.forEach(pedido::agregarItem);

        DatosFacturacion datosFacturacion = DatosFacturacion.create(
            pedido,
            dfReq.tipoDocumento(),
            dfReq.numeroDocumento(),
            dfReq.nombreRazonSocial(),
            dfReq.telefono(),
            dfReq.emailContacto(),
            dfReq.mismaDireccionEnvio(),
            dfReq.direccionCalle(),
            dfReq.direccionNumero(),
            dfReq.direccionCiudad(),
            dfReq.direccionProvincia(),
            dfReq.direccionCodigoPostal()
        );
        pedido.setDatosFacturacion(datosFacturacion);

        Pedido saved = pedidoRepository.save(pedido);
        return PedidoResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public Page<PedidoResponse> listarMios(UUID usuarioId, Pageable pageable) {
        return pedidoRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId, pageable)
            .map(PedidoResponse::from);
    }

    @Transactional(readOnly = true)
    public PedidoResponse detallePorId(UUID pedidoId, UUID usuarioId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado"));

        if (!pedido.getUsuario().getId().equals(usuarioId)) {
            throw new AccessDeniedException("No tenés permiso para ver este pedido");
        }

        return PedidoResponse.from(pedido);
    }

    @Transactional(readOnly = true)
    public PedidoDetalleResponse detalleAdmin(UUID pedidoId) {
        Pedido pedido = pedidoRepository.findDetalleById(pedidoId)
            .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado"));
        return PedidoDetalleResponse.from(pedido);
    }

    public PedidoResponse cambiarEstado(UUID pedidoId, CambiarEstadoRequest request) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado"));

        EstadoPedido nuevoEstado = request.nuevoEstado();
        Set<EstadoPedido> destinos = TRANSICIONES_VALIDAS.get(pedido.getEstado());

        if (destinos == null || !destinos.contains(nuevoEstado)) {
            throw new TransicionEstadoInvalidaException(pedido.getEstado(), nuevoEstado);
        }

        if (nuevoEstado == EstadoPedido.ENVIADO
            && (request.numeroSeguimiento() == null || request.numeroSeguimiento().isBlank())) {
            throw new IllegalArgumentException("El número de seguimiento es obligatorio al enviar");
        }

        if (nuevoEstado == EstadoPedido.CANCELADO) {
            for (ItemPedido item : pedido.getItems()) {
                item.getVariante().getStock().devolver(item.getCantidad());
            }
        }

        pedido.cambiarEstado(nuevoEstado);
        if (request.numeroSeguimiento() != null) {
            pedido.setNumeroSeguimiento(request.numeroSeguimiento());
        }

        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    @Transactional(readOnly = true)
    public Page<PedidoResponse> listarTodos(EstadoPedido estado, Instant desde, Instant hasta, Pageable pageable) {
        if (estado != null && desde != null && hasta != null) {
            return pedidoRepository.findByEstadoAndFechaCreacionBetweenOrderByFechaCreacionDesc(estado, desde, hasta, pageable)
                .map(PedidoResponse::from);
        }
        if (estado != null) {
            return pedidoRepository.findByEstadoOrderByFechaCreacionDesc(estado, pageable)
                .map(PedidoResponse::from);
        }
        if (desde != null && hasta != null) {
            return pedidoRepository.findByFechaCreacionBetweenOrderByFechaCreacionDesc(desde, hasta, pageable)
                .map(PedidoResponse::from);
        }
        return pedidoRepository.findAllByOrderByFechaCreacionDesc(pageable)
            .map(PedidoResponse::from);
    }

    @Transactional(readOnly = true)
    public MetricasResponse metricas(Instant desdeParam, Instant hastaParam) {
        Instant hasta = hastaParam != null ? hastaParam : Instant.now();
        Instant desde = desdeParam != null ? desdeParam : hasta.minus(30, ChronoUnit.DAYS);

        BigDecimal ventasTotales = pedidoRepository.totalVentasPorRango(desde, hasta);
        long totalPedidosEnRango = pedidoRepository.countPedidosPorRango(desde, hasta);
        long canceladosEnRango = pedidoRepository.countCanceladosPorRango(desde, hasta);
        long cantidadPedidos = totalPedidosEnRango - canceladosEnRango;

        BigDecimal ticketPromedio = cantidadPedidos > 0
            ? ventasTotales.divide(BigDecimal.valueOf(cantidadPedidos), 2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        BigDecimal tasaCancelacion = totalPedidosEnRango > 0
            ? BigDecimal.valueOf(canceladosEnRango)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(totalPedidosEnRango), 1, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        List<Object[]> topRaw = pedidoRepository.topProductosVendidosPorRango(desde, hasta, PageRequest.of(0, 5));
        List<MetricasResponse.ProductoTop> topProductos = topRaw.stream()
            .map(row -> new MetricasResponse.ProductoTop((String) row[0], ((Number) row[1]).longValue()))
            .toList();

        List<Object[]> ventasDiaRaw = pedidoRepository.ventasPorDiaRango(desde, hasta);
        Map<String, BigDecimal> ventasPorDia = new LinkedHashMap<>();
        for (var row : ventasDiaRaw) {
            java.sql.Date diaSql = (java.sql.Date) row[0];
            ventasPorDia.put(diaSql.toLocalDate().toString(), (BigDecimal) row[1]);
        }

        List<Object[]> ventasCatRaw = pedidoRepository.ventasPorCategoria(desde, hasta);
        Map<Categoria, BigDecimal> ventasPorCategoria = new LinkedHashMap<>();
        for (var row : ventasCatRaw) {
            ventasPorCategoria.put((Categoria) row[0], (BigDecimal) row[1]);
        }

        List<Object[]> pedidosEstadoRaw = pedidoRepository.pedidosPorEstado(desde, hasta);
        Map<EstadoPedido, Long> pedidosPorEstado = new LinkedHashMap<>();
        Arrays.stream(EstadoPedido.values()).forEach(e -> pedidosPorEstado.put(e, 0L));
        for (var row : pedidosEstadoRaw) {
            pedidosPorEstado.put((EstadoPedido) row[0], ((Number) row[1]).longValue());
        }

        List<Object[]> stockBajoRaw = productoRepository.findProductosStockBajo(LOW_STOCK_THRESHOLD);
        List<MetricasResponse.StockBajo> stockBajo = stockBajoRaw.stream()
            .map(row -> new MetricasResponse.StockBajo(
                (UUID) row[0],
                (String) row[1],
                (String) row[2],
                (Categoria) row[3],
                ((Number) row[4]).intValue()
            ))
            .toList();

        return new MetricasResponse(
            ventasTotales, cantidadPedidos, ticketPromedio, topProductos, ventasPorDia,
            ventasPorCategoria, pedidosPorEstado, tasaCancelacion, stockBajo
        );
    }
}

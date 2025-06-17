-- Categorías
INSERT INTO categorias (id, nombre) VALUES (1, 'Electrónica'), (2, 'Alimentos');

-- Productos
INSERT INTO productos (id, nombre, descripcion, stock, precio, fecha_creacion, categoria_id)
VALUES 
(1, 'Mouse Gamer', 'Mouse óptico con luces LED', 25, 1200.00, '2024-06-17 12:00:00', 1),
(2, 'Fideos Spaghetti', 'Pasta de trigo larga', 100, 300.50, '2024-06-15 09:00:00', 2);

-- Movimientos de inventario
INSERT INTO movimientos_inventario (producto_id, fecha_movimiento, tipo, cantidad, observacion)
VALUES
(1, '2024-06-18 10:00:00', 'ENTRADA', 10, 'Reposición de stock'),
(1, '2024-06-19 14:00:00', 'SALIDA', 5, 'Venta a cliente'),
(2, '2024-06-20 09:30:00', 'ENTRADA', 50, 'Compra mayorista');
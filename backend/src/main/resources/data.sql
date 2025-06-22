INSERT INTO categorias (nombre) VALUES
('Electronica'),
('Alimentos');

INSERT INTO productos (nombre, descripcion, stock, precio, fecha_creacion, categoria_id) VALUES
('Notebook Lenovo', '14 pulgadas, Ryzen 5', 10, 650000.0, CURRENT_TIMESTAMP(), 1),
('Camara Logitech', 'Webcam HD', 25, 42000.0, CURRENT_TIMESTAMP(), 1),
('Yerba Mate', 'Paquete 1kg', 50, 2500.0, CURRENT_TIMESTAMP(), 2);

INSERT INTO movimientos_inventario (producto_id, fecha_movimiento, tipo, cantidad, observacion) VALUES
(1, CURRENT_TIMESTAMP(), 'ENTRADA', 10, 'Stock inicial'),
(2, CURRENT_TIMESTAMP(), 'ENTRADA', 25, 'Compra mayorista'),
(3, CURRENT_TIMESTAMP(), 'ENTRADA', 50, 'Stock inicial yerba');

INSERT INTO usuario (nombre, contrasena, rol) VALUES
('admin', 'admin123', 'ADMIN'),
('usuario', 'usuario123', 'USER');
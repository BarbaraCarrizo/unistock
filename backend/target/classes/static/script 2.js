let movimientos = [];
let movimientosRegistrados = [];

document.addEventListener("DOMContentLoaded", async () => {

    // 1) Elementos de login vs app
  const loginView = document.getElementById("loginView");
  const appView   = document.getElementById("appView");
  const header    = document.getElementById("mainHeader");
  const logoutBtn = document.querySelector(".logout-btn");

  // 2) Funciones para mostrar/ocultar vistas
  const showLogin = () => {
    loginView.style.display = "block";
    appView  .style.display = "none";
    header   .style.display = "none";
    document.getElementById("mensajeLogin").style.display = "none";
  };
  const showApp = () => {
    loginView.style.display = "none";
    appView  .style.display = "block";
    header   .style.display = "flex";
  };

  // 3) Restaurar sesión al cargar la página
  if (localStorage.getItem("loggedIn") === "true") {
    showApp();
    cargarMovimientosRegistrados();
  } else {
    showLogin();
  }

  // 4) Lógica de login
  document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const u = document.getElementById("usuario").value.trim();
    const p = document.getElementById("contrasena").value.trim();
    const msg = document.getElementById("mensajeLogin");

    try {
      const response = await fetch("http://localhost:8081/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: u, contrasena: p })
      });
      if (response.ok) {
        const usuario = await response.json();
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("usuario", JSON.stringify(usuario));
        showApp();
        cargarMovimientosRegistrados();
      } else {
        msg.textContent = "Usuario o contraseña incorrectos.";
        msg.style.display = "block";
      }
    } catch (error) {
      msg.textContent = "Error de conexión con el servidor.";
      msg.style.display = "block";
    }
  });

  // 5) Lógica de logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    showLogin();
  });


  const categoriaSelect = document.getElementById("categoriaSelect");
  const productoSelect = document.getElementById("productoSelect");
  const tipoMovimiento = document.getElementById("tipoMovimiento");
  const motivoInput = document.getElementById("motivoInput");
  const contador = document.getElementById("contador");
  const seccionDetalle = document.getElementById("detalleMovimiento");
  const detalleBody = document.getElementById("detalleMovimientoBody");

  const cuerpoMovimientosRegistrados = document.getElementById("tablaHistorialBody");

  const cargarCategorias = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/categorias");
      const categorias = await response.json();
      categoriaSelect.innerHTML = `<option value="">Seleccionar Categoría</option>`;
      categorias.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.nombre;
        categoriaSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  categoriaSelect.addEventListener("change", async () => {
    const idCat = categoriaSelect.value;
    productoSelect.disabled = true;
    productoSelect.innerHTML = `<option value="">Cargando productos...</option>`;

    try {
      const response = await fetch("http://localhost:8081/api/categorias");
      const categorias = await response.json();
      const categoria = categorias.find(c => c.id == idCat);

      productoSelect.innerHTML = `<option value="">Seleccionar Producto</option>`;
      if (categoria && categoria.productos) {
        categoria.productos.forEach(p => {
          const option = document.createElement("option");
          option.value = p.id;
          option.textContent = p.nombre;
          productoSelect.appendChild(option);
        });
        productoSelect.disabled = false;
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  });

  tipoMovimiento.addEventListener("change", () => {
    motivoInput.style.display = tipoMovimiento.value === "Baja" ? "block" : "none";
  });

  document.getElementById("agregarBtn").addEventListener("click", () => {
    seccionDetalle?.style?.setProperty("display", "none");

    const categoriaId = categoriaSelect.value;
    const categoriaText = categoriaSelect.options[categoriaSelect.selectedIndex].text;
    const productoId = productoSelect.value;
    const productoText = productoSelect.options[productoSelect.selectedIndex].text;
    const cantidad = parseInt(document.getElementById("cantidadInput").value);
    const motivo = motivoInput.value.trim();

    if (!categoriaId || !productoId || isNaN(cantidad) || cantidad <= 0) {
      alert("Completa todos los campos correctamente.");
      return;
    }

    if (tipoMovimiento.value === "Baja" && motivo === "") {
      alert("Debes especificar un motivo para la baja.");
      return;
    }

    if (movimientos.length === 0) {
      tipoMovimiento.disabled = true;
    } else {
      if (tipoMovimiento.value !== movimientos[0].tipo) {
        alert("No podés combinar tipos de movimiento en una misma operación.");
        return;
      }

      if (movimientos[0].categoriaId !== categoriaId) {
        alert("No puedes agregar productos de distintas categorías en un mismo movimiento.");
        return;
      }
    }

    movimientos.push({
      tipo: tipoMovimiento.value,
      categoriaId,
      categoriaText,
      productoId,
      productoText,
      cantidad,
      motivo: tipoMovimiento.value === "Baja" ? motivo : "-"
    });

    actualizarTabla();
    limpiarFormulario();
  });

  const actualizarTabla = () => {
    const tbody = document.querySelector("#tablaListado tbody");
    tbody.innerHTML = "";
    movimientos.forEach((m, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${m.categoriaText}</td>
        <td>${m.productoText}</td>
        <td>${m.cantidad}</td>
        <td>${m.motivo}</td>
        <td><button onclick="eliminarMovimiento(${i})">❌</button></td>
      `;
      tbody.appendChild(tr);
    });
    contador.textContent = movimientos.length;
  };

  window.eliminarMovimiento = (index) => {
    movimientos.splice(index, 1);
    actualizarTabla();

    if (movimientos.length === 0) {
      tipoMovimiento.disabled = false;
    }
  };

  const limpiarFormulario = () => {
    productoSelect.innerHTML = `<option value="">Seleccionar Producto</option>`;
    productoSelect.disabled = true;
    document.getElementById("cantidadInput").value = "";
    motivoInput.value = "";
  };

  const agregarMovimientoRegistrado = (listaMovimientos, tipo) => {
    const fecha = new Date().toLocaleDateString();
    const numeroMovimiento = movimientosRegistrados.length + 1;

    movimientosRegistrados.push({
      numero: numeroMovimiento,
      fecha,
      tipo,
      detalles: [...listaMovimientos]
    });

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${numeroMovimiento}</td>
      <td>${fecha}</td>
      <td>${tipo}</td>
      <td><button onclick="verDetalles(${numeroMovimiento - 1})">Ver</button></td>
    `;

    cuerpoMovimientosRegistrados.appendChild(tr);
  };

window.verDetalles = (indice) => {
  const movimiento = movimientosRegistrados[indice];
  const modal = document.getElementById("modalDetalle");
  const detalleBody = document.getElementById("modalDetalleBody"); // ← nuevo ID

  detalleBody.innerHTML = "";
  movimiento.detalles.forEach(item => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${movimiento.fecha}</td>
      <td>${movimiento.tipo}</td>
      <td>${item.categoriaText}</td>
      <td>${item.productoText}</td>
      <td>${item.cantidad}</td>
      <td>${item.motivo}</td>
    `;
    detalleBody.appendChild(fila);
  });

  modal.style.display = "block";
};

  document.getElementById("registrarTodoBtn").addEventListener("click", async () => {
    if (movimientos.length === 0) {
      alert("No hay movimientos para registrar.");
      return;
    }

    try {
      for (const m of movimientos) {
        const response = await fetch("http://localhost:8081/api/movimientos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tipo: m.tipo === "Ingreso" ? "ENTRADA" : "SALIDA",
            cantidad: m.cantidad,
            motivo: m.motivo,
            producto: {
              id: m.productoId
            }
          })
        });
        if (response.ok) {
          // Obtener el producto actualizado tras registrar el movimiento
          const productoResp = await fetch(`http://localhost:8081/api/productos/${m.productoId}`);
          if (productoResp.ok) {
            const productoActualizado = await productoResp.json();
            alert(`Stock actualizado para ${productoActualizado.nombre}: ${productoActualizado.stock}`);
          }
        }
      }

      alert("Movimientos registrados con éxito.");

      agregarMovimientoRegistrado([...movimientos], movimientos[0].tipo);

      movimientos = [];
      actualizarTabla();
      tipoMovimiento.disabled = false;
      limpiarFormulario();
      seccionDetalle?.style?.setProperty("display", "none");
    } catch (error) {
      alert("Error al registrar los movimientos.");
      console.error(error);
    }
  });

  // Cerrar modal con el botón "X"
document.getElementById("cerrarModal").addEventListener("click", () => {
  document.getElementById("modalDetalle").style.display = "none";
});

// Cerrar modal al hacer clic afuera del contenido
window.addEventListener("click", (event) => {
  const modal = document.getElementById("modalDetalle");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Función para cargar movimientos desde el backend
  async function cargarMovimientosRegistrados() {
    console.log("Cargando movimientos desde el backend...");
    try {
      const response = await fetch("http://localhost:8081/api/movimientos");
      let movimientos = await response.json();
      // Ordenar por fecha descendente
      movimientos = movimientos.sort((a, b) => new Date(b.fechaMovimiento) - new Date(a.fechaMovimiento));
      cuerpoMovimientosRegistrados.innerHTML = "";
      movimientos.forEach((mov, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${mov.id}</td>
          <td>${mov.fechaMovimiento ? new Date(mov.fechaMovimiento).toLocaleDateString() : ""}</td>
          <td>${mov.tipo}</td>
          <td><button onclick="verDetallesBackend(${i})">Ver</button></td>
        `;
        cuerpoMovimientosRegistrados.appendChild(tr);
      });
      window.movimientosRegistradosBackend = movimientos;
    } catch (error) {
      console.error("Error al cargar movimientos registrados:", error);
    }
  }

  // Mostrar detalles de un movimiento guardado en la base
  window.verDetallesBackend = (indice) => {
    const movimiento = window.movimientosRegistradosBackend[indice];
    const modal = document.getElementById("modalDetalle");
    const detalleBody = document.getElementById("modalDetalleBody");
    detalleBody.innerHTML = "";
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${movimiento.fechaMovimiento ? new Date(movimiento.fechaMovimiento).toLocaleDateString() : ""}</td>
      <td>${movimiento.tipo}</td>
      <td>${movimiento.producto && movimiento.producto.categoria ? movimiento.producto.categoria.nombre : ""}</td>
      <td>${movimiento.producto ? movimiento.producto.nombre : ""}</td>
      <td>${movimiento.cantidad}</td>
      <td>${movimiento.observacion}</td>
    `;
    detalleBody.appendChild(fila);
    modal.style.display = "block";
  };

  cargarCategorias();
});

// ========== CRUD USUARIOS =============
async function cargarUsuarios() {
  const cont = document.getElementById('usuariosCrudContainer');
  cont.innerHTML = '<p>Cargando usuarios...</p>';
  try {
    const res = await fetch('http://localhost:8081/api/usuarios');
    const usuarios = await res.json();
    let html = `
      <table class="crud-table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Rol</th><th>Acciones</th></tr></thead>
        <tbody>
          ${usuarios.map(u => `
            <tr>
              <td>${u.id}</td>
              <td>${u.nombre}</td>
              <td>${u.rol || ''}</td>
              <td>
                <button onclick="editarUsuario(${u.id}, '${u.nombre}', '${u.rol || ''}')">Editar</button>
                <button onclick="eliminarUsuario(${u.id})">Eliminar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <h3>Agregar/Editar Usuario</h3>
      <form id="usuarioForm">
        <input type="hidden" id="usuarioId" />
        <input type="text" id="usuarioNombre" placeholder="Nombre" required />
        <input type="password" id="usuarioContrasena" placeholder="Contraseña" required />
        <input type="text" id="usuarioRol" placeholder="Rol" />
        <button type="submit">Guardar</button>
        <button type="button" id="cancelarEdicionUsuario" style="display:none;">Cancelar</button>
      </form>
    `;
    cont.innerHTML = html;
    document.getElementById('usuarioForm').onsubmit = guardarUsuario;
    document.getElementById('cancelarEdicionUsuario').onclick = limpiarUsuarioForm;
  } catch (e) {
    cont.innerHTML = '<p>Error al cargar usuarios</p>';
  }
}

async function guardarUsuario(e) {
  e.preventDefault();
  const id = document.getElementById('usuarioId').value;
  const nombre = document.getElementById('usuarioNombre').value.trim();
  const contrasena = document.getElementById('usuarioContrasena').value.trim();
  const rol = document.getElementById('usuarioRol').value.trim();
  const data = { nombre, contrasena, rol };
  let url = 'http://localhost:8081/api/usuarios', method = 'POST';
  if (id) {
    url += '/' + id;
    method = 'PUT';
  }
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.ok) {
    limpiarUsuarioForm();
    cargarUsuarios();
  } else {
    alert('No se pudo guardar el usuario');
  }
}

window.editarUsuario = (id, nombre, rol) => {
  document.getElementById('usuarioId').value = id;
  document.getElementById('usuarioNombre').value = nombre;
  document.getElementById('usuarioRol').value = rol;
  document.getElementById('usuarioContrasena').value = '';
  document.getElementById('cancelarEdicionUsuario').style.display = 'inline-block';
};

window.eliminarUsuario = async (id) => {
  if (confirm('¿Eliminar usuario?')) {
    const res = await fetch('http://localhost:8081/api/usuarios/' + id, { method: 'DELETE' });
    if (res.ok) cargarUsuarios();
    else alert('No se pudo eliminar');
  }
};

function limpiarUsuarioForm() {
  document.getElementById('usuarioId').value = '';
  document.getElementById('usuarioNombre').value = '';
  document.getElementById('usuarioContrasena').value = '';
  document.getElementById('usuarioRol').value = '';
  document.getElementById('cancelarEdicionUsuario').style.display = 'none';
}

// ========== CRUD PRODUCTOS =============
async function cargarProductos() {
  const cont = document.getElementById('productosCrudContainer');
  cont.innerHTML = '<p>Cargando productos...</p>';
  try {
    const [resProd, resCat] = await Promise.all([
      fetch('http://localhost:8081/api/productos'),
      fetch('http://localhost:8081/api/categorias')
    ]);
    const productos = await resProd.json();
    const categorias = await resCat.json();
    let html = `
      <table class="crud-table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Stock</th><th>Precio</th><th>Categoría</th><th>Acciones</th></tr></thead>
        <tbody>
          ${productos.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.nombre}</td>
              <td>${p.descripcion || ''}</td>
              <td>${p.stock}</td>
              <td>${p.precio != null ? p.precio : ''}</td>
              <td>${p.categoria ? p.categoria.nombre : ''}</td>
              <td>
                <button onclick="editarProducto(${p.id}, '${p.nombre}', '${p.descripcion || ''}', ${p.stock}, ${p.precio != null ? p.precio : 'null'}, ${p.categoria ? p.categoria.id : 'null'})">Editar</button>
                <button onclick="eliminarProducto(${p.id})">Eliminar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <h3>Agregar/Editar Producto</h3>
      <form id="productoForm">
        <input type="hidden" id="productoId" />
        <input type="text" id="productoNombre" placeholder="Nombre" required />
        <input type="text" id="productoDescripcion" placeholder="Descripción" />
        <input type="number" id="productoStock" placeholder="Stock" required min="0" />
        <input type="number" id="productoPrecio" placeholder="Precio" step="0.01" min="0" />
        <select id="productoCategoria" required>
          <option value="">Seleccionar Categoría</option>
          ${categorias.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('')}
        </select>
        <button type="submit">Guardar</button>
        <button type="button" id="cancelarEdicionProducto" style="display:none;">Cancelar</button>
      </form>
    `;
    cont.innerHTML = html;
    document.getElementById('productoForm').onsubmit = guardarProducto;
    document.getElementById('cancelarEdicionProducto').onclick = limpiarProductoForm;
  } catch (e) {
    cont.innerHTML = '<p>Error al cargar productos</p>';
  }
}

async function guardarProducto(e) {
  e.preventDefault();
  const id = document.getElementById('productoId').value;
  const nombre = document.getElementById('productoNombre').value.trim();
  const descripcion = document.getElementById('productoDescripcion').value.trim();
  const stock = parseInt(document.getElementById('productoStock').value);
  const precio = parseFloat(document.getElementById('productoPrecio').value);
  const categoriaId = document.getElementById('productoCategoria').value;
  const data = { nombre, descripcion, stock, precio, categoria: { id: categoriaId } };
  let url = 'http://localhost:8081/api/productos', method = 'POST';
  if (id) {
    url += '/' + id;
    method = 'PUT';
  }
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.ok) {
    limpiarProductoForm();
    cargarProductos();
  } else {
    alert('No se pudo guardar el producto');
  }
}

window.editarProducto = (id, nombre, descripcion, stock, precio, categoriaId) => {
  document.getElementById('productoId').value = id;
  document.getElementById('productoNombre').value = nombre;
  document.getElementById('productoDescripcion').value = descripcion;
  document.getElementById('productoStock').value = stock;
  document.getElementById('productoPrecio').value = precio != null ? precio : '';
  document.getElementById('productoCategoria').value = categoriaId;
  document.getElementById('cancelarEdicionProducto').style.display = 'inline-block';
};

window.eliminarProducto = async (id) => {
  if (confirm('¿Eliminar producto?')) {
    const res = await fetch('http://localhost:8081/api/productos/' + id, { method: 'DELETE' });
    if (res.ok) cargarProductos();
    else alert('No se pudo eliminar');
  }
};

function limpiarProductoForm() {
  document.getElementById('productoId').value = '';
  document.getElementById('productoNombre').value = '';
  document.getElementById('productoDescripcion').value = '';
  document.getElementById('productoStock').value = '';
  document.getElementById('productoPrecio').value = '';
  document.getElementById('productoCategoria').value = '';
  document.getElementById('cancelarEdicionProducto').style.display = 'none';
}

// ========== CRUD CATEGORIAS =============
async function cargarCategoriasCrud() {
  const cont = document.getElementById('categoriasCrudContainer');
  cont.innerHTML = '<p>Cargando categorías...</p>';
  try {
    const res = await fetch('http://localhost:8081/api/categorias');
    const categorias = await res.json();
    let html = `
      <table class="crud-table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
        <tbody>
          ${categorias.map(c => `
            <tr>
              <td>${c.id}</td>
              <td>${c.nombre}</td>
              <td>
                <button class="btn-editar-categoria" data-id="${c.id}" data-nombre="${encodeURIComponent(c.nombre)}">Editar</button>
                <button onclick="eliminarCategoria(${c.id})">Eliminar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <h3>Agregar/Editar Categoría</h3>
      <form id="categoriaForm">
        <input type="hidden" id="categoriaId" />
        <input type="text" id="categoriaNombre" placeholder="Nombre" required />
        <button type="submit">Guardar</button>
        <button type="button" id="cancelarEdicionCategoria" style="display:none;">Cancelar</button>
      </form>
    `;
    cont.innerHTML = html;
    document.getElementById('categoriaForm').onsubmit = guardarCategoria;
    document.getElementById('cancelarEdicionCategoria').onclick = limpiarCategoriaForm;
    cont.querySelectorAll('.btn-editar-categoria').forEach(btn => {
      btn.addEventListener('click', function() {
        editarCategoria(this.dataset.id, decodeURIComponent(this.dataset.nombre));
      });
    });
  } catch (e) {
    cont.innerHTML = '<p>Error al cargar categorías</p>';
  }
}

async function guardarCategoria(e) {
  e.preventDefault();
  const id = document.getElementById('categoriaId').value;
  const nombre = document.getElementById('categoriaNombre').value.trim();
  const data = { nombre };
  let url = 'http://localhost:8081/api/categorias', method = 'POST';
  if (id) {
    url += '/' + id;
    method = 'PUT';
  }
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.ok) {
    limpiarCategoriaForm();
    cargarCategoriasCrud();
  } else {
    alert('No se pudo guardar la categoría');
  }
}

window.editarCategoria = (id, nombre) => {
  document.getElementById('categoriaId').value = id;
  document.getElementById('categoriaNombre').value = nombre;
  document.getElementById('cancelarEdicionCategoria').style.display = 'inline-block';
};

window.eliminarCategoria = async (id) => {
  if (confirm('¿Eliminar categoría?')) {
    const res = await fetch('http://localhost:8081/api/categorias/' + id, { method: 'DELETE' });
    if (res.ok) cargarCategoriasCrud();
    else alert('No se pudo eliminar');
  }
};

function limpiarCategoriaForm() {
  document.getElementById('categoriaId').value = '';
  document.getElementById('categoriaNombre').value = '';
  document.getElementById('cancelarEdicionCategoria').style.display = 'none';
}

// Mostrar datos al hacer clic en el menú

document.getElementById('navUsuarios').addEventListener('click', () => cargarUsuarios());
document.getElementById('navProductos').addEventListener('click', () => cargarProductos());
document.getElementById('navCategorias').addEventListener('click', () => cargarCategoriasCrud());






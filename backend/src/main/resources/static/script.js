let movimientos = [];

document.addEventListener("DOMContentLoaded", async () => {
  // Elementos principales
  const loginView = document.getElementById("loginView");
  const appView   = document.getElementById("appView");
  const header    = document.getElementById("mainHeader");
  const logoutBtn = document.querySelector(".logout-btn");
  const mainNav = document.getElementById("mainNav");
  const navUsuarios = document.getElementById("navUsuarios");
  const navProductos = document.getElementById("navProductos");
  const navCategorias = document.getElementById("navCategorias");
  const navMovimientos = document.getElementById("navMovimientos");
  const usuariosSection = document.getElementById("usuariosSection");
  const productosSection = document.getElementById("productosSection");
  const categoriasSection = document.getElementById("categoriasSection");
  const movimientosSection = document.getElementById("movimientosSection");

  // Mostrar login
  const showLogin = () => {
    loginView.style.display = "block";
    appView.style.display = "none";
    header.style.display = "none";
    mainNav.style.display = "none";
    document.getElementById("mensajeLogin").style.display = "none";
    document.getElementById("loginForm").reset();
  };

  // Mostrar app
  const showApp = () => {
    loginView.style.display = "none";
    appView.style.display = "block";
    header.style.display = "flex";
    mainNav.style.display = "block";
    mostrarSeccion(movimientosSection);
    navMovimientos.classList.add('active');
    cargarCategoriasParaMovimientos();
    cargarMovimientosRegistrados();
  };

  // Restaurar sesión
  if (localStorage.getItem("loggedIn") === "true") {
    showApp();
  } else {
    showLogin();
  }

  // Login
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
      } else {
        msg.textContent = "Usuario o contraseña incorrectos.";
        msg.style.display = "block";
      }
    } catch (error) {
      msg.textContent = "Error de conexión con el servidor.";
      msg.style.display = "block";
    }
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("usuario");
    showLogin();
  });

  // Función para mostrar secciones
  function mostrarSeccion(seccion) {
    usuariosSection.style.display = "none";
    productosSection.style.display = "none";
    categoriasSection.style.display = "none";
    movimientosSection.style.display = "none";
    seccion.style.display = "block";
    document.querySelectorAll('.nav-list li a').forEach(a => a.classList.remove('active'));
  }

  // Menú navegación
  navUsuarios.addEventListener("click", e => {
    e.preventDefault();
    mostrarSeccion(usuariosSection);
    navUsuarios.classList.add('active');
    cargarUsuarios();
  });
  navProductos.addEventListener("click", e => {
    e.preventDefault();
    mostrarSeccion(productosSection);
    navProductos.classList.add('active');
    cargarProductos();
  });
  navCategorias.addEventListener("click", e => {
    e.preventDefault();
    mostrarSeccion(categoriasSection);
    navCategorias.classList.add('active');
    cargarCategoriasCrud();
  });
  navMovimientos.addEventListener("click", e => {
    e.preventDefault();
    mostrarSeccion(movimientosSection);
    navMovimientos.classList.add('active');
    cargarCategoriasParaMovimientos();
    cargarMovimientosRegistrados();
  });

  // Cargar movimientos registrados desde la API y llenar la grilla
  async function cargarMovimientosRegistrados() {
    const cuerpo = document.getElementById("tablaHistorialBody");
    cuerpo.innerHTML = '<tr><td colspan="4">Cargando movimientos...</td></tr>';
    try {
      const res = await fetch("http://localhost:8081/api/movimientos");
      if (!res.ok) throw new Error("No se pudo obtener movimientos");
      const movimientos = await res.json();
      if (!Array.isArray(movimientos) || movimientos.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="4">No hay movimientos registrados</td></tr>';
        return;
      }
      cuerpo.innerHTML = '';
      movimientos.forEach((m, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${m.id || idx + 1}</td>
          <td>${m.fecha ? new Date(m.fecha).toLocaleString() : ''}</td>
          <td>${m.tipo || ''}</td>
          <td><button onclick="verDetallesMovimiento(${m.id})">Ver</button></td>
        `;
        cuerpo.appendChild(tr);
      });
    } catch (e) {
      cuerpo.innerHTML = '<tr><td colspan="4">Error al cargar movimientos</td></tr>';
    }
  }

  window.verDetallesMovimiento = async function(id) {
    try {
      const res = await fetch(`http://localhost:8081/api/movimientos/${id}`);
      if (!res.ok) throw new Error();
      const m = await res.json();
      const modal = document.getElementById("modalDetalle");
      const detalleBody = document.getElementById("modalDetalleBody");
      detalleBody.innerHTML = '';
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${m.fecha ? new Date(m.fecha).toLocaleString() : ''}</td>
        <td>${m.tipo || ''}</td>
        <td>${m.producto && m.producto.categoria ? m.producto.categoria.nombre : ''}</td>
        <td>${m.producto ? m.producto.nombre : ''}</td>
        <td>${m.cantidad}</td>
        <td>${m.motivo || ''}</td>
      `;
      detalleBody.appendChild(fila);
      modal.style.display = "block";
    } catch (e) {
      Swal.fire('Error', 'No se pudo cargar el detalle', 'error');
    }
  }

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
      Swal.fire('Error', 'No se pudo guardar el usuario', 'error');
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
    if (await Swal.fire({title:'¿Eliminar usuario?',showCancelButton:true,icon:'warning'}).then(r=>r.isConfirmed)) {
      const res = await fetch('http://localhost:8081/api/usuarios/' + id, { method: 'DELETE' });
      if (res.ok) cargarUsuarios();
      else Swal.fire('Error', 'No se pudo eliminar', 'error');
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
                  <button class="btn-editar-producto" 
                    data-id="${p.id}"
                    data-nombre="${encodeURIComponent(p.nombre || '')}"
                    data-descripcion="${encodeURIComponent(p.descripcion || '')}"
                    data-stock="${p.stock}"
                    data-precio="${p.precio != null ? p.precio : ''}"
                    data-categoria="${p.categoria ? p.categoria.id : ''}">
                    Editar
                  </button>
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
      cont.querySelectorAll('.btn-editar-producto').forEach(btn => {
        btn.addEventListener('click', function() {
          editarProducto(
            this.dataset.id,
            decodeURIComponent(this.dataset.nombre),
            decodeURIComponent(this.dataset.descripcion),
            this.dataset.stock,
            this.dataset.precio,
            this.dataset.categoria
          );
        });
      });
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
      Swal.fire('Error', 'No se pudo guardar el producto', 'error');
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
    if (await Swal.fire({title:'¿Eliminar producto?',showCancelButton:true,icon:'warning'}).then(r=>r.isConfirmed)) {
      const res = await fetch('http://localhost:8081/api/productos/' + id, { method: 'DELETE' });
      if (res.ok) cargarProductos();
      else Swal.fire('Error', 'No se pudo eliminar', 'error');
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
      Swal.fire('Error', 'No se pudo guardar la categoría', 'error');
    }
  }

  window.editarCategoria = (id, nombre) => {
    document.getElementById('categoriaId').value = id;
    document.getElementById('categoriaNombre').value = nombre;
    document.getElementById('cancelarEdicionCategoria').style.display = 'inline-block';
  };

  window.eliminarCategoria = async (id) => {
    if (await Swal.fire({title:'¿Eliminar categoría?',showCancelButton:true,icon:'warning'}).then(r=>r.isConfirmed)) {
      const res = await fetch('http://localhost:8081/api/categorias/' + id, { method: 'DELETE' });
      if (res.ok) cargarCategoriasCrud();
      else Swal.fire('Error', 'No se pudo eliminar', 'error');
    }
  };

  function limpiarCategoriaForm() {
    document.getElementById('categoriaId').value = '';
    document.getElementById('categoriaNombre').value = '';
    document.getElementById('cancelarEdicionCategoria').style.display = 'none';
  }

  // --- CATEGORÍAS Y PRODUCTOS PARA FORMULARIO DE MOVIMIENTOS ---
  async function cargarCategoriasParaMovimientos() {
    try {
      const response = await fetch("http://localhost:8081/api/categorias");
      const categorias = await response.json();
      const categoriaSelect = document.getElementById("categoriaSelect");
      categoriaSelect.innerHTML = `<option value="">Seleccionar Categoría</option>`;
      categorias.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.nombre;
        categoriaSelect.appendChild(option);
      });
      // Limpia productos
      const productoSelect = document.getElementById("productoSelect");
      productoSelect.innerHTML = `<option value="">Seleccionar Producto</option>`;
      productoSelect.disabled = true;
    } catch (error) {
      console.error("Error al cargar categorías para movimientos:", error);
    }
  }

  document.getElementById("categoriaSelect").addEventListener("change", async function() {
    const idCat = this.value;
    const productoSelect = document.getElementById("productoSelect");
    productoSelect.disabled = true;
    productoSelect.innerHTML = `<option value="">Cargando productos...</option>`;
    try {
      const response = await fetch("http://localhost:8081/api/categorias/" + idCat);
      if (!response.ok) throw new Error();
      const categoria = await response.json();
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
      productoSelect.innerHTML = `<option value="">Error al cargar productos</option>`;
      console.error("Error al cargar productos:", error);
    }
  });

});






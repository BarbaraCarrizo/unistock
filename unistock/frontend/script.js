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
  } else {
    showLogin();
  }

  // 4) Lógica de login
  document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    const u = document.getElementById("usuario").value.trim();
    const p = document.getElementById("contrasena").value.trim();
    const msg = document.getElementById("mensajeLogin");

    if (u === "admin" && p === "admin123") {
      localStorage.setItem("loggedIn", "true");
      showApp();
    } else {
      msg.textContent = "Usuario o contraseña incorrectos.";
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
        await fetch("http://localhost:8081/api/movimientos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tipo: m.tipo,
            cantidad: m.cantidad,
            motivo: m.motivo,
            producto: {
              id: m.productoId
            }
          })
        });
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

  cargarCategorias();
});






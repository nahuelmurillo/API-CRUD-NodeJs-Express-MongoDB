const express = require("express");
const { connectToDB, disconnectFromMongoDB } = require("./src/mongodb");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware para establecer el encabezado Content-Type en las respuestas
app.use((req, res, next) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

// Ruta de inicio
app.get("/", (req, res) => {
  res.status(200).end("Bienvenido a la API de Computacion y sus productos.");
});

// Ruta para obtener todas las listas de Computacion
app.get("/computacion", async (req, res) => {
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de Computacion y convertir los documentos a un array
    const db = client.db("computacion");
    const computacion = await db.collection("computacion").find().toArray();
    res.json(computacion);
  } catch (error) {
    // Manejo de errores al obtener la coleccion de Computacion
    res.status(500).send("Error al obtener la coleccion de Computacion en la base de datos");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para obtener los Productos de Computacion por su ID
app.get("/computacion/:id", async (req, res) => {
  const computacionId = parseInt(req.params.id);
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de computacion y buscar el producto por su ID
    const db = client.db("computacion");
    const compProducto = await db.collection("computacion").findOne({ codigo: computacionId });
    if (compProducto) {
      res.json(compProducto);
    } else {
      res.status(404).send("Producto de Computacion no encontrado");
    }
  } catch (error) {
    // Manejo de errores al obtener el Producto
    res.status(500).send("Error al obtener el Producto de la base de datos");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para obtener el Producto por su nombre
app.get("/computacion/nombre/:nombre", async (req, res) => {
  const computacionNombre = req.params.nombre;
  let productoNombre = RegExp(computacionNombre, "i");
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de Computacion y buscar por su Nombre
    const db = client.db("computacion");
    const producto = await db
      .collection("computacion")
      .find({ nombre: productoNombre })
      .toArray();

    if (producto.length > 0) {
      res.json(producto);
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    // Manejo de errores al obtener el Producto por su Nombre
    res.status(500).send("Error al obtener el Producto de la base de datos");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para obtener Productos de una categoría específica
app.get("/computacion/categoria/:categoria", async (req, res) => {
  const computacionCategoria = req.params.categoria;
  let categoriaNombre = RegExp(computacionCategoria, "i");
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de Categoria
    const db = client.db("computacion");
    const categoria = await db
      .collection("computacion")
      .find({ categoria: categoriaNombre })
      .toArray();

    if (categoria.length > 0) {
      res.json(categoria);
    } else {
      res.status(404).send("Categoria no encontrada");
    }
  } catch (error) {
    // Manejo de errores al obtener la Categoria
    res.status(500).send("Error al obtener la Categoria de la base de datos");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para agregar un nuevo Producto
app.post("/computacion", async (req, res) => {
  const nuevoProducto = req.body;
  try {
    if (nuevoProducto === undefined) {
      res.status(400).send("Error en el formato de datos a crear.");
    }

    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
    }

    const db = client.db("computacion");
    const collection = db.collection("computacion");
    await collection.insertOne(nuevoProducto);
    console.log("Nuevo Producto de Computacion creado");
    res.status(201).send(nuevoProducto);
  } catch (error) {
    // Manejo de errores al agregar producto
    res.status(500).send("Error al intentar agregar un Producto de Computacion");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

//Ruta para modificar un Producto
app.put("/computacion/:id", async (req, res) => {
  const idComputacion = parseInt(req.params.id);
  const nuevosDatos = req.body;

  try {
    if (!nuevosDatos) {
      res.status(400).send("Error en el formato de datos a crear.");
    }

    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
    }

    const db = client.db("computacion");
    const collection = db.collection("computacion");

    await collection.updateOne({ codigo: idComputacion }, { $set: nuevosDatos });

    console.log("Producto Modificado");

    res.status(200).send(nuevosDatos);
  } catch (error) {
    // Manejo de errores al modificar el producto
    res.status(500).send("Error al modificar el Producto de Computacion");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para eliminar un Producto
app.delete("/computacion/:id", async (req, res) => {
  const idComputacion = parseInt(req.params.id);
  try {
    if (!idComputacion) {
      res.status(400).send("Error en el formato de datos a eliminar.");
      return;
    }

    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de Computacion, buscar el producto por su ID y eliminarlo
    const db = client.db("computacion");
    const collection = db.collection("computacion");
    const resultado = await collection.deleteOne({ codigo: idComputacion });
    if (resultado.deletedCount === 0) {
      res
        .status(404)
        .send("No se encontró ningun Producto de Computacion con el id seleccionado.");
    } else {
      console.log("Producto Eliminado");
      res.status(204).send();
    }
  } catch (error) {
    // Manejo de errores al obtener los prodcutos
    res.status(500).send("Error al eliminar el Producto");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

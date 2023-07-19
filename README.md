# API Crud con Node.js , Express y MongoDB 

> Desarrollado por Nahuel Murillo

Colección en formato JSON para poder importar en la bb.dd de MongoDB.

## Endpoints desarrollados
| PETICIÓN | URL | DESCRIPCION |
|:--------:|:---:|:-----------:|
|GET|/|Inicio| 
|GET|/computacion|Obtener todas las listas de Computacion| 
|GET|/computacion/:id|Obtener los Productos de Computacion por su ID| 
|GET|/computacion/nombre/:nombre|Obtener el Producto por su nombre| 
|GET|/computacion/categoria/:categoria|Obtener Productos de una categoría específica| 
|POST|/computacion|Agregar un nuevo Producto| 
|PUT|/computacion/:id|Modificar un recurso| 
|DELETE|/computacion/:id|eliminar un Producto| 

#### A tener en cuenta...
- npm i : para instalar las dependencias.
- .env  : crear archivo .env y dentro de este 2 variables : PORT= 3008 y MONGODB_URLSTRING = "tu-conexion-a-MongoDB".
- npm start : para iniciar servidor.

##### Muchas Gracias, Nahuel Murillo

const BadRequestError = require("../errors/BadRequestError");
const accessNodeService = require("./accessNodeService");
const nodeService = require("./nodeService");
const Node = require("../models/Node");
const Adjacency = require("../models/Adjacency");
const ValidationError = require("../errors/ValidationError");

async function findShortestRoute(type, origin, destination, nomenclature) {
  // Paso 1: Validar que los nodos de origen y destino estén disponibles y existan
  let destinityNode = await nodeService.getNodeById(destination);
  let originNode = await nodeService.getNodeById(origin);

  if (!destinityNode || !originNode) {
    throw new Error("Los nodos de origen y destino seleccionados no existen");
  }

  if (!destinityNode?.available) {
    throw new Error("El punto de destino ha sido desactivado");
  }

  if (!originNode?.available) {
    throw new Error("El punto de origen ha sido desactivado");
  }

  let additionalMessage = null;
  let additionalNode = null;

  // Paso 2: Determinamos el campus de origen y campus de destino
  const campusOrigen = originNode.campus;
  const campusDestino = destinityNode.campus;

  // Paso 3: Comparamos si los campus de origen y destino son los mismos
  if (campusOrigen?._id?.toString() !== campusDestino?._id?.toString()) {
    // Paso 3.1: Si los campus origen y destino son diferentes, se cambia el punto de origen a un punto de acceso del campus de destino
    const accessPoints = await accessNodeService.getAccessNodes({
      campus: campusDestino._id,
    });
    // Obtenemos el primer punto de acceso del campus de destino
    const puntoAcceso = accessPoints[0];

    // Si no hay ningún punto de acceso para ese campus, enviamos un error genérico
    if (!puntoAcceso)
      throw new ValidationError(
        `El punto de origen y destino deben estar en el mismo campus, primero diríjase al campus '${campusDestino.name}' para poder iniciar una ruta`
      );

    originNode = puntoAcceso;
    additionalMessage = `Para seguir la ruta indicada, primero diríjase al punto de acceso del campus '${campusDestino.name}': ${puntoAcceso.detail?.title} (${puntoAcceso.detail?.description}) y luego siga la ruta indicada`;
    additionalNode = puntoAcceso;
  }

  // Paso 4: Buscamos todos los nodos ruta del campus
  const allCampusNodes = await Node.find({
    available: true,
    campus: campusDestino._id,
  }).lean();

  // Paso 5: Buscar las adyacencias entre los nodos ruta del campus de origen
  //5.1 Mapeo para solo tener ids y poder filtrar las adyacencias
  const allCampusNodesId = allCampusNodes.map((node) => node._id.toString());

  // // Añado los nodos de origen y destino
  // routeCampusNodesId.push(originNode._id.toString());
  // routeCampusNodesId.push(destinityNode._id.toString());

  const adjacencies = await Adjacency.find({
    origin: { $in: allCampusNodesId },
    destination: { $in: allCampusNodesId },
  }).lean();

  // Paso 6: Se aplica el algoritmo de Dijkstra para encontrar la ruta más cercana entre el nodo origen y nodo destino
  let { path, totalDistance, distancesBetweenNodes } = findShortestPath(
    originNode._id.toString(),
    destinityNode._id.toString(),
    adjacencies
  );

  path = path.map((id) => ({ node: id }));

  await Promise.all(
    path.map(async (obj, index) => {
      const { node: _id } = obj;
      const result = await Node.findOne({ _id }).lean();

      obj.coordinate = [result.latitude, result.longitude];
      obj.nextNodeDistance = distancesBetweenNodes[index];
    })
  );

  return {
    additionalMessage,
    additionalNode,
    result: { path, totalDistance },
  };
}

// Función para encontrar el nodo no visitado con la distancia mínima
const findMinDistanceNode = (distances, visited) => {
  let minDistance = Infinity;
  let minNode = null;

  for (const node in distances) {
    if (!visited.includes(node) && distances[node].distance <= minDistance) {
      minDistance = distances[node].distance;
      minNode = node;
    }
  }

  return minNode;
};

const findShortestPath = (
  originNodeId,
  destinationNodeId,
  adjacencies = []
) => {
  try {
    // Construye un objeto de grafo para usar con Dijkstra
    const graph = {};

    adjacencies.forEach((adjacency) => {
      const { origin, destination, weight } = adjacency;
      //
      graph[origin] = graph[origin] || {};
      graph[origin][destination] = weight;
      // Como es un grafo no dirigido, lo añado en lo contrario también
      graph[destination] = graph[destination] || {};
      graph[destination][origin] = weight;
    });

    // Inicializar distancias y rutas
    const distances = { [originNodeId]: { distance: 0, path: [originNodeId] } };

    // Inicializar lista de nodos visitados
    const visited = [];

    // Encontrar la ruta más corta utilizando Dijkstra
    let currentNode = originNodeId;

    while (currentNode !== destinationNodeId) {
      visited.push(currentNode);

      for (const neighbor in graph[currentNode]) {
        const totalDistance =
          distances[currentNode].distance + graph[currentNode][neighbor];

        if (
          !distances[neighbor] ||
          totalDistance < distances[neighbor].distance
        ) {
          distances[neighbor] = {
            distance: totalDistance,
            path: [...distances[currentNode].path, neighbor],
          };
        }
      }

      currentNode = findMinDistanceNode(distances, visited);

      if (currentNode === null) {
        throw new Error(
          "No se ha podido encontrar una ruta entre el punto de origen y destino dado"
        );
      }
    }

    // Obtener el camino, la distancia total y las distancias entre nodos
    const shortestPath = distances[destinationNodeId].path;
    const totalDistance = distances[destinationNodeId].distance;
    const distancesBetweenNodes = shortestPath.map((node, index) => {
      if (index + 1 < shortestPath.length) {
        return graph[node][shortestPath[index + 1]];
      }
      return 0;
    });

    return { path: shortestPath, totalDistance, distancesBetweenNodes };
  } catch (error) {
    console.log({ error });
    // console.log(error.message);
    // console.log(error.name);

    throw new BadRequestError(
      "No se ha podido encontrar una ruta entre el punto de origen y destino dado"
    );
  }
};

module.exports = { findShortestRoute };

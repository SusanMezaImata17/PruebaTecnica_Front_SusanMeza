import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";  // Importa SweetAlert2
import './BusList.css';

const BusList = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/bus?page=${page}&size=${size}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los buses");
        }
        return response.json();
      })
      .then((data) => {
        setBuses(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [page, size]);

  const handleViewDetails = (id) => {
    fetch(`/bus/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los detalles del bus");
        }
        return response.json();
      })
      .then((data) => {
        // Cambia el título de la página cuando se vean los detalles
        document.title = `Detalles del Bus ${data.numeroBus}`;

        // Muestra el detalle del bus usando SweetAlert2
        Swal.fire({
          title: 'Detalles del Bus',
          html: `
            <p><strong>Número:</strong> ${data.numeroBus}</p>
            <p><strong>Placa:</strong> ${data.placa}</p>
            <p><strong>Características:</strong> ${data.caracteristicas}</p>
            <p><strong>Fecha de Creación:</strong> ${new Date(data.fechaCreacion).toLocaleString()}</p>
            <p><strong>Activo:</strong> ${data.activo ? 'Sí' : 'No'}</p>
          `,
          icon: 'info',
          confirmButtonText: 'Aceptar'
        });
      })
      .catch((error) => Swal.fire('Error', error.message, 'error'));
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bus-container">
      <h2>Lista de Buses</h2>
      <table className="bus-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número de Bus</th>
            <th>Placa</th>
            <th>Características</th>
            <th>Fecha de Creación</th>
            <th>Activo</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {buses.length === 0 ? (
            <tr>
              <td colSpan="7">No hay buses disponibles</td>
            </tr>
          ) : (
            buses.map((bus) => (
              <tr key={bus.id}>
                <td>{bus.id}</td>
                <td>{bus.numeroBus}</td>
                <td>{bus.placa}</td>
                <td>{bus.caracteristicas}</td>
                <td>{new Date(bus.fechaCreacion).toLocaleString()}</td>
                <td>{bus.activo ? "Activo" : "Inactivo"}</td>
                <td>
                  <button className="view-details-btn" onClick={() => handleViewDetails(bus.id)}>
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button className="pagination-btn" onClick={() => setPage(page - 1)} disabled={page <= 0}>
          Anterior
        </button>
        <button
          className="pagination-btn"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages - 1}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default BusList;

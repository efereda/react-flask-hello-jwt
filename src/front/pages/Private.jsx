import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}api/private`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 404) {
          sessionStorage.removeItem("token");
          navigate("/login");
        }
        return res.json();
      })
      .then((data) => {
        if (data.msg) setMessage(data.msg);
      })
      .catch(() => setMessage("Error al obtener los datos"));
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Zona Privada</h2>
      <p className="mt-3">{message}</p>
      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

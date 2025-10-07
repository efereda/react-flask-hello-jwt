import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Error al registrarse");
        return;
      }

      setMsg("Usuario creado exitosamente. Ahora podés iniciar sesión.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Crear cuenta</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Ingresa tu correo"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Crea una contraseña"
          />
        </div>

        {error && <p className="text-danger text-center">{error}</p>}
        {msg && <p className="text-success text-center">{msg}</p>}

        <button type="submit" className="btn btn-success w-100">
          Registrarme
        </button>
      </form>

      <p className="text-center mt-3">
        ¿Ya tenés cuenta?{" "}
        <button
          className="btn btn-link p-0"
          onClick={() => navigate("/login")}
        >
          Iniciá sesión
        </button>
      </p>
    </div>
  );
};

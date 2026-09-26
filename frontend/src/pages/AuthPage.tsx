import { useState, FormEvent } from "react";
import { loginUser, registerUser } from "../api/auth";
import "../styles/auth.scss";

type Mode = "login" | "register";

function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const data = await loginUser({ phone, password });
        localStorage.setItem("access_token", data.access_token);
        alert("Вход выполнен!");
      } else {
        await registerUser({ phone, password });
        alert("Регистрация успешна! Теперь войдите.");
        setMode("login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob--1" />
      <div className="auth-blob auth-blob--2" />

      <div className="auth-content">
        <div className="auth-intro">
          <span className="auth-logo">People</span>
          <h1>Один эфир — любой язык</h1>
          <p>
            Синхронный перевод трансляций для бизнеса, голосовые комнаты и люди
            по интересам — в одном месте.
          </p>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Вход
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="phone">Телефон</label>
            <input
              id="phone"
              type="tel"
              placeholder="+77001234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Подождите..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
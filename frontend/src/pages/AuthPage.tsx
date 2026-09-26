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
          <label>
            Телефон
            <input
              type="tel"
              placeholder="+77001234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>

          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Подождите..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
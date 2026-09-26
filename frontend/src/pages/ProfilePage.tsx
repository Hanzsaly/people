import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, UserOut } from "../api/auth";
import "../styles/profile.scss";

function ProfilePage() {
  const [user, setUser] = useState<UserOut | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("access_token");
        navigate("/auth", { replace: true });
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/auth", { replace: true });
  };

  if (!user) {
    return <p className="page-loading">Загрузка...</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-avatar">{user.phone.slice(-2)}</div>
      <h1>{user.phone}</h1>
      <p className="profile-id">ID пользователя: {user.id}</p>
      <button className="logout-btn" onClick={handleLogout}>
        Выйти
      </button>
    </div>
  );
}

export default ProfilePage;
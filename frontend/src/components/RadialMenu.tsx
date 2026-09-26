import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Users, Search, LayoutGrid, Menu } from "lucide-react";
import "../styles/radial-menu.scss";

const ITEMS = [
  { to: "/profile", label: "Профиль", icon: User },
  { to: "/friends", label: "Друзья", icon: Users },
  { to: "/search", label: "Поиск", icon: Search },
  { to: "/groups", label: "Группы", icon: LayoutGrid },
];

const RADIUS = 150;
const ARC_START = -90;
const ARC_END = 0;
const SUPPRESS_MS = 400;

// Должны совпадать с left/bottom кнопки .radial-hub в radial-menu.scss
const HUB_OFFSET_LEFT = 30;
const HUB_OFFSET_BOTTOM = 30;
const HUB_HIT_RADIUS = 34;

function itemAngleDeg(index: number) {
  const step = (ARC_END - ARC_START) / (ITEMS.length - 1);
  return ARC_START + step * index;
}

function RadialMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const suppressedRef = useRef(false);
  const openRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const suppressTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateOpenState = (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const hubCenterX = rect.left + HUB_OFFSET_LEFT;
      const hubCenterY = rect.bottom - HUB_OFFSET_BOTTOM;

      let shouldOpen: boolean;

      if (openRef.current) {
        // уже открыто — держим, пока курсор где-то в пределах всей дуги
        shouldOpen =
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom;
      } else {
        // закрыто — открываем, только если курсор реально над кнопкой
        const dist = Math.hypot(clientX - hubCenterX, clientY - hubCenterY);
        shouldOpen = !suppressedRef.current && dist <= HUB_HIT_RADIUS;
      }

      if (shouldOpen !== openRef.current) {
        openRef.current = shouldOpen;
        setOpen(shouldOpen);
      }
    };

    const handleMove = (e: MouseEvent) => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        updateOpenState(e.clientX, e.clientY);
      });
    };

    document.addEventListener("mousemove", handleMove);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (suppressTimeoutRef.current !== null) {
        window.clearTimeout(suppressTimeoutRef.current);
      }
    };
  }, []);

  const handleSelect = (to: string) => {
    suppressedRef.current = true;
    openRef.current = false;
    setOpen(false);
    navigate(to);

    suppressTimeoutRef.current = window.setTimeout(() => {
      suppressedRef.current = false;
    }, SUPPRESS_MS);
  };

  return (
    <div ref={containerRef} className="radial-menu">
      {open &&
        ITEMS.map((item, i) => {
          const rad = (itemAngleDeg(i) * Math.PI) / 180;
          const x = Math.cos(rad) * RADIUS;
          const y = Math.sin(rad) * RADIUS;
          const Icon = item.icon;
          return (
            <button
              key={item.to}
              className="radial-item"
              style={{
                ["--tx" as string]: `${x}px`,
                ["--ty" as string]: `${y}px`,
                animationDelay: `${i * 40}ms`,
              }}
              onClick={() => handleSelect(item.to)}
            >
              <Icon size={20} strokeWidth={2} />
              <span>{item.label}</span>
            </button>
          );
        })}

      <button className={open ? "radial-hub open" : "radial-hub"} aria-label="Меню навигации">
        <Menu size={24} strokeWidth={2} />
      </button>
    </div>
  );
}

export default RadialMenu;
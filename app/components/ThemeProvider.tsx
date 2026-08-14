"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setTheme } from "../store/themeSlice";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);
  const initialized = useRef(false);

  // ←←← فقط یک بار بعد از mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const hasDataTheme = root.getAttribute("data-theme");

    let actual: "light" | "dark" = "light";

    if (stored === "dark" || stored === "light") {
      actual = stored;
    } else if (systemDark) {
      actual = "dark";
    }

    // ست کردن اولیه
    root.setAttribute("data-theme", actual);
    
    if (actual !== mode) {
      dispatch(setTheme(actual));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ←←← هر بار mode عوض شد → data-theme آپدیت
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("theme", mode);
  }, [mode]);

  return <>{children}</>;
}
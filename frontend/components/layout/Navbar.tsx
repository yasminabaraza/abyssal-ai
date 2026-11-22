"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PATHS } from "@/constants/paths";
import { useAuth } from "@/context/AuthContext";
import useActiveGame from "@/hooks/useActiveGame";

interface NavDropdownItem {
  label: string;
  href: string;
  disabled?: boolean;
}

interface NavRoute {
  label: string;
  href?: string;
  onClick?: () => void;
  dropdown?: NavDropdownItem[];
}

function formatRoomUrl(order: number): string {
  return String(order).padStart(2, "0");
}

const ALL_ROOMS = [
  { order: 1, label: "Sala 01" },
  { order: 2, label: "Sala 02" },
  { order: 3, label: "Sala 03" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isAuthenticated, user } = useAuth();
  const { data: activeGameData } = useActiveGame();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  function closeMobileMenu() {
    mobileMenuRef.current?.removeAttribute("open");
  }

  const activeGame =
    activeGameData?.game && activeGameData.game.status === "active"
      ? activeGameData.game
      : null;

  let routesToRender: NavRoute[];

  if (pathname === PATHS.HOME && !isAuthenticated) {
    routesToRender = [
      { label: "Entrar", href: PATHS.NARRATIVE },
      { label: "Registrar-se", href: PATHS.REGISTER },
    ];
  } else {
    routesToRender = [{ label: "Narrativa", href: PATHS.NARRATIVE }];

    if (activeGame) {
      const currentOrder = activeGame.currentRoom.order;
      const roomsDropdown: NavDropdownItem[] = ALL_ROOMS.map((room) => ({
        label: room.label,
        href: `${PATHS.ROOM}/${formatRoomUrl(room.order)}`,
        disabled: room.order > currentOrder,
      }));

      routesToRender.push({ label: "Sales", dropdown: roomsDropdown });
    }

    routesToRender.push(
      { label: "Instruccions", href: PATHS.INSTRUCCIONS },
      { label: "Rànquing", href: "/ranking" },
      { label: "Perfil", href: PATHS.PROFILE },
    );

    if (user?.role === "admin") {
      routesToRender.push({ label: "Admin", href: PATHS.ADMIN });
    }

    routesToRender.push({
      label: "Logout",
      onClick: () => {
        logout();
        router.push(PATHS.HOME);
      },
    });
  }

  return (
    <nav className="sticky top-0 w-full z-50 backdrop-blur-sm bg-slate-950/70">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-6">
        <Link
          href={PATHS.HOME}
          onClick={closeMobileMenu}
          className="text-xl font-bold tracking-tighter text-cyan-400 hover:text-cyan-200"
        >
          ABYSS AI
        </Link>

        <details ref={mobileMenuRef} className="relative md:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center rounded border border-cyan-500/40 px-3 text-sm font-bold text-cyan-200">
            ☰ Menú
          </summary>

          <div className="absolute right-0 top-full z-50 mt-2 max-h-[70dvh] w-56 overflow-y-auto rounded border border-cyan-500/30 bg-slate-950 p-2 text-sm text-cyan-200">
            {routesToRender.map((route) => {
              if (route.dropdown) {
                return (
                  <details key={route.label} className="px-3">
                    <summary className="flex min-h-11 cursor-pointer items-center gap-2">
                      {route.label} <span aria-hidden="true">▾</span>
                    </summary>

                    <div className="pl-3">
                      {route.dropdown.map((item) =>
                        item.disabled ? (
                          <span
                            key={item.href}
                            aria-disabled="true"
                            className="block py-3 text-cyan-400/60 line-through"
                          >
                            {item.label}
                          </span>
                        ) : (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMobileMenu}
                            aria-current={
                              pathname === item.href ? "page" : undefined
                            }
                            className="block py-3"
                          >
                            {item.label}
                          </Link>
                        ),
                      )}
                    </div>
                  </details>
                );
              }

              if (route.href) {
                return (
                  <Link
                    key={route.label}
                    href={route.href}
                    onClick={closeMobileMenu}
                    aria-current={pathname === route.href ? "page" : undefined}
                    className="flex min-h-11 items-center px-3"
                  >
                    {route.label}
                  </Link>
                );
              }

              return (
                <button
                  key={route.label}
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    route.onClick?.();
                  }}
                  className="block min-h-11 w-full px-3 text-left"
                >
                  {route.label}
                </button>
              );
            })}
          </div>
        </details>

        <div className="hidden md:flex gap-8 text-[10px] tracking-[0.3em] text-cyan-800 uppercase font-bold">
          {routesToRender.map((route) =>
            route.dropdown ? (
              <div key={route.label} className="relative group">
                <span className="cursor-pointer hover:text-cyan-400">
                  {route.label}
                </span>

                <div className="absolute left-0 top-full hidden group-hover:block pt-2 z-50">
                  <div className="flex flex-col bg-cyan-950 border border-cyan-500/30 p-2">
                    {route.dropdown.map((item) =>
                      item.disabled ? (
                        <span
                          key={item.href}
                          aria-disabled="true"
                          className="text-cyan-800/60 text-sm py-1 cursor-not-allowed line-through"
                        >
                          {item.label}
                        </span>
                      ) : (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="text-cyan-400 text-sm py-1 hover:text-cyan-200"
                        >
                          {item.label}
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ) : route.href ? (
              <Link
                key={route.label}
                href={route.href}
                className={`cursor-pointer ${
                  pathname === route.href
                    ? "text-cyan-400 border-b border-cyan-400 pb-1"
                    : "hover:text-cyan-400"
                }`}
              >
                {route.label}
              </Link>
            ) : (
              <button
                key={route.label}
                type="button"
                onClick={route.onClick}
                className="cursor-pointer hover:text-cyan-400 tracking-[0.3em] uppercase font-bold"
              >
                {route.label}
              </button>
            ),
          )}
        </div>
      </div>
    </nav>
  );
}

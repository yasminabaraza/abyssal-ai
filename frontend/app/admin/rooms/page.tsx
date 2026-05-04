"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { authRequest } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import { Room } from "@/types/game";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authRequest<{ rooms: Room[] }>(ENDPOINTS.admin.rooms);
      setRooms(res.rooms);
    } catch {
      setError("No s'han pogut carregar les sales");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const sorted = [...rooms].sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen bg-[#010d16] text-cyan-50 font-mono flex flex-col">
      <Navbar />
      <div className="flex-1 px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <div className="text-[10px] tracking-[0.5em] text-cyan-900 uppercase mb-1">
            Administració — Gestió de Sales
          </div>
          <h1 className="text-3xl font-black tracking-widest text-cyan-400 uppercase">
            SALES
          </h1>
          <p className="text-cyan-800 text-xs mt-1">
            {rooms.length} sales registrades
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={fetchRooms}
            className="border border-cyan-900 hover:border-cyan-600 text-cyan-700 hover:text-cyan-400 px-4 py-2 text-xs tracking-widest uppercase transition-colors"
          >
            ↺ Recarregar
          </button>
        </div>

        {error && (
          <div className="border border-red-900 text-red-400 text-xs px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-cyan-800 text-xs tracking-widest animate-pulse uppercase text-center py-20">
            Carregant sales...
          </div>
        ) : (
          <div className="border border-cyan-900 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-cyan-900 text-cyan-700 uppercase tracking-widest">
                  <th className="text-left px-4 py-3">Ordre</th>
                  <th className="text-left px-4 py-3">Nom</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">
                    Descripció
                  </th>
                  <th className="text-left px-4 py-3">Inicial</th>
                  <th className="text-right px-4 py-3">Accions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-cyan-800 py-12 tracking-widest"
                    >
                      Cap sala trobada
                    </td>
                  </tr>
                )}
                {sorted.map((room) => (
                  <tr
                    key={room.id}
                    className="border-b border-cyan-900/40 hover:bg-cyan-950/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-cyan-700 font-mono">
                      #{String(room.order).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/rooms/${room.id}`}
                        className="text-cyan-300 hover:text-cyan-100 font-bold tracking-wide transition-colors"
                      >
                        {room.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-cyan-600 hidden sm:table-cell max-w-md truncate">
                      {room.description}
                    </td>
                    <td className="px-4 py-3">
                      {room.isInitial ? (
                        <span className="px-2 py-0.5 border border-amber-700 text-amber-400 text-[10px] tracking-widest uppercase font-bold">
                          Inicial
                        </span>
                      ) : (
                        <span className="text-cyan-900">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/rooms/${room.id}`}
                          className="text-cyan-700 hover:text-cyan-400 transition-colors px-2 py-1 border border-transparent hover:border-cyan-800 text-[10px] tracking-widest uppercase"
                        >
                          ✎ Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

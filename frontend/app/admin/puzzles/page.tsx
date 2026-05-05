"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import { authRequest } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";

interface AdminHint {
  id: number;
  text: string;
  order: number;
}

interface AdminPuzzle {
  id: number;
  roomId: number;
  title: string;
  statement: string;
  solution: string;
  reward: string | null;
  room: { id: number; name: string; order: number };
  hints: AdminHint[];
}

export default function PuzzlesPage() {
  const [puzzles, setPuzzles] = useState<AdminPuzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<AdminPuzzle | null>(null);

  const fetchPuzzles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authRequest<{ puzzles: AdminPuzzle[] }>(
        ENDPOINTS.admin.puzzles,
      );
      setPuzzles(res.puzzles);
    } catch {
      setError("No s'han pogut carregar els enigmes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPuzzles();
  }, [fetchPuzzles]);

  const filtered = puzzles
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.room.name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.room.order - b.room.order || a.id - b.id);

  return (
    <main className="min-h-screen bg-[#010d16] text-cyan-50 font-mono flex flex-col">
      <Navbar />
      <div className="flex-1 px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <div className="text-[10px] tracking-[0.5em] text-cyan-900 uppercase mb-1">
            Administració — Gestió d&apos;Enigmes
          </div>
          <h1 className="text-3xl font-black tracking-widest text-cyan-400 uppercase">
            ENIGMES
          </h1>
          <p className="text-cyan-800 text-xs mt-1">
            {puzzles.length} enigmes registrats
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Cercar per títol o sala..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border border-cyan-900 text-cyan-300 placeholder-cyan-800 px-4 py-2 text-xs tracking-wide focus:outline-none focus:border-cyan-600 transition-colors"
          />
          <button
            onClick={fetchPuzzles}
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
            Carregant enigmes...
          </div>
        ) : (
          <div className="border border-cyan-900 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-cyan-900 text-cyan-700 uppercase tracking-widest">
                  <th className="text-left px-4 py-3">Sala</th>
                  <th className="text-left px-4 py-3">Títol</th>
                  <th className="text-left px-4 py-3">Solució</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">
                    Recompensa
                  </th>
                  <th className="text-left px-4 py-3">Pistes</th>
                  <th className="text-right px-4 py-3">Accions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center text-cyan-800 py-12 tracking-widest"
                    >
                      Cap enigma trobat
                    </td>
                  </tr>
                )}
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-cyan-900/40 hover:bg-cyan-950/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-cyan-700 font-mono">
                      #{String(p.room.order).padStart(2, "0")}{" "}
                      <span className="text-cyan-600">{p.room.name}</span>
                    </td>
                    <td className="px-4 py-3 text-cyan-300 font-bold tracking-wide">
                      {p.title}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          setRevealed((r) => ({ ...r, [p.id]: !r[p.id] }))
                        }
                        className="text-left font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        {revealed[p.id] ? p.solution : "•••••• (mostrar)"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-cyan-600 hidden sm:table-cell max-w-xs truncate">
                      {p.reward || <span className="text-cyan-900">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 border border-cyan-900 text-cyan-500 text-[10px] tracking-widest uppercase">
                        {p.hints.length}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelected(p)}
                          className="text-cyan-700 hover:text-cyan-400 transition-colors px-2 py-1 border border-transparent hover:border-cyan-800 text-[10px] tracking-widest uppercase"
                        >
                          Detalls
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-right text-[10px] text-cyan-800 mt-2 tracking-widest uppercase">
          {filtered.length} de {puzzles.length} enigmes
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(1,13,22,0.92)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-2xl border border-cyan-800 bg-[#010d16] rounded-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cyan-900 px-6 py-4">
              <div>
                <div className="text-[10px] tracking-[0.4em] text-cyan-800 uppercase mb-1">
                  Enigma · {selected.room.name}
                </div>
                <h2 className="text-lg font-black tracking-widest text-cyan-400 uppercase">
                  {selected.title}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-cyan-700 hover:text-cyan-400 transition-colors text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              <div>
                <div className="text-[10px] text-cyan-800 tracking-widest uppercase mb-2">
                  Enunciat
                </div>
                <p className="text-cyan-300 text-sm whitespace-pre-wrap">
                  {selected.statement}
                </p>
              </div>

              <div>
                <div className="text-[10px] text-cyan-800 tracking-widest uppercase mb-2">
                  Solució
                </div>
                <p className="text-emerald-400 font-mono text-sm border border-emerald-900/50 px-3 py-2 inline-block">
                  {selected.solution}
                </p>
              </div>

              {selected.reward && (
                <div>
                  <div className="text-[10px] text-cyan-800 tracking-widest uppercase mb-2">
                    Recompensa
                  </div>
                  <p className="text-amber-400 text-sm">{selected.reward}</p>
                </div>
              )}

              <div>
                <div className="text-[10px] text-cyan-800 tracking-widest uppercase mb-2">
                  Pistes ({selected.hints.length})
                </div>
                {selected.hints.length === 0 ? (
                  <p className="text-cyan-900 text-xs">Cap pista definida</p>
                ) : (
                  <ol className="space-y-2">
                    {selected.hints.map((h) => (
                      <li
                        key={h.id}
                        className="border border-cyan-900/50 px-3 py-2 text-xs flex gap-3"
                      >
                        <span className="text-cyan-700 font-bold">
                          {h.order}.
                        </span>
                        <span className="text-cyan-400">{h.text}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

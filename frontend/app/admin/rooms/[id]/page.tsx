"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { authRequest } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import { Room } from "@/types/game";

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = Number(params.id);

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    order: 0,
    isInitial: false,
  });

  useEffect(() => {
    if (!roomId) return;

    authRequest<{ room: Room }>(`${ENDPOINTS.admin.rooms}/${roomId}`)
      .then(({ room: data }) => {
        setRoom(data);
        setFormData({
          name: data.name,
          description: data.description,
          image: data.image || "",
          order: data.order,
          isInitial: data.isInitial,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;

    setSaving(true);
    try {
      await authRequest(ENDPOINTS.admin.updateRoom(roomId), "PATCH", formData);
      router.push("/admin/rooms");
    } catch (error) {
      console.error("Error updating room:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const inputClass =
    "w-full bg-transparent border border-cyan-900 text-cyan-300 placeholder-cyan-800 px-3 py-2 text-xs tracking-wide focus:outline-none focus:border-cyan-600 transition-colors";
  const labelClass =
    "block text-[10px] tracking-[0.3em] text-cyan-700 uppercase mb-2";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#010d16] text-cyan-50 font-mono flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-cyan-800 text-xs tracking-widest animate-pulse uppercase">
            Carregant sala...
          </div>
        </div>
      </main>
    );
  }

  if (!room) {
    return (
      <main className="min-h-screen bg-[#010d16] text-cyan-50 font-mono flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-400 text-xs tracking-widest uppercase">
            Sala no trobada
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#010d16] text-cyan-50 font-mono flex flex-col">
      <Navbar />
      <div className="flex-1 px-4 sm:px-8 py-8 max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <div className="text-[10px] tracking-[0.5em] text-cyan-900 uppercase mb-1">
            Administració — Editar Sala
          </div>
          <h1 className="text-3xl font-black tracking-widest text-cyan-400 uppercase">
            {room.name}
          </h1>
          <p className="text-cyan-800 text-xs mt-1">
            #{String(room.order).padStart(2, "0")} · ID {room.id}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-cyan-900 p-6 space-y-5"
        >
          <div>
            <label className={labelClass}>Nom</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Nom de la sala"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Descripció</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={inputClass}
              placeholder="Descripció de la sala"
              rows={3}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Imatge (URL)</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://... (opcional)"
            />
          </div>
          <div>
            <label className={labelClass}>Ordre</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className={inputClass}
              placeholder="0"
              min="0"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer text-cyan-500 hover:text-cyan-300 transition-colors text-xs tracking-widest uppercase">
              <input
                type="checkbox"
                name="isInitial"
                checked={formData.isInitial}
                onChange={handleChange}
                className="accent-cyan-500"
              />
              És la sala inicial
            </label>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-cyan-900/40">
            <button
              type="button"
              onClick={() => router.push("/admin/rooms")}
              className="border border-cyan-900 text-cyan-600 hover:text-cyan-400 hover:border-cyan-700 px-4 py-2 text-xs tracking-widest uppercase transition-colors"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="border border-cyan-700 text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-500 px-4 py-2 text-xs tracking-widest uppercase transition-colors disabled:opacity-40"
            >
              {saving ? "Guardant..." : "✓ Guardar"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { requireAdmin } from "../middlewares/requireAdmin";
import {
  adminListUsers,
  adminGetUserStats,
  adminUpdateUserRole,
  adminDeleteUser,
  adminListRooms,
  adminGetRoom,
  adminUpdateRoom,
  adminListPuzzles,
} from "../controllers/admin.controller";

const router = Router();

// El router queda protegit: cal token + cal admin
router.use(authenticate, requireAdmin);

// GET /admin/users -> llistar usuaris
router.get("/users", adminListUsers);

// GET /admin/users/:id/stats -> estadístiques d'un usuari
router.get("/users/:id/stats", adminGetUserStats);

// PATCH /admin/users/:id/role -> canviar rol
router.patch("/users/:id/role", adminUpdateUserRole);

// DELETE /admin/users/:id -> eliminar usuari (amb seguretat)
router.delete("/users/:id", adminDeleteUser);

// Rutes per a gestió de sales

router.get("/rooms", adminListRooms);
router.get("/rooms/:id", adminGetRoom);
router.patch("/rooms/:id", adminUpdateRoom);

// Rutes per a gestió de puzzles
router.get("/puzzles", adminListPuzzles);

/* =========================
   FUTURO (extensión opcional)
   - POST /rooms
   - DELETE /rooms/:id
   - POST /puzzles
   - PATCH /puzzles/:id
   - DELETE /puzzles/:id
========================= */

export default router;

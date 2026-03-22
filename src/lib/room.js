import {
  ref,
  set,
  push,
  update,
  onValue,
  get,
  serverTimestamp,
} from "firebase/database";
import { database } from "./firebase";

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createRoom(playerCount) {
  let code = generateRoomCode();
  let attempts = 0;

  // Check for collisions (unlikely but safe)
  while (attempts < 5) {
    const snapshot = await get(ref(database, `rooms/${code}`));
    if (!snapshot.exists()) break;
    code = generateRoomCode();
    attempts++;
  }

  await set(ref(database, `rooms/${code}`), {
    createdAt: serverTimestamp(),
    playerCount,
    started: false,
  });

  return code;
}

export async function joinRoom(roomCode, playerName) {
  const playerRef = push(ref(database, `rooms/${roomCode}/players`));
  await set(playerRef, {
    name: playerName,
    cuisine: null,
    finishedAt: null,
  });
  return playerRef.key;
}

export function subscribeToRoom(roomCode, callback) {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const unsubscribe = onValue(roomRef, (snapshot) => {
    callback(snapshot.val());
  });
  return unsubscribe;
}

export async function submitResult(roomCode, playerId, cuisineKey) {
  await update(ref(database, `rooms/${roomCode}/players/${playerId}`), {
    cuisine: cuisineKey,
    finishedAt: serverTimestamp(),
  });
}

export async function startGame(roomCode) {
  await update(ref(database, `rooms/${roomCode}`), {
    started: true,
  });
}

export async function roomExists(roomCode) {
  const snapshot = await get(ref(database, `rooms/${roomCode}`));
  return snapshot.exists();
}

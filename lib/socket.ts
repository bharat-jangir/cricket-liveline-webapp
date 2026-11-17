"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { apiSocketOrigin } from "./api";
import type { Rec } from "./types";

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(`${apiSocketOrigin}/live`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1500,
      reconnectionDelayMax: 10000,
      autoConnect: true,
    });
  }
  return socket;
}

type Handlers = Record<string, (payload: Rec) => void>;

/**
 * Subscribes to a match room (or the live listing room when matchId is null).
 * Returns connection state so the UI can fall back to polling when offline.
 */
export function useLiveSocket(room: { matchId: string } | "listing", handlers: Handlers) {
  const [connected, setConnected] = useState(false);
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  const key = room === "listing" ? "listing" : room.matchId;

  useEffect(() => {
    const s = getSocket();
    const join = () => {
      setConnected(true);
      if (key === "listing") s.emit("join_live_listing");
      else s.emit("join_match", { matchId: key });
    };
    const leave = () => setConnected(false);

    const events = Object.keys(handlersRef.current);
    const bound = events.map((ev) => {
      const fn = (payload: Rec) => handlersRef.current[ev]?.(payload);
      s.on(ev, fn);
      return [ev, fn] as const;
    });

    s.on("connect", join);
    s.on("disconnect", leave);
    if (s.connected) join();

    return () => {
      s.off("connect", join);
      s.off("disconnect", leave);
      bound.forEach(([ev, fn]) => s.off(ev, fn));
      if (s.connected) {
        if (key === "listing") s.emit("leave_live_listing");
        else s.emit("leave_match", { matchId: key });
      }
    };
  }, [key]);

  return connected;
}

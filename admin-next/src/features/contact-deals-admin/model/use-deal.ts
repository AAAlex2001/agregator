"use client";

import { useEffect, useReducer } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { fetchDeal, releaseDeal } from "@/entities/contact-deal";
import { dealReducer } from "./reducers";

const MIN_NOTE_LENGTH = 3;

/** Карточка сделки и ручная выдача контактов покупателю. */
export const useDeal = (id: number) => {
  const toast = useToast();
  const [state, dispatch] = useReducer(dealReducer, { status: "loading", deal: null, note: "", pending: false });

  useEffect(() => {
    let active = true;

    fetchDeal(id)
      .then((deal) => {
        if (active) dispatch({ type: "load/success", deal });
      })
      .catch(() => {
        if (active) dispatch({ type: "load/error" });
      });

    return () => {
      active = false;
    };
  }, [id]);

  const changeNote = (value: string) => dispatch({ type: "note/change", value });

  const canRelease = state.note.trim().length >= MIN_NOTE_LENGTH;

  const release = async () => {
    if (!canRelease) return;

    dispatch({ type: "release/start" });

    try {
      dispatch({ type: "load/success", deal: await releaseDeal(id, state.note.trim()) });
      toast("Контакты выданы покупателю");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось выдать контакты"), "error");
    } finally {
      dispatch({ type: "release/finish" });
    }
  };

  return { state, canRelease, changeNote, release };
};

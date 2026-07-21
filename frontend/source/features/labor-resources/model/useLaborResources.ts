"use client";

import {
  useEffect,
  useReducer,
} from "react";
import { useRouter } from "next/navigation";
import {
  closeLaborListing,
  contactLaborListing,
  fetchLaborListings,
  type LaborListingData,
} from "@/source/entities/labor";
import { useSession } from "@/source/features/session";
import { LABOR_PAGE_COPY } from "./config";
import {
  initialLaborResourcesState,
  laborResourcesReducer,
} from "./resources.reducer";
import type {
  LaborListTab,
  LaborPageMode,
} from "./types";

export function useLaborResources(mode: LaborPageMode) {
  const router = useRouter();
  const { role } = useSession();
  const copy = LABOR_PAGE_COPY[mode];
  const [state, dispatch] = useReducer(
    laborResourcesReducer,
    initialLaborResourcesState,
  );

  useEffect(() => {
    let active = true;

    const loadCurrentTab = async () => {
      dispatch({ type: "LOADING", value: true });
      dispatch({ type: "ERROR", value: null });

      try {
        const kind =
          state.tab === "mine"
            ? copy.ownKind
            : copy.browseKind;
        const items = await fetchLaborListings(
          kind,
          state.tab === "mine",
        );
        if (active) {
          dispatch({ type: "DATA", items });
        }
      } catch (reason) {
        if (active) {
          dispatch({
            type: "ERROR",
            value:
              reason instanceof Error
                ? reason.message
                : "Не удалось загрузить заявки",
          });
        }
      } finally {
        if (active) {
          dispatch({ type: "LOADING", value: false });
        }
      }
    };

    void loadCurrentTab();
    return () => {
      active = false;
    };
  }, [
    copy.browseKind,
    copy.ownKind,
    state.reloadKey,
    state.tab,
  ]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1100px)");
    const syncLayout = () => {
      dispatch({ type: "DESKTOP", value: media.matches });
    };

    syncLayout();
    media.addEventListener("change", syncLayout);

    return () => {
      media.removeEventListener("change", syncLayout);
    };
  }, []);

  const setTab = (tab: LaborListTab) => {
    dispatch({ type: "TAB", value: tab });
  };

  const setFormOpen = (value: boolean) => {
    dispatch({ type: "FORM_OPEN", value });
  };

  const onCreated = () => {
    setFormOpen(false);

    if (state.tab === "mine") {
      dispatch({ type: "RELOAD" });
      return;
    }
    setTab("mine");
  };

  const contact = async (item: LaborListingData) => {
    dispatch({ type: "BUSY", id: item.id });
    dispatch({ type: "ERROR", value: null });

    try {
      const uuid = await contactLaborListing(item.id);
      router.push(`/chat/${uuid}`);
    } catch (reason) {
      dispatch({
        type: "ERROR",
        value:
          reason instanceof Error
            ? reason.message
            : "Не удалось открыть чат",
      });
    } finally {
      dispatch({ type: "BUSY", id: null });
    }
  };

  const close = async (item: LaborListingData) => {
    dispatch({ type: "BUSY", id: item.id });
    dispatch({ type: "ERROR", value: null });

    try {
      await closeLaborListing(item.id);
      dispatch({ type: "RELOAD" });
    } catch (reason) {
      dispatch({
        type: "ERROR",
        value:
          reason instanceof Error
            ? reason.message
            : "Не удалось закрыть заявку",
      });
    } finally {
      dispatch({ type: "BUSY", id: null });
    }
  };

  return {
    ...state,
    copy,
    role,
    setTab,
    setFormOpen,
    onCreated,
    contact,
    close,
  };
}

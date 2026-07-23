"use client";

import {
  useEffect,
  useReducer,
} from "react";
import {
  closeLaborListing,
  contactLaborListing,
  fetchLaborListings,
  type LaborListingData,
} from "@/source/entities/labor";
import { useOptionalChatListContext } from "@/source/features/chat";
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
  const chatList = useOptionalChatListContext();
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

  const setChatUuid = (value: string | null) => {
    dispatch({ type: "CHAT", value });
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
      await chatList?.refresh();
      setChatUuid(uuid);
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
      await chatList?.refresh();
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
    browseUnread: chatList?.unreadForLaborTab(copy.browseKind, false) ?? 0,
    mineUnread: chatList?.unreadForLaborTab(copy.ownKind, true) ?? 0,
    unreadForListing: chatList?.unreadForLaborListing ?? (() => 0),
    unreadForChat: chatList?.unreadForChat ?? (() => 0),
    setTab,
    setFormOpen,
    setChatUuid,
    onCreated,
    contact,
    close,
  };
}

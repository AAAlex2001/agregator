"use client";

import { useEffect, useReducer } from "react";
import { fetchLeads, updateLead, type Lead, type LeadChanges, type LeadStatus } from "@/entities/lead";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { leadsReducer } from "./reducers";

const PAGE_SIZE = 50;

/** Заявки с сайта: фильтр по статусу, листание, смена статуса и заметка менеджера. */
export const useLeads = () => {
  const toast = useToast();
  const [state, dispatch] = useReducer(leadsReducer, {
    filter: "",
    page: 1,
    list: null,
    loading: true,
    failed: false,
    pendingId: null,
    noteFor: null,
    noteDraft: "",
  });
  const { filter, page } = state;

  useEffect(() => {
    let active = true;

    fetchLeads(filter, PAGE_SIZE, (page - 1) * PAGE_SIZE)
      .then((list) => {
        if (active) dispatch({ type: "load/success", list });
      })
      .catch(() => {
        if (active) dispatch({ type: "load/error" });
      });

    return () => {
      active = false;
    };
  }, [filter, page]);

  const request = async (lead: Lead, changes: LeadChanges, success: string) => {
    dispatch({ type: "request/start", id: lead.id });

    try {
      dispatch({ type: "lead/changed", lead: await updateLead(lead.id, changes) });
      toast(success);
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось сохранить заявку"), "error");
    } finally {
      dispatch({ type: "request/finish" });
    }
  };

  const changeFilter = (value: string) => dispatch({ type: "load/start", filter: value, page: 1 });
  const openPage = (nextPage: number) => dispatch({ type: "load/start", filter, page: nextPage });

  const setStatus = (lead: Lead, status: LeadStatus) => request(lead, { status }, "Статус заявки обновлён");

  const openNote = (lead: Lead) => dispatch({ type: "note/open", lead });
  const changeNote = (value: string) => dispatch({ type: "note/change", value });
  const closeNote = () => dispatch({ type: "note/close" });

  const saveNote = (lead: Lead) => {
    const comment = state.noteDraft.trim();

    if (comment === lead.comment) return closeNote();

    request(lead, { comment }, "Заметка сохранена");
  };

  const pages = Math.ceil((state.list?.total ?? 0) / PAGE_SIZE);

  return { state, pages, changeFilter, openPage, setStatus, openNote, changeNote, closeNote, saveNote };
};

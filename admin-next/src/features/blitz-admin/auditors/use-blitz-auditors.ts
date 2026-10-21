"use client";

import { useEffect, useState } from "react";
import { fetchBlitzAuditors, setBlitzAuditLead, type BlitzTeamMember } from "@/entities/blitz-order";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";

/** Аудиторы и назначение руководителей групп: им приходят новые заявки на аудит. */
export function useBlitzAuditors() {
  const toast = useToast();
  const [auditors, setAuditors] = useState<BlitzTeamMember[] | null>(null);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<number | null>(null);

  useEffect(() => {
    const request = new AbortController();

    fetchBlitzAuditors(request.signal)
      .then((loaded) => {
        if (!request.signal.aborted) setAuditors(loaded);
      })
      .catch((failure) => {
        if (!request.signal.aborted) setError(errorMessage(failure, "Не удалось загрузить аудиторов"));
      });

    return () => request.abort();
  }, []);

  async function toggleLead(auditor: BlitzTeamMember) {
    if (pendingId !== null) return;

    setPendingId(auditor.id);

    try {
      const updated = await setBlitzAuditLead(auditor.id, !auditor.lead);

      setAuditors((auditors ?? []).map((item) => (item.id === updated.id ? updated : item)));
      toast(updated.lead ? "Назначен руководителем группы" : "Снят с руководства группой");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось изменить роль"), "error");
    } finally {
      setPendingId(null);
    }
  }

  return { auditors, error, pendingId, toggleLead };
}
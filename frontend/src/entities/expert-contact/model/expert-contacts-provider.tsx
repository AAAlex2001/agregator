"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getContactDeals } from "../api/get-contact-deals";
import { getContactOffer } from "../api/get-contact-offer";
import { getExpertContacts } from "../api/get-expert-contacts";
import { applyDealToExperts, applyOfferToExperts } from "./catalog";
import type {
  ContactDeal,
  ExpertContact,
  ExpertContactOffer,
  ExpertContactsState,
} from "./types";

/** Каталог контактов и операции, которые меняют его после ответов сервера. */
interface ExpertContactsValue extends ExpertContactsState {
  showDeal: (deal: ContactDeal) => Promise<void>;
  closeDeal: () => void;
  refresh: () => Promise<void>;
  syncOffer: (offer: ExpertContactOffer) => void;
}

const ExpertContactsContext = createContext<ExpertContactsValue | null>(null);

/** Серверный каталог для гостя либо загрузка сделок и условий в кабинете. */
interface ExpertContactsProviderProps {
  initialExperts?: ExpertContact[];
  withOffer: boolean;
  children: ReactNode;
}

/** Хранит каталог одного аккаунта; при смене аккаунта нужен новый key. */
export function ExpertContactsProvider({
  initialExperts,
  withOffer,
  children,
}: ExpertContactsProviderProps) {
  const [state, setState] = useState<ExpertContactsState>({
    experts: initialExperts ?? [],
    deals: [],
    offer: null,
    openedDeal: null,
    isLoading: !initialExperts,
    error: null,
  });

  useEffect(() => {
    if (initialExperts) {
      return;
    }

    let isActive = true;

    Promise.all([
      getExpertContacts(),
      getContactDeals(),
      withOffer ? getContactOffer() : null,
    ])
      .then(([experts, deals, offer]) => {
        if (isActive) {
          setState((current) => ({
            ...current,
            experts,
            deals,
            offer,
            isLoading: false,
          }));
        }
      })
      .catch((error) => {
        if (isActive) {
          setState((current) => ({
            ...current,
            isLoading: false,
            error: error instanceof Error ? error.message : "Не удалось загрузить раздел",
          }));
        }
      });

    return () => {
      isActive = false;
    };
  }, [initialExperts, withOffer]);

  /** Открывает сделку из ответа сервера и обновляет список сделок. */
  async function showDeal(deal: ContactDeal) {
    const deals = await getContactDeals();

    setState((current) => ({
      ...current,
      deals,
      openedDeal: deal,
      experts: applyDealToExperts(current.experts, deal),
    }));
  }

  /** Закрывает окно открытой сделки. */
  function closeDeal() {
    setState((current) => ({
      ...current,
      openedDeal: null,
    }));
  }

  /** Перечитывает исполнителей и сделки после удаления заявки или отзыва. */
  async function refresh() {
    const [experts, deals] = await Promise.all([
      getExpertContacts(),
      getContactDeals(),
    ]);

    setState((current) => ({
      ...current,
      experts,
      deals,
    }));
  }

  /** Сохраняет новые условия исполнителя и показывает их в его карточке. */
  function syncOffer(offer: ExpertContactOffer) {
    setState((current) => ({
      ...current,
      offer,
      experts: applyOfferToExperts(current.experts, offer),
    }));
  }

  return (
    <ExpertContactsContext.Provider
      value={{
        ...state,
        showDeal,
        closeDeal,
        refresh,
        syncOffer,
      }}
    >
      {children}
    </ExpertContactsContext.Provider>
  );
}

/** Даёт виджету и действиям доступ к одному каталогу контактов. */
export function useExpertContacts(): ExpertContactsValue {
  const context = useContext(ExpertContactsContext);

  if (!context) {
    throw new Error("Каталог контактов должен находиться внутри ExpertContactsProvider");
  }

  return context;
}

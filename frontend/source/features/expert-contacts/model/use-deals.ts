"use client";

import {
  confirmContactPayment,
  createContactDeal,
  createContactDealReview,
  deleteContactDeal,
  fetchContactDeal,
  fetchContactDeals,
  fetchExpertContacts,
  openDealChat as openDealChatApi,
  rejectContactPayment,
  signContactDeal,
  uploadContactReceipt,
  type ContactDealDetail,
  type ContactDealListItem,
  type ExpertContactCardData,
} from "@/source/entities/expert-contact";
import { useSession } from "@/source/features/session";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { useExpertContactsContext } from "./provider";

export function useDeals() {
  const { state, dispatch } = useExpertContactsContext();
  const { openAuth } = useAuthModal();
  const { user } = useSession();
  const { showError, showSuccess } = useNotifications();

  const runAction = async (action: () => Promise<void>, fallbackError: string) => {
    if (state.busy) return;
    dispatch({ type: "BUSY", value: true });
    try {
      await action();
    } catch (reason) {
      showError(reason instanceof Error ? reason.message : fallbackError);
    } finally {
      dispatch({ type: "BUSY", value: false });
    }
  };

  const runDealAction = (request: () => Promise<ContactDealDetail>, successMessage?: string) =>
    runAction(async () => {
      const deal = await request();
      dispatch({ type: "SELECT_DEAL", value: deal });
      dispatch({ type: "SYNC_DEAL", value: deal });
      dispatch({ type: "DEALS", value: await fetchContactDeals() });
      if (successMessage) showSuccess(successMessage);
    }, "Не удалось выполнить действие");

  const refreshMarketplace = async () => {
    const [experts, deals] = await Promise.all([fetchExpertContacts(), fetchContactDeals()]);
    dispatch({ type: "EXPERTS", value: experts });
    dispatch({ type: "DEALS", value: deals });
  };

  const openExpert = async (expert: ExpertContactCardData) => {
    if (!user) {
      openAuth("login");
      return;
    }
    await runDealAction(
      () => (expert.deal_id ? fetchContactDeal(expert.deal_id) : createContactDeal(expert.id)),
      expert.deal_id ? undefined : "Заявка на покупку контактов создана",
    );
  };

  const confirmDeleteDeal = () =>
    runAction(async () => {
      const deal = state.deleteDeal;
      if (!deal) return;
      await deleteContactDeal(deal.id);
      await refreshMarketplace();
      dispatch({ type: "DELETE_DEAL", value: null });
      showSuccess("Заявка на контакты удалена");
    }, "Не удалось удалить заявку на контакты");

  const submitReview = (payload: { rating: number; comment: string }) =>
    runAction(async () => {
      const deal = state.reviewDeal;
      if (!deal) return;
      await createContactDealReview(deal.id, payload);
      await refreshMarketplace();
      dispatch({ type: "REVIEW_DEAL", value: null });
      showSuccess("Отзыв опубликован");
    }, "Не удалось опубликовать отзыв");

  const openDealChat = (dealId: number) =>
    runAction(async () => {
      dispatch({ type: "DEAL_CHAT", value: await openDealChatApi(dealId) });
    }, "Не удалось открыть чат");

  const selectedDealAction = (
    request: (dealId: number) => Promise<ContactDealDetail>,
    successMessage: string,
  ): Promise<void> => {
    const deal = state.selectedDeal;
    return deal ? runDealAction(() => request(deal.id), successMessage) : Promise.resolve();
  };

  return {
    busy: state.busy,
    selectedDeal: state.selectedDeal,
    deleteDeal: state.deleteDeal,
    reviewDeal: state.reviewDeal,
    dealChatUuid: state.dealChatUuid,
    openExpert,
    openDeal: (id: number) => runDealAction(() => fetchContactDeal(id)),
    closeDeal: () => dispatch({ type: "SELECT_DEAL", value: null }),
    requestDeleteDeal: (deal: ContactDealListItem) => dispatch({ type: "DELETE_DEAL", value: deal }),
    confirmDeleteDeal,
    cancelDeleteDeal: () => dispatch({ type: "DELETE_DEAL", value: null }),
    startReview: () => {
      if (!state.selectedDeal?.can_review) return;
      dispatch({ type: "REVIEW_DEAL", value: state.selectedDeal });
      dispatch({ type: "SELECT_DEAL", value: null });
    },
    submitReview,
    closeReview: () => dispatch({ type: "REVIEW_DEAL", value: null }),
    openDealChat,
    closeDealChat: () => dispatch({ type: "DEAL_CHAT", value: null }),
    sign: (password: string) =>
      selectedDealAction((dealId) => signContactDeal(dealId, password), "Договор подписан"),
    uploadReceipt: (file: File) =>
      selectedDealAction((dealId) => uploadContactReceipt(dealId, file), "Чек отправлен"),
    confirmPayment: () =>
      selectedDealAction(confirmContactPayment, "Оплата подтверждена, контакты открыты"),
    rejectPayment: (reason: string) =>
      selectedDealAction((dealId) => rejectContactPayment(dealId, reason), "Чек отклонен"),
  };
}

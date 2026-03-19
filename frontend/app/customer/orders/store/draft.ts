export interface CreateOrderDraft {
  showCreateForm: boolean;
  title: string;
  company: string;
  deadline: string;
  responsesDeadline: string;
  budget: string;
  selectedBadgeVariants: string[];
  typicalNamesMap: Record<string, string>;
  comment: string;
  files: File[];
}

const emptyDraft: CreateOrderDraft = {
  showCreateForm: false,
  title: "",
  company: "",
  deadline: "",
  responsesDeadline: "",
  budget: "",
  selectedBadgeVariants: [],
  typicalNamesMap: {},
  comment: "",
  files: [],
};

let draft: CreateOrderDraft = { ...emptyDraft };

export function getDraft(): CreateOrderDraft {
  return draft;
}

export function saveDraft(partial: Partial<CreateOrderDraft>) {
  draft = { ...draft, ...partial };
}

export function clearDraft() {
  draft = { ...emptyDraft };
}

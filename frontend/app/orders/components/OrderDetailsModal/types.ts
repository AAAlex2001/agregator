export interface Badge {
  text: string;
  variant: "blue" | "green";
}

export interface OrderDetails {
  id: number;
  badges: Badge[];
  title: string;
  customer: string;
  date: string;
  sum: string;
  comment: string;
  technicalFiles: string[];
}

export interface Step2FormData {
  deadline: string;
  costEstimate: number;
  comment: string;
  files: File[];
}

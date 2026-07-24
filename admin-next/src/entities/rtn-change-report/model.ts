export type RtnChangeReportStatus = "NEW" | "REVIEWED" | "APPLIED";

export type RtnChangeReport = {
  id: number;
  clarificationId: number;
  description: string;
  status: RtnChangeReportStatus;
  createdAt: string;
};

import type { Metadata } from "next";
import { RtnQuestionsWidget } from "@/source/widgets/rtn-questions";

export const metadata: Metadata = {
  title: "Задать вопрос в Ростехнадзор",
  robots: { index: false, follow: false },
};

export default function AuthedRtnQuestionPage() {
  return (
    <RtnQuestionsWidget
      authenticated
      homeHref="/landing"
      catalogHref="/landing/rtn"
    />
  );
}

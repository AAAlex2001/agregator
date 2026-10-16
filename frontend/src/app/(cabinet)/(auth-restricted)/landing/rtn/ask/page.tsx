import { createPrivateMetadata } from "../../../../../seo/private-page";
import { RtnQuestionsPageContent } from "../../../../../ui/pages/rtn-questions-page-content";

export const metadata = createPrivateMetadata("Задать вопрос в Ростехнадзор");

/** Открывает отправку вопроса и статусы обращений текущего пользователя. */
export default function PrivateRtnQuestionPage() {
  return <RtnQuestionsPageContent basePath="/landing" />;
}

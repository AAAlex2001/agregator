import { RTN_QUESTIONS_METADATA } from "../../../seo/rtn-questions";
import { RtnQuestionsPageContent } from "../../../ui/pages/rtn-questions-page-content";
import { PublicSiteShell } from "../../../ui/shells/public-site-shell";

export const metadata = RTN_QUESTIONS_METADATA;

/** Показывает публичные обращения и вход для отправки своего вопроса. */
export default function PublicRtnQuestionPage() {
  return (
    <PublicSiteShell redirectTo="/landing/rtn/ask">
      <main>
        <RtnQuestionsPageContent basePath="" />
      </main>
    </PublicSiteShell>
  );
}

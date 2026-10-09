import { TagsManager } from "@/features/tags-admin";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";

/** Страница тегов: общие метки для статей и разъяснений. */
const AdminTags = () => (
  <Page>
    <PageHeader title="Теги" description="Общие метки для статей и раздела «Ростехнадзор отвечает»" />
    <TagsManager />
  </Page>
);

export default AdminTags;

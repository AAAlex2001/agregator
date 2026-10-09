import { parseId } from "@/shared/lib/route-params";
import ArticleEditor from "@/widgets/admin/article-editor";

/** Редактирование статьи. */
export default async function ArticleRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ArticleEditor key={id} articleId={parseId(id)} />;
}

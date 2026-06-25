import { ArticleForm } from "@/features/article-form/ArticleForm";

export default function EditPage({ params }: { params: { id: string } }) {
  return <ArticleForm id={Number(params.id)} />;
}

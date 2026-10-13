import { parseId } from "@/shared/lib/route-params";
import AdminPosts from "@/widgets/admin/posts";

/** Публикации и черновики выбранного автора. */
export default async function AccountPostsRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <AdminPosts key={id} authorId={parseId(id)} />;
}

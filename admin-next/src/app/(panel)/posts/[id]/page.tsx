import { parseId } from "@/shared/lib/route-params";
import AdminPostDetail from "@/widgets/admin/post-detail";

/** Публикация для просмотра модератором. */
export default async function PostRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <AdminPostDetail key={id} postId={parseId(id)} />;
}

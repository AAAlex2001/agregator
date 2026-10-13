interface ThreadNode {
  id: number;
  parent_id: number | null;
}

/** Номера комментария и всех ответов на него на любую глубину — то, что исчезает при удалении. */
export function threadIds(comments: ThreadNode[], rootId: number): Set<number> {
  const replies = comments.filter((comment) => comment.parent_id === rootId);
  return new Set([rootId, ...replies.flatMap((reply) => [...threadIds(comments, reply.id)])]);
}

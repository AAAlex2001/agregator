import type { NextRequest } from "next/server";
import { hasSession, proxyToBackend, unauthorized } from "@/shared/api/server";

type Context = { params: Promise<{ path: string[] }> };

/** Единый прокси админского API: проверяет сессию и пересылает запрос на бэкенд. */
const handler = async (request: NextRequest, { params }: Context) => {
  if (!(await hasSession())) return unauthorized();

  const { path } = await params;

  return proxyToBackend(request, path.join("/"));
};

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatDateRu } from "@/source/shared/lib/formatDate";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { FileGallery, type FileGalleryItem } from "@/source/shared/ui/FileGallery";
import { DOCUMENT_TYPE_LABELS, STATUS_LABELS } from "../../lib/rtnLabels";
import type { RtnListItem } from "../../api/rtnClarification.api";
import s from "./RtnCard.module.scss";

export function RtnCard({ item }: { item: RtnListItem }) {
  const pathname = usePathname();
  const prefix = pathname?.startsWith("/landing") ? "/landing" : "";
  const href = `${prefix}/rtn/${item.slug}`;
  const documentItems: FileGalleryItem[] = [];
  if (item.pdf_url) {
    documentItems.push({
      id: `rtn-card-request-${item.id}`,
      name: "Обращение в Ростехнадзор.pdf",
      url: resolveFileUrl(item.pdf_url),
    });
  }
  if (item.response_pdf_url) {
    documentItems.push({
      id: `rtn-card-response-${item.id}`,
      name: "Ответ Ростехнадзора.pdf",
      url: resolveFileUrl(item.response_pdf_url),
    });
  }

  return (
    <li className={s.card}>
      <Link href={href} className={s.link}>
        <div className={s.top}>
          <span className={s.docType}>{DOCUMENT_TYPE_LABELS[item.document_type]}</span>
          <span className={item.status === "ACTIVE" ? s.statusActive : s.statusExpired}>
            {STATUS_LABELS[item.status]}
          </span>
        </div>

        <h3 className={s.title}>{item.title}</h3>
        {item.excerpt ? <p className={s.excerpt}>{item.excerpt}</p> : null}

        <div className={s.meta}>
          {item.letter_number ? <span className={s.letter}>№ {item.letter_number}</span> : null}
          {item.department ? <span className={s.department}>{item.department}</span> : null}
          <time className={s.date} dateTime={item.published_at || undefined}>
            {formatDateRu(item.published_at)}
          </time>
        </div>

        {item.tags.length > 0 ? (
          <div className={s.tags}>
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={s.tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </Link>

      {documentItems.length > 0 ? (
        <div className={s.documentRow}>
          <FileGallery
            items={documentItems}
            label="Документ"
            blockClassName={s.documentGallery}
          />
        </div>
      ) : null}
    </li>
  );
}

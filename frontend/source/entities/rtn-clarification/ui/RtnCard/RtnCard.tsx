"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatDateRu } from "@/source/shared/lib/formatDate";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { FileGallery, type FileGalleryItem } from "@/source/shared/ui/FileGallery";
import { DOCUMENT_TYPE_LABELS, STATUS_LABELS } from "../../lib/rtnLabels";
import type { RtnListItem } from "../../api/rtnClarification.api";
import s from "./RtnCard.module.scss";

interface Props {
  item: RtnListItem;
  horizontal?: boolean;
}

export function RtnCard({ item, horizontal = false }: Props) {
  const pathname = usePathname();
  const prefix = pathname?.startsWith("/landing") ? "/landing" : "";
  const href = `${prefix}/rtn/${item.slug}`;
  const requestDocumentItems: FileGalleryItem[] = [];
  const responseDocumentItems: FileGalleryItem[] = [];
  if (item.pdf_url) {
    requestDocumentItems.push({
      id: `rtn-card-request-${item.id}`,
      name: "Обращение в Ростехнадзор.pdf",
      url: resolveFileUrl(item.pdf_url),
    });
  }
  if (item.response_pdf_url) {
    responseDocumentItems.push({
      id: `rtn-card-response-${item.id}`,
      name: "Ответ Ростехнадзора.pdf",
      url: resolveFileUrl(item.response_pdf_url),
    });
  }
  const documentItems = [...requestDocumentItems, ...responseDocumentItems];
  const hasAside = documentItems.length > 0 || Boolean(item.source_url);

  return (
    <li
      className={`${s.card}${horizontal ? ` ${s.horizontal}` : ""}${
        horizontal && hasAside ? ` ${s.withAside}` : ""
      }`}
    >
      <Link href={href} className={s.link}>
        <div className={s.top}>
          <span className={s.docType}>{DOCUMENT_TYPE_LABELS[item.document_type]}</span>
          <span className={item.status === "ACTIVE" ? s.statusActive : s.statusExpired}>
            {STATUS_LABELS[item.status]}
          </span>
        </div>

        <h3 className={s.title}>{item.title}</h3>
        {item.excerpt ? <p className={s.excerpt}>{item.excerpt}</p> : null}

        {horizontal ? (
          <>
            {item.tags.length > 0 ? (
              <div className={s.tags}>
                {item.tags.map((tag) => (
                  <span key={tag} className={s.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className={s.meta}>
              {item.letter_number ? (
                <div className={s.metaItem}>
                  <span className={s.metaLabel}>Номер документа</span>
                  <span className={s.metaValue}>№ {item.letter_number}</span>
                </div>
              ) : null}
              {item.department ? (
                <div className={`${s.metaItem} ${s.departmentItem}`}>
                  <span className={s.metaLabel}>Подразделение Ростехнадзора</span>
                  <span className={s.metaValue}>{item.department}</span>
                </div>
              ) : null}
              <div className={s.metaItem}>
                <span className={s.metaLabel}>Дата публикации</span>
                <time className={s.metaValue} dateTime={item.published_at || undefined}>
                  {formatDateRu(item.published_at)}
                </time>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={s.compactMeta}>
              {item.letter_number ? <span>№ {item.letter_number}</span> : null}
              {item.department ? <span className={s.compactDepartment}>{item.department}</span> : null}
              <time dateTime={item.published_at || undefined}>
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
          </>
        )}
      </Link>

      {horizontal && hasAside ? (
        <div className={s.aside}>
          <h4 className={s.asideTitle}>Документы</h4>
          {requestDocumentItems.length > 0 ? (
            <FileGallery
              items={requestDocumentItems}
              label="Официальное письмо"
              blockClassName={s.documentGallery}
            />
          ) : null}
          {responseDocumentItems.length > 0 ? (
            <FileGallery
              items={responseDocumentItems}
              label="Ответ Ростехнадзора"
              blockClassName={s.documentGallery}
            />
          ) : null}
          {item.source_url ? (
            <a
              className={s.sourceLink}
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Открыть источник на сайте Ростехнадзора
            </a>
          ) : null}
        </div>
      ) : documentItems.length > 0 ? (
        <div className={s.compactDocuments}>
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

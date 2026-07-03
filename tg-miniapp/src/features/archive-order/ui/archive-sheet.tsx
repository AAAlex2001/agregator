import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { Button, SheetHero, Spinner } from "@/shared/ui";
import { StarIcon, UserIcon } from "@/shared/ui/icons/interface";
import { FileTypeIcon } from "@/shared/ui/file-icon";
import { tapHaptic } from "@/shared/services/telegram";
import { emitError } from "@/shared/services/error-bus";
import { DocumentsGrid, type Order } from "@/entites/order";
import { fetchOrderQuestions, type OrderQuestion } from "@/entites/order-question";
import { formatDateRu } from "@/shared/lib/format";
import { fileUrl, openFile } from "@/shared/lib/files";
import s from "./archive-sheet.module.scss";

const TOTAL = 4;
type ScreenMeta = { image: string; illu: string; title: string; desc: string };

const META: Record<number, ScreenMeta> = {
  1: { image: "step-1", illu: "📋", title: "Информация по заказу", desc: "Условия завершённого заказа" },
  2: { image: "step-2", illu: "📎", title: "Документы заказчика", desc: "ТЗ, договор и другие вложения" },
  3: { image: "step-4", illu: "🤝", title: "Исполнитель", desc: "Кто выполнял заказ и на каких условиях" },
  4: { image: "step-3", illu: "💬", title: "Вопросы по заказу", desc: "Обсуждение с заказчиком" },
};

function reviewsWord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "отзыв";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "отзыва";
  return "отзывов";
}

interface Props {
  order: Order | null;
  onClose: () => void;
}

export function ArchiveSheet({ order, onClose }: Props) {
  const open = order !== null;
  const [rendered, setRendered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [frozen, setFrozen] = useState<Order | null>(null);
  const [screen, setScreen] = useState(1);
  const [questions, setQuestions] = useState<OrderQuestion[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setFrozen(order);
      setRendered(true);
      setClosing(false);
      return;
    }
    if (!rendered) return;
    setClosing(true);
    const timer = window.setTimeout(() => {
      setRendered(false);
      setClosing(false);
    }, 320);
    return () => window.clearTimeout(timer);
  }, [open, order, rendered]);

  useEffect(() => {
    if (!rendered) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [rendered]);

  useEffect(() => {
    if (!rendered) return;
    for (const meta of Object.values(META)) {
      for (const theme of ["light", "dark"]) {
        const img = new Image();
        img.src = `/respond-order/${meta.image}-${theme}.webp`;
      }
    }
  }, [rendered]);

  useEffect(() => {
    if (!order) return;
    let active = true;
    setScreen(1);
    setQuestions(null);
    fetchOrderQuestions(order.id)
      .then((r) => active && setQuestions(r.items))
      .catch((e) => {
        if (!active) return;
        emitError(e instanceof Error ? e.message : "Не удалось загрузить вопросы");
        setQuestions([]);
      });
    return () => {
      active = false;
    };
  }, [order]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);

  const data = order ?? frozen;
  if (!rendered || !data) return null;

  const close = () => {
    tapHaptic();
    onClose();
  };

  const hasExecutor = data.executor_name !== "";
  const hasOffer = data.accepted_response_id !== null;
  const hasDocs = [
    ...data.documents.technical,
    ...data.documents.contract,
    ...data.documents.company,
    ...data.documents.other,
  ].length > 0;
  const rating = data.executor_rating;
  const reviewCount = data.executor_review_count;
  const createdDisplay = data.created_at ? formatDateRu(data.created_at.slice(0, 10)) : "";
  const meta = META[screen];

  return (
    <div className={cn(s.overlay, { [s.closing]: closing })} onClick={close}>
      <div className={cn(s.sheet, { [s.closing]: closing })} onClick={(e) => e.stopPropagation()}>
        <SheetHero
          key={meta.image}
          light={`/respond-order/${meta.image}-light.webp`}
          dark={`/respond-order/${meta.image}-dark.webp`}
          illu={meta.illu}
          label="Архив"
          title={meta.title}
          desc={meta.desc}
          step={screen}
          total={TOTAL}
          onClose={close}
        />

        <div key={data.id} className={s.scroll} ref={scrollRef}>
          <div className={s.panel}>
            {screen === 1 && (
              <>
                <div className={s.group}>
                  <span className={s.blockLab}>Заказ</span>
                  <div className={s.block}>
                    <div className={s.hero}>
                      <p className={s.orderTitle}>{data.title}</p>
                      <div className={s.metrics}>
                        <div className={s.metric}>
                          <span className={s.metricLab}>Начальная максимальная цена</span>
                          <span className={s.metricVal}>{data.sum || "—"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={s.group}>
                  <span className={s.blockLab}>Сроки выполнения</span>
                  <div className={s.block}>
                    <div className={s.row}>
                      <span className={s.rowLab}>Срок начала выполнения работ</span>
                      <span className={s.rowVal}>{data.start_date || "—"}</span>
                    </div>
                    <div className={s.row}>
                      <span className={s.rowLab}>Срок окончания выполнения работ</span>
                      <span className={s.rowVal}>{data.date || "—"}</span>
                    </div>
                    {createdDisplay && (
                      <div className={s.row}>
                        <span className={s.rowLab}>Создан</span>
                        <span className={s.rowVal}>{createdDisplay}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={s.group}>
                  <span className={s.blockLab}>Заказчик</span>
                  <div className={s.block}>
                    <div className={s.row}>
                      <span className={s.rowLab}>Организатор</span>
                      <span className={s.rowVal}>{data.company || "—"}</span>
                    </div>
                    {data.customer_inn && (
                      <div className={s.row}>
                        <span className={s.rowLab}>ИНН</span>
                        <span className={s.rowVal}>{data.customer_inn}</span>
                      </div>
                    )}
                  </div>
                </div>

                {data.badges.length > 0 && (
                  <div className={s.group}>
                    <span className={s.blockLab}>Требования к эксперту</span>
                    <div className={s.block}>
                      <div className={s.chips}>
                        {data.badges.map((b, i) => (
                          <span key={i} className={s.chip}>
                            {b.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {data.comment && (
                  <div className={s.group}>
                    <span className={s.blockLab}>Комментарий заказчика</span>
                    <div className={s.block}>
                      <p className={s.comment}>{data.comment}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {screen === 2 && (
              <div className={s.group}>
                <span className={s.blockLab}>Документы заказчика</span>
                <DocumentsGrid documents={data.documents} />
                <span className={s.note}>
                  {hasDocs ? "Нажмите на документ, чтобы открыть." : "Заказчик не приложил документы."}
                </span>
              </div>
            )}

            {screen === 3 && (
              <>
                {hasExecutor ? (
                  <div className={s.group}>
                    <span className={s.blockLab}>Исполнитель</span>
                    <div className={s.block}>
                      <div className={s.expert}>
                        <span className={s.avatar}>
                          {data.executor_avatar_url ? (
                            <img src={fileUrl(data.executor_avatar_url)} alt={`Фото ${data.executor_name}`} />
                          ) : (
                            <UserIcon width={22} height={22} />
                          )}
                        </span>
                        <div className={s.expertText}>
                          <span className={s.expertName}>{data.executor_name}</span>
                          {rating !== null && reviewCount > 0 ? (
                            <span className={s.expertRating}>
                              <StarIcon className={s.star} />
                              {rating.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                              {" · "}
                              {reviewCount} {reviewsWord(reviewCount)}
                            </span>
                          ) : (
                            <span className={s.expertNoReviews}>Отзывов пока нет</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={s.group}>
                    <span className={s.blockLab}>Исполнитель</span>
                    <div className={s.block}>
                      <p className={s.comment}>Исполнитель не был выбран.</p>
                    </div>
                  </div>
                )}

                {hasOffer && (
                  <div className={s.group}>
                    <span className={s.blockLab}>Предложение исполнителя</span>
                    <div className={s.block}>
                      {data.executor_proposed_sum && (
                        <div className={s.row}>
                          <span className={s.rowLab}>Цена исполнителя</span>
                          <span className={cn(s.rowVal, s.rowAccent)}>{data.executor_proposed_sum}</span>
                        </div>
                      )}
                      {data.executor_proposed_start_date && (
                        <div className={s.row}>
                          <span className={s.rowLab}>Срок начала выполнения работ</span>
                          <span className={s.rowVal}>{data.executor_proposed_start_date}</span>
                        </div>
                      )}
                      {data.executor_proposed_deadline && (
                        <div className={s.row}>
                          <span className={s.rowLab}>Срок окончания выполнения работ</span>
                          <span className={s.rowVal}>{data.executor_proposed_deadline}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {hasOffer && data.executor_comment && (
                  <div className={s.group}>
                    <span className={s.blockLab}>Комментарий исполнителя</span>
                    <div className={s.block}>
                      <p className={s.comment}>{data.executor_comment}</p>
                    </div>
                  </div>
                )}

                {hasOffer && data.executor_files.length > 0 && (
                  <div className={s.group}>
                    <span className={s.blockLab}>Файлы отклика</span>
                    <div className={s.fileList}>
                      {data.executor_files.map((f, i) => (
                        <button key={i} className={s.fileItem} onClick={() => openFile(f)}>
                          <FileTypeIcon name={f} className={s.fileIcon} />
                          <span className={s.fileName}>{f.split("/").pop() || "файл"}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {screen === 4 && (
              <div className={s.group}>
                <span className={s.blockLab}>Вопросы по заказу</span>
                {questions === null ? (
                  <div className={s.qaLoading}>
                    <Spinner />
                  </div>
                ) : questions.length === 0 ? (
                  <div className={s.block}>
                    <p className={s.comment}>Вопросов пока нет.</p>
                  </div>
                ) : (
                  <div className={s.qaList}>
                    {questions.map((q) => (
                      <div key={q.id} className={s.qaItem}>
                        <div className={s.qaQ}>{q.question}</div>
                        <div className={s.qaA}>{q.answer ? `Ответ: ${q.answer}` : "Без ответа"}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={s.footer}>
          {screen === 1 ? (
            <Button onClick={() => setScreen(2)}>Далее</Button>
          ) : screen === TOTAL ? (
            <>
              <Button variant="outline" onClick={() => setScreen(screen - 1)}>Назад</Button>
              <Button onClick={close}>Закрыть</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setScreen(screen - 1)}>Назад</Button>
              <Button onClick={() => setScreen(screen + 1)}>Далее</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

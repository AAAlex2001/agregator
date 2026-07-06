import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKeenSlider, type KeenSliderInstance } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { tapHaptic } from "@/shared/services/telegram";
import { ChevronRightIcon } from "@/shared/ui/icons/interface";
import { ArticleSlide } from "@/entites/article";
import { useLatestArticles } from "../model/use-latest-articles";
import { ArticleSheet } from "./article-sheet";
import s from "./blog-strip.module.scss";

function autoplay(slider: KeenSliderInstance) {
  let timer: ReturnType<typeof setTimeout>;
  let paused = false;

  const next = () => {
    clearTimeout(timer);
    if (paused) return;
    timer = setTimeout(() => slider.next(), 3000);
  };

  slider.on("created", () => {
    slider.container.addEventListener("pointerdown", () => {
      paused = true;
      clearTimeout(timer);
    });
    next();
  });
  slider.on("dragStarted", () => clearTimeout(timer));
  slider.on("animationEnded", next);
  slider.on("updated", next);
}

export function BlogStrip() {
  const navigate = useNavigate();
  const { items } = useLatestArticles(5);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [sliderRef] = useKeenSlider(
    { loop: true, slides: { perView: 1.15, spacing: 12, origin: "center" } },
    [autoplay],
  );

  if (!items || items.length === 0) return null;

  return (
    <section className={s.wrap}>
      <div className={s.head}>
        <span className={s.title}>Блог платформы</span>
        <button
          className={s.all}
          onClick={() => {
            tapHaptic();
            navigate("/blog");
          }}
        >
          Все статьи
          <ChevronRightIcon width={16} height={16} />
        </button>
      </div>

      <div ref={sliderRef} className="keen-slider">
        {items.map((article) => (
          <div key={article.id} className="keen-slider__slide">
            <ArticleSlide article={article} onClick={() => setOpenSlug(article.slug)} />
          </div>
        ))}
      </div>

      <ArticleSheet slug={openSlug} onClose={() => setOpenSlug(null)} />
    </section>
  );
}

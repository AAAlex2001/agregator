import { useState } from "react";
import { Button } from "@/shared/ui";
import { notifyHaptic, tapHaptic } from "@/shared/services/telegram";
import s from "./onboarding.module.scss";

interface Slide {
  image: string;
  title: string;
  desc: string;
}

const SLIDES: Slide[] = [
  {
    image: "/onboarding/onboarding-1.png",
    title: "Ресурс-Плюс — теперь в Telegram",
    desc: "Заказы на экспертизу промышленной безопасности, отклики и тарифы — в одном мини-приложении, без браузера.",
  },
  {
    image: "/onboarding/onboarding-2.png",
    title: "Узнавайте о заказах первыми",
    desc: "Включите пуш-уведомления — и подходящие заявки будут приходить прямо в Telegram. Откликайтесь, пока думают конкуренты.",
  },
  {
    image: "/onboarding/onboarding-3.png",
    title: "Отклик за пару касаний",
    desc: "Пошаговая форма с ценой, сроками и файлами и приятная тактильная отдача — заявка уходит за минуту.",
  },
];

interface Props {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const last = SLIDES.length - 1;
  const slide = SLIDES[step];

  const goTo = (next: number) => {
    tapHaptic();
    setStep(next);
  };

  const next = () => {
    if (step < last) {
      goTo(step + 1);
      return;
    }
    notifyHaptic("success");
    onComplete();
  };

  const back = () => goTo(Math.max(0, step - 1));

  return (
    <div className={s.overlay}>
      <div className={s.card}>
        <div className={s.slide} key={step}>
          <div className={s.imageWrap}>
            <img className={s.image} src={slide.image} alt="" />
          </div>
          <div className={s.text}>
            <h1 className={s.title}>{slide.title}</h1>
            <p className={s.desc}>{slide.desc}</p>
          </div>
        </div>

        <div className={s.dots}>
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              className={index === step ? s.dotActive : s.dot}
              onClick={() => goTo(index)}
              aria-label={`Шаг ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className={s.footer}>
        {step > 0 && (
          <Button variant="outline" onClick={back}>
            Назад
          </Button>
        )}
        <Button onClick={next}>{step === last ? "Начать" : "Далее"}</Button>
      </div>
    </div>
  );
}

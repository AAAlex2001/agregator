import Button from "@/source/shared/ui/Button";
import { TelegramIcon } from "@/source/shared/ui/icons";
import { ServicesAccordion } from "../../shared/ui/ServicesAccordion";
import { SERVICES_SHOWCASE } from "../../shared/model/servicesShowcase";
import s from "./services-showcase.module.scss";

const BOT_URL = "https://t.me/resursplus_robot";

type ServicesShowcaseProps = {
  buttonText: string;
};

const ServicesShowcase = ({ buttonText }: ServicesShowcaseProps) => (
  <ServicesAccordion
    items={SERVICES_SHOWCASE}
    actions={
      <div className={s.actions}>
        <Button href="/register" variant="primary" fullWidth showArrow className={s.button}>
          {buttonText}
        </Button>
        <Button
          href={BOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="telegram"
          fullWidth
          className={s.button}
        >
          <span>Начать работать в Telegram</span>
          <TelegramIcon />
        </Button>
      </div>
    }
  />
);

export default ServicesShowcase;

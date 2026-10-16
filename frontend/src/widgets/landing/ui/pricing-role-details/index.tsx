import { FeatureCheckIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Условия работы для заказчика или держателя разрешительных документов. */
interface PricingRoleDetailsProps {
  headline: string;
  features: string[];
  footnote: string;
}

/** Показывает описание условий, список возможностей и примечание. */
export function PricingRoleDetails({
  headline,
  features,
  footnote,
}: PricingRoleDetailsProps) {
  return (
    <>
      <p className={styles.customerHeadline}>{headline}</p>
      <ul className={styles.customerFeatures}>
        {features.map((feature) => (
          <li
            key={feature}
            className={styles.customerFeature}
          >
            <FeatureCheckIcon className={styles.customerCheck} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {footnote ? <p className={styles.footnote}>{footnote}</p> : null}
    </>
  );
}

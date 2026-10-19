import cn from "classnames";
import type { PostDelivery } from "@/entities/post";
import { deliveryStatusLabel } from "../../config/my-post-labels";
import styles from "./style.module.scss";

/** Каналы, куда ушёл или уходит пост. */
interface PostDeliveriesProps {
  deliveries: PostDelivery[];
}

/** Каналы поста чипами со статусом и ошибки отправки под ними; вышедший пост открывается в Telegram. */
export function PostDeliveries({ deliveries }: PostDeliveriesProps) {
  const failed = deliveries.filter((delivery) => delivery.status === "failed" && delivery.error);

  return (
    <div className={styles.deliveries}>
      <ul className={styles.chips}>
        {deliveries.map((delivery) => (
          <li
            key={delivery.channel.id}
            className={cn(styles.chip, styles[delivery.status])}
          >
            {delivery.message_url ? (
              <a
                className={styles.link}
                href={delivery.message_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {delivery.channel.title}
              </a>
            ) : (
              delivery.channel.title
            )}
            <span className={styles.status}>{deliveryStatusLabel(delivery.status)}</span>
          </li>
        ))}
      </ul>
      {failed.map((delivery) => (
        <p
          key={delivery.channel.id}
          className={styles.error}
        >
          {delivery.channel.title}: {delivery.error}
        </p>
      ))}
    </div>
  );
}

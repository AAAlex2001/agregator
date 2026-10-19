import { PostAccess, PosterChannels } from "@/widgets/posts";
import { createPrivateMetadata } from "../../../../seo/private-page";

export const metadata = createPrivateMetadata("Каналы и группы");

/** Свои Telegram-каналы и группы; гостю — предложение войти. */
export default function PosterChannelsPage() {
  return (
    <PostAccess>
      <PosterChannels />
    </PostAccess>
  );
}

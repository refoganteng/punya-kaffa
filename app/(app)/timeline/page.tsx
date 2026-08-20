import { getItems } from "@/lib/actions/items";
import { TimelineClient } from "@/components/timeline/TimelineClient";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const items = await getItems();
  return <TimelineClient items={items} />;
}

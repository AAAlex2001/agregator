import { useEffect, useState } from "react";
import { listLicenseHolders, type LicenseHolder } from "@/entites/license-holder";

export function useLicenseHolders() {
  const [items, setItems] = useState<LicenseHolder[] | null>(null);

  useEffect(() => {
    let active = true;
    listLicenseHolders()
      .then((r) => active && setItems(r.items))
      .catch(() => active && setItems([]));
    return () => {
      active = false;
    };
  }, []);

  return { items };
}

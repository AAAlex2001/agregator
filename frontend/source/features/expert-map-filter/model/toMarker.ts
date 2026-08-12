import type { ExpertMapItemApi } from "@/source/entities/expert";
import type { MapMarker } from "@/source/shared/ui/YandexMap";

export function toMarker(item: ExpertMapItemApi): MapMarker {
  return {
    id: item.public_id,
    lat: item.lat,
    lng: item.lng,
    title: item.full_name,
    city: item.city,
    rating: item.rating,
    travelsToOtherRegions: item.travels_to_other_regions,
    certificates: item.certificates,
    phone: item.phone,
    email: item.email,
    contactsPaid: item.contacts_paid,
    contactPriceRubles: item.contact_price_rubles,
  };
}

from models.labor import LaborListing, LaborListingKind
from schemas.labor import LaborListingCreate, LaborListingResponse
from services.email import SendNewLaborListingEmailUseCase
from services.labor_resources.formatters import listing_to_response
from services.labor_resources.policies import LaborPolicy
from services.labor_resources.repository import LaborRepository


class CreateLaborListingUseCase:
    def __init__(
        self,
        repository: LaborRepository,
        policy: LaborPolicy,
        send_email: SendNewLaborListingEmailUseCase | None = None,
    ) -> None:
        self.repository = repository
        self.policy = policy
        self.send_email = send_email

    async def execute(
        self,
        payload: LaborListingCreate,
        owner_id: int,
    ) -> LaborListingResponse:
        owner = await self.policy.require_user(owner_id, for_update=True)
        if payload.client_request_id is not None:
            existing = await self.repository.find_by_request(
                owner_id,
                payload.client_request_id,
            )
            if existing is not None:
                return listing_to_response(existing, owner_id)

        certificates = [
            item.model_dump(exclude_none=True)
            for item in payload.certificates
        ]
        if payload.kind == LaborListingKind.EXPERT_AVAILABLE:
            expert_profile = owner.expert_profile
            profile_certificates = (
                list(expert_profile.certificates or [])
                if expert_profile is not None
                else []
            )
            if profile_certificates:
                certificates = profile_certificates

        listing = LaborListing(
            owner_id=owner_id,
            owner=owner,
            client_request_id=payload.client_request_id,
            kind=payload.kind,
            certificates=certificates,
            other_profession=(payload.other_profession or "").strip() or None,
            region=payload.region.strip(),
            employment_term=payload.employment_term,
            fixed_term=(payload.fixed_term or "").strip() or None,
            start_date=payload.start_date,
            employment_type=payload.employment_type,
            current_job_status=payload.current_job_status,
        )
        await self.repository.add(listing)
        await self.repository.flush()
        if self.send_email is not None:
            await self.send_email.execute(listing.id)
        return listing_to_response(listing, owner_id)

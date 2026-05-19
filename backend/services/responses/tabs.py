from models.response import ResponseStatus
from schemas.response import ResponseTab


def statuses_for_tab(tab: ResponseTab | None) -> list[ResponseStatus] | None:
    if tab is None or tab == ResponseTab.ALL:
        return [
            ResponseStatus.REVIEW,
            ResponseStatus.ACCEPTED,
            ResponseStatus.IN_PROGRESS,
            ResponseStatus.REJECTED,
        ]
    if tab == ResponseTab.REVIEW:
        return [ResponseStatus.REVIEW]
    if tab == ResponseTab.IN_PROGRESS:
        return [ResponseStatus.IN_PROGRESS]
    if tab == ResponseTab.REJECTED:
        return [ResponseStatus.REJECTED]
    if tab == ResponseTab.ACCEPTED:
        return [ResponseStatus.ACCEPTED]
    if tab == ResponseTab.WITHDRAWN_BY_EXPERT:
        return [ResponseStatus.WITHDRAWN_BY_EXPERT]
    return None

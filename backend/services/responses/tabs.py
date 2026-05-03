from models.response import ResponseStatus
from schemas.response import ResponseTab


def statuses_for_tab(tab: ResponseTab | None) -> list[ResponseStatus] | None:
    if tab is None:
        return [ResponseStatus.REVIEW]
    if tab == ResponseTab.REVIEW:
        return [ResponseStatus.REVIEW]
    if tab == ResponseTab.IN_PROGRESS:
        return [ResponseStatus.IN_PROGRESS]
    if tab == ResponseTab.REJECTED:
        return [ResponseStatus.REJECTED]
    if tab == ResponseTab.ACCEPTED:
        return [ResponseStatus.ACCEPTED]
    return None

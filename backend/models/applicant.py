"""Колонки «Сведения о заявителе», общие для деталей заявок направлений."""
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column


class ApplicantColumns:
    """Заявитель в заявке направления: ФИО, должность, организация, ИНН и контакты."""

    applicant_full_name: Mapped[str] = mapped_column(String(300), nullable=False, default="", server_default="")
    applicant_position: Mapped[str] = mapped_column(String(200), nullable=False, default="", server_default="")
    applicant_organization: Mapped[str] = mapped_column(String(500), nullable=False, default="", server_default="")
    applicant_inn: Mapped[str] = mapped_column(String(12), nullable=False, default="", server_default="")
    applicant_phone: Mapped[str] = mapped_column(String(30), nullable=False, default="", server_default="")
    applicant_email: Mapped[str] = mapped_column(String(320), nullable=False, default="", server_default="")

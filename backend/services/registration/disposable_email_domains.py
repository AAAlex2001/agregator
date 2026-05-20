"Список одноразовых/мусорных почтовых доменов, регистрация на которые запрещена."

from fastapi import HTTPException, status

# Источник: ручной отбор + популярные позиции из disposable-email-domains/blocklist.
# Сравнение идёт по точному совпадению домена в нижнем регистре после '@'.
DISPOSABLE_EMAIL_DOMAINS: frozenset[str] = frozenset(
    {
        # mailinator
        "mailinator.com",
        "mailinator.net",
        "mailinator2.com",
        "binkmail.com",
        "bobmail.info",
        "chammy.info",
        "devnullmail.com",
        "letthemeatspam.com",
        "mailtothis.com",
        "notmailinator.com",
        "reallymymail.com",
        "reconmail.com",
        "safetymail.info",
        "sendspamhere.com",
        "sogetthis.com",
        "spamhereplease.com",
        "spamthisplease.com",
        "streetwisemail.com",
        "suremail.info",
        "thisisnotmyrealemail.com",
        "tradermail.info",
        "veryrealemail.com",
        "zippymail.info",

        # guerrillamail
        "guerrillamail.com",
        "guerrillamail.net",
        "guerrillamail.org",
        "guerrillamail.biz",
        "guerrillamail.de",
        "guerrillamailblock.com",
        "sharklasers.com",
        "grr.la",
        "spam4.me",
        "pokemail.net",

        # temp-mail
        "tempmail.com",
        "tempmail.de",
        "tempmail.net",
        "tempmail.us",
        "tempmail.email",
        "tempmail.org",
        "temp-mail.org",
        "temp-mail.io",
        "temp-mail.ru",
        "tempr.email",
        "tmpmail.org",
        "tmpmail.net",
        "tmail.ws",

        # 10minutemail и аналоги
        "10minutemail.com",
        "10minutemail.net",
        "10minutemail.org",
        "10minutemail.us",
        "10minutemail.co.uk",
        "10minutemail.de",
        "20minutemail.com",
        "30minutemail.com",
        "1secmail.com",
        "1secmail.net",
        "1secmail.org",

        # yopmail
        "yopmail.com",
        "yopmail.fr",
        "yopmail.net",
        "cool.fr.nf",
        "jetable.fr.nf",
        "nospam.ze.tc",
        "speed.1s.fr",

        # getnada / nada / dropmail
        "getnada.com",
        "nada.email",
        "nada.ltd",
        "wuuvo.com",
        "vomoto.com",
        "knol-power.nl",
        "v-mail.email",
        "dropmail.me",
        "emltmp.com",
        "spambog.com",
        "spambog.de",
        "spambog.ru",

        # trashmail / dispostable / fakeinbox / maildrop
        "trashmail.com",
        "trashmail.net",
        "trashmail.de",
        "trashmail.io",
        "trashmail.ws",
        "trbvm.com",
        "dispostable.com",
        "discard.email",
        "discardmail.com",
        "discardmail.de",
        "fakeinbox.com",
        "maildrop.cc",
        "mintemail.com",
        "moakt.com",
        "moakt.cc",
        "moakt.ws",
        "throwam.com",
        "throwawaymail.com",
        "burnermail.io",
        "anonymbox.com",
        "anonbox.net",

        # прочие популярные одноразовые
        "mohmal.com",
        "inboxbear.com",
        "inboxalias.com",
        "fakemail.net",
        "fakemailgenerator.com",
        "mail-temp.com",
        "mail-temporaire.fr",
        "mailcatch.com",
        "spamgourmet.com",
        "mytemp.email",
        "tempmailo.com",
        "smailpro.com",
        "tempinbox.com",
        "tempinbox.co.uk",
        "throwawayemail.com",
        "mailnesia.com",
        "mailtemp.uk",
        "mailtemp.info",
        "tempemail.net",
        "tempemail.co.za",
        "tempemail.com",
        "minutemail.com",
        "byom.de",
        "tossmail.com",
        "harakirimail.com",
        "kasmail.com",
        "spamfree24.org",
        "spamfree24.com",
        "spamfree24.de",
        "spamfree24.eu",
        "spamfree24.info",
        "spamfree24.net",
        "spamfree.eu",

        # MailDrop-семейство
        "mvrht.com",
        "deadaddress.com",
        "fastacura.com",
        "fastchevy.com",
        "fastchrysler.com",
        "fastkawasaki.com",
        "fastmazda.com",
        "fastmitsubishi.com",
        "fastnissan.com",
        "fastsubaru.com",
        "fastsuzuki.com",
        "fasttoyota.com",
        "fastyamaha.com",
    }
)


def is_disposable_email(email: str | None) -> bool:
    "True, если домен email-а есть в чёрном списке одноразовых сервисов."
    if not email or "@" not in email:
        return False
    domain = email.rsplit("@", 1)[1].strip().lower()
    return domain in DISPOSABLE_EMAIL_DOMAINS


def ensure_email_not_disposable(email: str | None) -> None:
    "Бросает 400, если email на одноразовом домене. Если email пустой — пропускает."
    if not email:
        return
    if is_disposable_email(email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Одноразовые почтовые сервисы не поддерживаются. Укажите рабочий email.",
        )

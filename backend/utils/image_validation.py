def detect_image_format(data: bytes) -> str | None:
    if len(data) < 12:
        return None
    if data[:3] == b"\xff\xd8\xff":
        return "jpeg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    if data[:4] == b"GIF8":
        return "gif"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    return None


EXTENSION_TO_FORMATS: dict[str, set[str]] = {
    ".jpg": {"jpeg"},
    ".jpeg": {"jpeg"},
    ".png": {"png"},
    ".gif": {"gif"},
    ".webp": {"webp"},
}


def extension_matches_image_bytes(extension: str, data: bytes) -> bool:
    expected = EXTENSION_TO_FORMATS.get(extension.lower())
    if not expected:
        return True
    detected = detect_image_format(data)
    return detected in expected

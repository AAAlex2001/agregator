const REGISTRATION_SECTION_ID = "registraciya";

export function scrollToRegistration() {
  const registrationSection = document.getElementById(REGISTRATION_SECTION_ID);

  if (!registrationSection) return;

  window.history.replaceState(null, "", `#${REGISTRATION_SECTION_ID}`);
  registrationSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

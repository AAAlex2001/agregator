/** Прокручивает к выбору роли и сохраняет якорь без новой записи в истории. */
export function scrollToRegistration() {
  const section = document.getElementById("registraciya");

  if (!section) {
    return;
  }

  window.history.replaceState(null, "", "#registraciya");
  section.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

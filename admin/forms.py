"""Кастомные WTForms-поля для админки SQLAdmin."""
from typing import Any

from markupsafe import Markup, escape
from wtforms import Field
from wtforms.widgets.core import html_params


def render_bullet_row(field_name: str, value: str) -> str:
    "Один редактируемый ряд: <input> с одноимённым name + кнопка минуса. WTForms склеит getlist(name) в список."
    input_attrs = html_params(
        type="text",
        name=field_name,
        value=value,
        **{"class": "form-control"},
    )
    return (
        '<div class="bullet-list-row input-group mb-2">'
        f"<input {input_attrs}>"
        '<button type="button" class="btn btn-outline-danger bullet-list-remove" '
        'aria-label="Удалить пункт">−</button>'
        "</div>"
    )


BULLET_LIST_SCRIPT = """
<script>
(function () {
  if (window.__bulletListInit) return;
  window.__bulletListInit = true;

  function removeRow(event) {
    var btn = event.target.closest('.bullet-list-remove');
    if (!btn) return;
    var row = btn.closest('.bullet-list-row');
    if (row) row.remove();
  }

  function addRow(event) {
    var btn = event.target.closest('.bullet-list-add');
    if (!btn) return;
    var container = btn.closest('.bullet-list');
    if (!container) return;
    var name = container.dataset.fieldName;
    var rows = container.querySelector('.bullet-list-rows');
    var row = document.createElement('div');
    row.className = 'bullet-list-row input-group mb-2';
    row.innerHTML =
      '<input type="text" class="form-control" name="' + name + '" placeholder="Новый пункт">' +
      '<button type="button" class="btn btn-outline-danger bullet-list-remove" ' +
      'aria-label="Удалить пункт">−</button>';
    rows.appendChild(row);
    var input = row.querySelector('input');
    if (input) input.focus();
  }

  document.addEventListener('click', function (event) {
    removeRow(event);
    addRow(event);
  });
})();
</script>
"""


class BulletListWidget:
    "HTML-виджет: список <input>'ов с одинаковым name + кнопка «+ Добавить пункт»."

    def __call__(self, field: "BulletListField", **kwargs: Any) -> Markup:
        items = list(field.data or [])
        rows_html = "".join(render_bullet_row(field.name, value) for value in items)
        return Markup(
            f'<div class="bullet-list" data-field-name="{escape(field.name)}">'
            f'<div class="bullet-list-rows">{rows_html}</div>'
            '<button type="button" class="btn btn-outline-primary bullet-list-add">'
            "+ Добавить пункт</button>"
            f"</div>{BULLET_LIST_SCRIPT}"
        )


class BulletListField(Field):
    "Редактор JSONB list[str] для SQLAdmin: ряды с +/-."

    widget = BulletListWidget()

    def process_formdata(self, valuelist: list[str]) -> None:
        self.data = [value.strip() for value in valuelist if value and value.strip()]

    def process_data(self, value: Any) -> None:
        if isinstance(value, list):
            self.data = [str(item) for item in value]
        else:
            self.data = []

/** Поля реквизитов организации: подпись и пример заполнения. */
export const BLITZ_COMPANY_FIELDS = [
  {
    field: "full_name",
    label: "Полное наименование",
    placeholder: "Общество с ограниченной ответственностью «…»",
  },
  { field: "name", label: "Краткое наименование", placeholder: "ООО «…»" },
  { field: "inn", label: "ИНН", placeholder: "10 или 12 цифр" },
  { field: "kpp", label: "КПП", placeholder: "У ИП не заполняется" },
  { field: "ogrn", label: "ОГРН или ОГРНИП", placeholder: "13 или 15 цифр" },
  { field: "address", label: "Юридический адрес", placeholder: "Индекс, город, улица, дом" },
  { field: "bank", label: "Банк", placeholder: "ПАО Сбербанк" },
  { field: "bic", label: "БИК", placeholder: "9 цифр" },
  { field: "account", label: "Расчётный счёт", placeholder: "20 цифр" },
  { field: "corr_account", label: "Корреспондентский счёт", placeholder: "20 цифр" },
  { field: "signer_position", label: "Должность подписанта", placeholder: "Генеральный директор" },
  { field: "signer_name", label: "ФИО подписанта", placeholder: "Иванов Иван Иванович" },
  {
    field: "signer_genitive",
    label: "В лице кого",
    placeholder: "генерального директора Иванова Ивана Ивановича",
  },
  { field: "signer_basis", label: "На основании", placeholder: "Устава" },
] as const;

/** Пустые реквизиты организации. */
export const EMPTY_BLITZ_COMPANY = {
  full_name: "",
  name: "",
  inn: "",
  kpp: "",
  ogrn: "",
  address: "",
  bank: "",
  bic: "",
  account: "",
  corr_account: "",
  signer_position: "",
  signer_name: "",
  signer_genitive: "",
  signer_basis: "Устава",
};
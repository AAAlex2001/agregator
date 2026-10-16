import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../../", import.meta.url);
const profileEntities = [
  "audit",
  "cadastral",
  "design",
  "ecology",
  "expertise",
  "forensic",
  "laboratory",
  "research",
  "sro",
  "survey",
  "tech-diag",
];

// Используем настоящие фабрики и API, пропуская UI-экспорты публичных index.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "@/entities/user") {
      return nextResolve(new URL("entities/user/api/register.ts", sourceRoot).href, context);
    }

    if (specifier.startsWith("@/entities/")) {
      const entity = specifier.slice("@/entities/".length);

      if (profileEntities.includes(entity)) {
        return nextResolve(
          new URL(`entities/${entity}/model/profile-values.ts`, sourceRoot).href,
          context,
        );
      }
    }

    if (specifier.startsWith("@/")) {
      return nextResolve(new URL(`${specifier.slice(2)}.ts`, sourceRoot).href, context);
    }

    if (specifier.startsWith(".") && context.parentURL) {
      const url = new URL(`${specifier}.ts`, context.parentURL);

      if (existsSync(url)) {
        return nextResolve(url.href, context);
      }
    }

    return nextResolve(specifier, context);
  },
});

const { createRegisterState, registerReducer } = await import("./reducer.ts");
const { getExpertDirections } = await import("./expert-directions.ts");
const { getExpertDocuments } = await import("./expert-documents.ts");
const { validateRegistration } = await import("./validate-registration.ts");
const { submitCustomer } = await import("./submit-customer.ts");
const { submitExpert } = await import("./submit-expert.ts");
const { submitHolder } = await import("./submit-holder.ts");

const company = {
  value: "Company",
  unrestricted_value: "Company",
  data: { inn: "1234567890" },
};

/** Создаёт файл без browser URL, поскольку тест проверяет отправку, а не просмотр. */
function document(name) {
  return {
    file: new File(["document contents"], name, { type: "application/pdf" }),
    previewUrl: `blob:test-${name}`,
  };
}

test("each expert preset selects its own profile and has independent documents", () => {
  const directions = [
    "EXPERTISE", "AUDIT_SUPB", "TECH_DIAG", "DESIGN", "ECOLOGY",
    "SURVEY", "RESEARCH", "LABORATORY", "CADASTRAL", "FORENSIC",
  ];

  for (const direction of directions) {
    const state = createRegisterState({ role: "EXPERT", direction });
    assert.deepEqual(getExpertDirections(state.expert), [direction]);
    assert.equal(validateRegistration(state), null);
  }

  const first = createRegisterState({ role: "EXPERT", direction: "DESIGN" });
  const second = createRegisterState({ role: "EXPERT", direction: "DESIGN" });
  first.expert.design.profile.specialties.push("TEST");
  first.expert.design.documents.education.push(document("diploma.pdf"));

  assert.deepEqual(second.expert.design.profile.specialties, []);
  assert.deepEqual(second.expert.design.documents.education, []);
});

test("customer audit and unsupported holder ecology preserve the existing preset behavior", () => {
  const customer = createRegisterState({ role: "CUSTOMER", direction: "AUDIT_SUPB" });
  assert.deepEqual(customer.customer.audit, { position: "", opo_license_number: "" });
  assert.deepEqual(customer.customer.directions, []);
  assert.match(validateRegistration(customer), /организацию/);
  customer.company.selected = company;
  assert.equal(validateRegistration(customer), null);

  const holder = createRegisterState({ role: "LICENSE_HOLDER", direction: "ECOLOGY" });
  assert.deepEqual(holder.holder.directions, []);
  assert.equal(holder.holder.license.enabled, false);
  assert.match(validateRegistration(holder), /направление/);
});

test("role change clears direction forms but retains contacts, location and holder files", () => {
  const previous = createRegisterState({ role: "EXPERT", direction: "DESIGN" });
  previous.account.email = "user@example.com";
  previous.company = { query: company.value, selected: company };
  previous.expert.design.documents.education = [document("diploma.pdf")];
  previous.expert.location.travels = true;
  previous.expert.contactOffer.price = "1 000";
  previous.holder.license = {
    ...previous.holder.license,
    enabled: true,
    number: "LICENSE",
    file: document("license.pdf"),
  };
  const next = registerReducer(previous, {
    type: "role/changed",
    role: "LICENSE_HOLDER",
  });

  assert.deepEqual(getExpertDirections(next.expert), []);
  assert.deepEqual(getExpertDocuments(next.expert), []);
  assert.equal(next.account, previous.account);
  assert.equal(next.company, previous.company);
  assert.equal(next.expert.location, previous.expert.location);
  assert.equal(next.expert.contactOffer, previous.expert.contactOffer);
  assert.equal(next.holder.license.enabled, false);
  assert.equal(next.holder.license.file, previous.holder.license.file);
  assert.equal(next.holder.license.number, "LICENSE");
  assert.notEqual(previous.expert.design.profile, null);
});

test("expert multipart pairs every document with its exact backend slot", async (context) => {
  const state = createRegisterState({ role: "EXPERT", direction: "DESIGN" });
  state.account.email = " user@example.com ";
  state.account.phone = "+7-999-123-45-67";
  state.expert.audit.documents = [document("audit.pdf")];
  state.expert.cadastral.diploma = document("diploma.pdf");
  state.expert.design.documents.nrs = [document("nrs.pdf")];
  state.expert.survey.documents.rtn = [document("rtn.pdf")];
  state.expert.contactOffer = {
    enabled: true,
    price: "1 500",
    paymentDetails: "  bank details  ",
    consent: true,
  };
  context.mock.method(globalThis, "fetch", async (url, options) => {
    assert.ok(url.endsWith("/register/"));
    assert.equal(options.method, "POST");
    assert.equal(options.credentials, "include");
    assert.equal(options.headers, undefined);
    const payload = JSON.parse(options.body.get("payload"));
    assert.equal(payload.email, "user@example.com");
    assert.equal(payload.phone, "+79991234567");
    assert.equal(payload.role, "EXPERT");
    assert.equal(payload.referral_code, "invitation-code");
    assert.equal(payload.contact_price_rubles, 1500);
    assert.equal(payload.contact_payment_details, "bank details");
    assert.equal(payload.audit_expert_profile, null);
    assert.deepEqual(options.body.getAll("document_directions"), [
      "AUDIT_SUPB", "CADASTRAL_DIPLOMA", "DESIGN_NRS", "SURVEY_RTN",
    ]);
    assert.deepEqual(
      options.body.getAll("documents").map((file) => file.name),
      ["audit.pdf", "diploma.pdf", "nrs.pdf", "rtn.pdf"],
    );
    return Response.json({ id: 1 });
  });

  await submitExpert(state.account, state.expert, "invitation-code");
});

test("customer sends company and names without expert documents", async (context) => {
  const state = createRegisterState({ role: "CUSTOMER", direction: "AUDIT_SUPB" });
  state.account.firstName = "  First  ";
  state.account.lastName = "  Last  ";
  context.mock.method(globalThis, "fetch", async (url, options) => {
    assert.ok(url.endsWith("/register/"));
    const payload = JSON.parse(options.body.get("payload"));
    assert.equal(payload.role, "CUSTOMER");
    assert.equal(payload.inn, company.data.inn);
    assert.deepEqual(payload.company_data, company);
    assert.equal(payload.first_name, "First");
    assert.equal(payload.last_name, "Last");
    assert.equal("phone" in payload, false);
    assert.deepEqual(payload.audit_customer_profile, state.customer.audit);
    assert.deepEqual(options.body.getAll("documents"), []);
    return Response.json({ id: 2 });
  });

  await submitCustomer(state.account, state.customer, company);
});

test("holder sends numeric SRO values and exact document field names", async (context) => {
  const state = createRegisterState({ role: "LICENSE_HOLDER", direction: "DESIGN" });
  state.holder.design.pricing_percent = "2,5";
  state.holder.license = {
    ...state.holder.license,
    enabled: true,
    rentalKind: "FIXED",
    rentalFixed: "10 000",
    file: document("license.pdf"),
  };
  state.holder.regulatoryDocuments = {
    miningNumber: " MINING ",
    miningFile: document("mining.pdf"),
    sroDesignFile: document("design.pdf"),
    sroSurveyFile: document("survey.pdf"),
    laboratoryNumber: " LAB ",
    laboratoryFile: document("lab.pdf"),
  };
  context.mock.method(globalThis, "fetch", async (url, options) => {
    assert.ok(url.endsWith("/register/license-holder"));
    const payload = JSON.parse(options.body.get("payload"));
    assert.equal(payload.license_rental_fixed_amount, 10000);
    assert.equal(payload.design_profile.pricing_percent, 2.5);
    assert.equal(payload.design_profile.liability_level, 1);
    assert.equal(payload.mining_license_number, "MINING");
    assert.equal(payload.lab_accreditation_number, "LAB");
    assert.deepEqual([...options.body.keys()], [
      "payload", "license_file", "mining_license_file",
      "sro_design_file", "sro_survey_file", "lab_accreditation_file",
    ]);
    return Response.json({ id: 3 });
  });

  await submitHolder(state.account, state.holder, company);
});

test("registration error is returned without retrying a multipart POST", async (context) => {
  const state = createRegisterState({ role: "EXPERT", direction: "RESEARCH" });
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    return Response.json({ detail: "Already registered" }, { status: 409 });
  });

  await assert.rejects(
    submitExpert(state.account, state.expert, undefined),
    /Already registered/,
  );
  assert.equal(requests, 1);
});

test("network failure has a readable message for both registration endpoints", async (context) => {
  const state = createRegisterState(null);
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    throw new TypeError("Failed to fetch");
  });

  await assert.rejects(
    submitExpert(state.account, state.expert, undefined),
    /Не удалось связаться с сервером/,
  );
  await assert.rejects(
    submitHolder(state.account, state.holder, company),
    /Не удалось связаться с сервером/,
  );
  assert.equal(requests, 2);
});


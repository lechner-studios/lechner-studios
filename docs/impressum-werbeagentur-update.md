# Impressum update — add the Werbeagentur trade

**Trigger:** Apply this the moment the **Werbeagentur GISA-Zahl** is issued (GISA entry appears, ~1–3 business days after the 2026-06-19 Gewerbeanmeldung to BH Innsbruck).

**Why it's not in the live Impressum yet:** each Gewerbeberechtigung gets its **own** GISA-Zahl. The EDV/IT trade is `39801708`; the Werbeagentur gets a **new** number we don't have yet. We do not put a placeholder on a live legal surface — so this stays a tracked draft until the number lands. (Confirm the per-trade-vs-shared GISA-Zahl detail when you read the GISA entry; adjust below if it's shared.)

When the number is in: drop the `<<…>>` placeholder, then apply both edits (DE + EN in parallel — `feedback_legal_pages_canonical`), tsc + build, ship.

---

## `src/components/LegalImpressumDE.tsx`

**Tätigkeit (object of business)** — append after "…IT-Beratung und -Schulung).":
> … IT-Beratung und -Schulung) sowie Werbung und Marktkommunikation (Markengestaltung, Markenidentität und Content-/Marketingkommunikation).

**Gewerbe block** — replace the single-trade value with both:
```
Dienstleistungen in der automatischen Datenverarbeitung und
Informationstechnik (freies Gewerbe), GISA-Zahl: 39801708
<br />
Werbeagentur (freies Gewerbe), GISA-Zahl: <<NEU — einsetzen, sobald im GISA eingetragen>>
```

**Mitgliedschaft block** — add the second Fachgruppe (same Sparte):
> Wirtschaftskammer Tirol — Fachgruppe Unternehmensberatung, Buchhaltung und Informationstechnologie (UBIT) sowie Fachgruppe Werbung und Marktkommunikation, Sparte Information & Consulting.

---

## `src/components/LegalImpressumEN.tsx`

**Object of business** — append after "…IT consulting and training).":
> … IT consulting and training), as well as advertising and marketing communication (brand design, brand identity and content/marketing communication).

**Trade (Gewerbe) block** — both trades (keep the German trade wordings, they're the registered designations):
```
Dienstleistungen in der automatischen Datenverarbeitung und
Informationstechnik (free trade), GISA no.: 39801708
<br />
Werbeagentur (free trade), GISA no.: <<NEW — fill in once entered in GISA>>
```

**Chamber membership** — add the second Professional Group:
> Wirtschaftskammer Tirol (Tyrol Economic Chamber) — Professional Group UBIT (Management Consulting, Accounting & IT) and Professional Group Advertising & Market Communication.

---

## Also when the trade is confirmed
- Reuse the new Werbeagentur GISA-Zahl on offers/footers alongside `39801708` (`reference_ls_legal_identifiers`).
- The standalone Brand/content copy (this same PR) is already live-safe — the trade is *wirksam mit dem Tag des Einlangens* (2026-06-19).

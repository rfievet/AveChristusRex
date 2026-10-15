# Research Summary: The Divinity of Christ (Jesus Is God)

**Deliverable:** structured data in `jesus-is-god.json` for the website to render.
**Display translation (consistent throughout):** Douay-Rheims American Edition (DRA, 1899) — a reliable Catholic, public-domain translation. English Scripture text was verified against bible-api.com; NWT renderings were verified directly against the official New World Translation (2013 revision) on jw.org; Greek/Hebrew and manuscript sigla are given from standard scholarship.
**Total arguments:** 22
**Audience:** a Catholic debating a Jehovah's Witness — every argument states how the NWT renders the passage and why that rendering is disputed.

## Strength key
- `scriptural` = direct / strong / defensible (near slam-dunk)
- `strong` = solid and defensible, but with a contestable point noted
- `supplementary` = devotional/traditional, suggestive not conclusive

## Argument list (id — title — strength — key citations)

### Addressed as God
- `thomas-my-lord-my-god` — Thomas: "My Lord and my God" — **scriptural** — John 20:28-29
- `john-1-1-word-was-god` — John 1:1 "and the Word was God" — **scriptural** — John 1:1
- `titus-great-god-savior` — Titus 2:13 "our great God and Savior" (Granville Sharp) — **scriptural** — Titus 2:13
- `2peter-god-and-savior` — 2 Peter 1:1 "our God and Savior Jesus Christ" (Granville Sharp) — **scriptural** — 2 Peter 1:1
- `hebrews-throne-o-god` — Hebrews 1:8 "Thy throne, O God" — **scriptural** — Hebrews 1:8-9
- `1john-true-god` — 1 John 5:20 "This is the true God" — **strong** — 1 John 5:20

### Does what only God does
- `john-1-creator-made-flesh` — John 1:1-3,14 Word is Creator, became flesh — **scriptural** — John 1:1-3,14
- `forgives-sins` — Jesus forgives sins (only God can) — **scriptural** — Mark 2:5-7; Luke 5:20-21
- `colossians-creator-sustainer` — Colossians 1:15-17 all things created/sustained in Him — **scriptural** — Colossians 1:15-17

### Claims the divine name/identity
- `makes-himself-god` — Accused of making Himself God, does not deny — **scriptural** — John 10:30-33; John 5:18
- `before-abraham-i-am` — "Before Abraham was, I AM" — **scriptural** — John 8:58-59; Exodus 3:14
- `john-seen-me-seen-father` — "He that seeth me seeth the Father" — **strong** — John 14:9
- `micah-from-everlasting` — Micah 5:2 origins "from the days of eternity" — **strong** — Micah 5:2

### Receives worship
- `worship-of-jesus` — Jesus accepts worship; angels/apostles refuse — **strong** — Matthew 14:33; 28:9,17; John 9:38; Hebrews 1:6; Revelation 19:10; 22:8-9; Acts 10:25-26
- `john-honour-the-son` — John 5:23 honour the Son as the Father — **strong** — John 5:22-23
- `acts-pray-to-jesus` — Stephen prays "Lord Jesus, receive my spirit" — **strong** — Acts 7:59 (= 7:58 DRA); Luke 23:46

### Old Testament titles of YHWH applied to Jesus
- `philippians-form-of-god` — Philippians 2:6-11 "form of God"; every knee bows (Isaiah 45:23) — **scriptural** — Philippians 2:6-11; Isaiah 45:23
- `isaiah-mighty-god` — Isaiah 9:6 "Mighty God" (El Gibbor); cf. Isaiah 10:21 of YHWH — **strong** — Isaiah 9:6; Isaiah 10:21
- `revelation-first-and-last` — "First and the Last", "Alpha and Omega" — **scriptural** — Revelation 1:17-18; 2:8; 22:13; Isaiah 44:6; 48:12
- `zechariah-pierced` — "they shall look upon me whom they have pierced" — **strong** — Zechariah 12:10; John 19:37
- `emmanuel-god-with-us` — Matthew 1:23 Emmanuel, "God with us" — **strong** — Matthew 1:23; Isaiah 7:14

### Supplementary/traditional
- `inri-yhwh-acrostic` — Cross titulus / YHWH acrostic — **supplementary** — John 19:19-20; Exodus 3:14-15

## Citations flagged as uncertain / needing a caveat
These are documented in the JSON `uncertainCitations` array and inside the relevant arguments:

1. **Acts 7:59 vs 7:58** — versification difference. The clause "Lord Jesus, receive my spirit" is Acts 7:59 in Greek/modern Bibles but Acts 7:58 in the Douay-Rheims (Vulgate numbering). Wording identical; labeled explicitly in the data.
2. **Isaiah 44:6 (DRA via bible-api.com)** — the automated source returned a corrupted token ("I am the brat") for "I am the first". The known-correct DRA wording was used instead; the bad token was NOT trusted.
3. **1 John 5:20** — the antecedent of "this is the true God" (Jesus vs the Father) is grammatically contestable. Rated `strong`, not slam-dunk.
4. **Micah 5:2 ("olam")** — Hebrew "mimei olam" can mean "ancient times" or "everlasting"; eternal-preexistence reading is defensible but not forced. Rated `strong`.
5. **Matthew 1:23 (Emmanuel)** — theophoric names do not by themselves deify the bearer; divine-identity reading depends on Matthew's framing. Rated `strong`.
6. **INRI / YHWH acrostic (John 19:19-20)** — devotional/traditional only. The Gospel records no Hebrew titulus or acrostic; the Hebrew reconstruction and exact Y-H-V-H letter order are debated. Labeled `supplementary` and explicitly flagged NOT to be used as a debate proof.
7. **NWT Colossians 1:16-17 brackets** — the inserted "other" is in the current (2013) NWT without brackets; older editions printed "[other]". Both noted.

## Notes on verification method
- English display text: Douay-Rheims (DRA) pulled and verified via bible-api.com.
- NWT renderings for the flagship disputes verified directly from jw.org (New World Translation, 2013 Study Bible): John 1:1 "a god"; John 8:58 "I have been"; Colossians 1:16-17 "all other things"; Titus 2:13 "the great God and of our Savior"; Hebrews 1:8 "God is your throne"; Hebrews 1:6 / Matthew 14:33 "do obeisance".
- Greek grammar points (anarthrous predicate nominative / Colwell's rule for John 1:1; Granville Sharp's rule for Titus 2:13 and 2 Peter 1:1) and manuscript sigla (P66, P75, Codex Sinaiticus ℵ/01, Codex Vaticanus B/03) reflect standard NT textual scholarship.
- The divine name YHWH / Yahweh (Tetragrammaton יהוה) of Exodus 3:14-15 was verified as the backdrop for the "I AM" and "First and the Last" arguments.

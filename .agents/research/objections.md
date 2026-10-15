# Research Summary: Objections & Rebuttals (Answering the Watch Tower's Verses)

**Deliverable:** structured data in `src/data/content/objections.json` (+ typed re-export `objections.ts`) for the website to render via the existing data-driven `TopicPage`. New live topic id `objections`, navLabel `Objections & Rebuttals`.

**Audience & purpose:** a Catholic debating a Jehovah's Witness live. Each argument is a JW *objection* — the verse a Witness raises to deny Christ's divinity — paired with the orthodox, debate-ready answer. This is the mirror image of the `jesus-is-god` topic (which collects the positive case); here we answer the Watch Tower's counter-texts.

**Display translation (consistent throughout):** Douay-Rheims American Edition (DRA, 1899) for displayed English Scripture, matching the rest of the site. Where Greek/Hebrew resolves the dispute, the original language is given with transliteration. NWT renderings (2013 revision) are quoted where relevant and were verified against jw.org / Watchtower Online Library.

## Argument shape (mirrors `jesus-is-god` conventions)

Each objection uses the existing `Argument` interface:
- `title` = the objection *in the JW's words*, with the verse (e.g. `"'The Father is greater than I' — John 14:28"`).
- `shortClaim` = how the JW *uses* the verse (their inference).
- `category` = one of the four `categories` below.
- `strength` = how strong the *Catholic rebuttal* is. `scriptural` = rebuttal is decisive; `strong` = rebuttal is solid but the text is genuinely two-edged; `supplementary` = contested, present honestly.
- `primaryReferences` = the verse(s) in DRA (key verse + supporting cross-refs like Phil 2:6-7, Ps 89:27).
- `originalLanguage` = Greek/Hebrew where it resolves the dispute (object form).
- `nwtRebuttal` = how the NWT renders the verse, when the rendering itself is part of the dispute. (Reused here to carry the NWT wording; many objection verses the NWT renders normally, so this is omitted when not relevant.)
- `explanation` = the plain-language Catholic/orthodox answer for live debate.

## Categories (ordered)
1. **Subordination texts** — "greater than I", functional subjection, "my God", head of Christh.
2. **"Created / firstborn" texts** — firstborn, beginning of creation, Wisdom created.
3. **Monotheism / "only true God" texts** — Shema, "only true God", one mediator, "no god formed".
4. **"Did not know / less than" texts** — nor the Son, why callest thou me good.

## Objection list (id — title — category — rebuttal strength)

### Subordination texts
- `obj-john-14-28` — "The Father is greater than I" (John 14:28) — **scriptural**
- `obj-1cor-15-28` — "The Son also himself shall be subject" (1 Cor 15:28) — **scriptural**
- `obj-john-20-17` — "My Father and your Father, my God and your God" (John 20:17) — **scriptural**
- `obj-1cor-11-3` — "The head of Christ is God" (1 Cor 11:3) — **strong**
- `obj-acts-2-36` — "God hath made him both Lord and Christ" (Acts 2:36) — **strong**

### "Created / firstborn" texts
- `obj-col-1-15` — "The firstborn of every creature" (Col 1:15) — **scriptural**
- `obj-rev-3-14` — "The beginning of the creation of God" (Rev 3:14) — **strong**
- `obj-prov-8-22` — "The Lord possessed/created me" (Prov 8:22-31) — **supplementary** (contested application)

### Monotheism / "only true God" texts
- `obj-deut-6-4` — "The Lord our God is one Lord" (Deut 6:4 / Mark 12:29) — **scriptural**
- `obj-john-17-3` — "Thee, the only true God" (John 17:3) — **scriptural**
- `obj-1tim-2-5` — "One mediator ... the man Christ Jesus" (1 Tim 2:5) — **scriptural**
- `obj-isa-43-10` — "Before me there was no God formed" (Isa 43:10-11) — **scriptural**

### "Did not know / less than" texts
- `obj-mark-13-32` — "Nor the Son" (Mark 13:32; Matt 24:36) — **scriptural**
- `obj-luke-18-19` — "Why callest thou me good?" (Luke 18:19; Mark 10:18) — **scriptural**

## Verified DRA verse text (from drbo.org, the Challoner Douay-Rheims)

- **John 14:28** (NWT, jw.org): "because the Father is greater than I am." DRA: "If you loved me, you would indeed be glad, because I go to the Father: for the Father is greater than I." (DRA wording verified via biblestudytools RHE / standard Challoner.)
- **1 Cor 15:28** (DRA, drbo + RHE): "And when all things shall be subdued unto him, then the Son also himself shall be subject unto him that put all things under him, that God may be all in all."
- **John 20:17** (DRA, drbo.org 50020): "I ascend to my Father and to your Father, to my God and your God."
- **1 Cor 11:3** (DRA, RHE): "But I would have you know, that the head of every man is Christ; and the head of the woman is the man; and the head of Christ is God."
- **Acts 2:36** (DRA, drbo.org 51002): "Therefore let all the house of Israel know most certainly, that God hath made both Lord and Christ, this same Jesus, whom you have crucified."
- **Col 1:15** (DRA, from existing jesus-is-god.json): "Who is the image of the invisible God, the firstborn of every creature." (v16-17 already quoted in jesus-is-god.json `colossians-creator-sustainer`.)
- **Rev 3:14** (DRA, Challoner): "And to the angel of the church of Laodicea write: These things saith the Amen, the faithful and true witness, who is the beginning of the creation of God." NWT (jw.org): "the beginning of the creation by God." Greek: ἡ ἀρχὴ τῆς κτίσεως τοῦ θεοῦ (hē archē tēs ktiseōs tou theou).
- **Prov 8:22** (DRA, drbo.org 22008): "The Lord possessed me in the beginning of his ways, before he made any thing from the beginning." Hebrew קָנָנִי (qanani, from qanah = possess/acquire/beget/create). LXX: ἔκτισέ με (ektise me = "created me"). NWT: "Jehovah produced me as the beginning of his way."
- **Prov 8:30** (DRA, drbo.org 22008): "I was with him forming all things: and was delighted every day, playing before him at all times."
- **Deut 6:4** (DRA, drbo.org 05006): "Hear, O Israel, the Lord our God is one Lord." Hebrew: שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד (Shema Yisrael YHWH Eloheinu YHWH echad); the operative word is אֶחָד (echad = "one", a word that can denote compound/united oneness, e.g. "one flesh" Gen 2:24).
- **Mark 12:29** (DRA): "And Jesus answered him: The first commandment of all is, Hear, O Israel: the Lord thy God is one God."
- **John 17:3** (DRA, drbo.org 50017): "Now this is eternal life: That they may know thee, the only true God, and Jesus Christ, whom thou hast sent."
- **1 Tim 2:5** (DRA, drbo.org 61002): "For there is one God, and one mediator of God and men, the man Christ Jesus."
- **Isa 43:10** (DRA, drbo.org 27043): "You are my witnesses, saith the Lord, and my servant whom I have chosen: that you may know, and believe me, and understand that I myself am. Before me there was no God formed, and after me there shall be none."
- **Isa 43:11** (DRA): "I am, I am the Lord: and there is no saviour besides me."
- **Mark 13:32** (DRA, drbo.org 48013): "But of that day or hour no man knoweth, neither the angels in heaven, nor the Son, but the Father." (DRA footnote at v32: "Nor the Son: Not that the Son of God is absolutely ignorant of the day of judgment, but that he knoweth it not, as our teacher; that is, he knoweth it not so as to teach it to us, as not being expedient." — the Church's own gloss.)
- **Matt 24:36** (DRA, drbo.org 47024): "But of that day and hour no one knoweth, not the angels of heaven, but the Father alone." (NOTE: the Challoner DRA at Matt 24:36 OMITS "nor the Son"; the "nor the Son" clause is textually secure at Mark 13:32. Flagged as uncertain/textual.)
- **Luke 18:19** (DRA, drbo.org 49018): "Why dost thou call me good? None is good but God alone."
- **Mark 10:18** (DRA): "Why callest thou me good? None is good but one, that is God." (parallel)

## Supporting cross-references (DRA, for the rebuttals)
- **Phil 2:6-7** (already in jesus-is-god.json): "Who being in the form of God, thought it not robbery to be equal with God: But emptied himself, taking the form of a servant..." — the two-natures / kenosis key to John 14:28, Mark 13:32, Luke 18:19.
- **Ps 89:27** (DRA numbering Ps 88:28): "And I will make him my firstborn, high above the kings of the earth." — "firstborn" = rank/heirship, not origin (answers Col 1:15).
- **John 20:28** (already in jesus-is-god.json): "My Lord, and my God." — Thomas calls the risen Christ "my God"; contrast with John 20:17 "my God" spoken by the incarnate Son *as man* to the Father.

## Greek / Hebrew points used in the rebuttals
- **John 14:28** — "greater" = μείζων (meizōn), comparative of *greatness/rank*, not κρείττων/better in nature. Jesus is comparing the Father's heavenly glory with his own then-humbled, incarnate state ("I go to the Father"), i.e. position, not nature. Cf. "equal" (ἴσα, isa) in Phil 2:6.
- **Col 1:15** — πρωτότοκος πάσης κτίσεως (prōtotokos pasēs ktiseōs). prōtotokos = firstborn, a title of *rank/heirship* (Ps 89:27 of David; Israel as God's "firstborn" Ex 4:22). The word for "first-created" would be πρωτόκτιστος (prōtoktistos), which Paul does NOT use. v16 ("FOR in him all things were created") grounds the title in his role as Creator.
- **Rev 3:14** — ἀρχή (archē) = beginning/origin/source/ruler (cf. "archē" root in archon = ruler, archē = principality). Active sense ("the Originator/Ruler of God's creation") fits Rev 1:17-18 and Col 1:16. The NWT's "beginning of the creation by God" presses the passive sense. GENUINELY TWO-EDGED; rate `strong`, present the ambiguity.
- **Prov 8:22** — קָנָה (qanah) can mean "possess/acquire/beget" or "create"; LXX chose ἔκτισε (created). The Arian controversy turned partly on this verse. BUT the application of personified Wisdom to the pre-incarnate Christ is itself an *interpretive* move; the chapter is Hebrew poetry personifying God's Wisdom. CONTESTED on two levels (lexical + application). Rate `supplementary`, present honestly; do not over-rely in debate.
- **Deut 6:4** — אֶחָד (echad) = "one", used of *compound* unity elsewhere ("one flesh", Gen 2:24; "one cluster", Num 13:23). The Shema asserts there is *one* God (monotheism), which Trinitarianism affirms; it does not specify the inner life of that one God as unipersonal. The word for an absolute/solitary one would be יָחִיד (yachid), which the Shema does NOT use.

## Rebuttal strategy summary (plain-language, per objection)
See the full `explanation` strings in `objections.json`. The recurring moves:
1. **Two natures (Chalcedon).** Christ is true God and true man. Texts of weakness/subjection/ignorance/prayer describe the Son *as man* (his assumed human nature or his incarnate mission), not a deficiency in his divine nature. (John 14:28, 1 Cor 15:28, Mark 13:32, Luke 18:19, John 20:17.)
2. **Economic/functional subordination ≠ inferior nature.** Equals can have an order of relation (a son obeys a father without being less human). (1 Cor 11:3, 1 Cor 15:28.)
3. **Word studies.** firstborn/prōtotokos = heir not first-made; archē = source/ruler; echad = united one; "greater" = rank not nature.
4. **Monotheism is the Trinity's own premise.** "Only true God" / "no god formed" verses are affirmed by Catholics: there is exactly one God, and Father, Son, Spirit are that one God. These verses refute polytheism — including the NWT's "a god" (two-tier) reading of John 1:1.
5. **Context & the positive case.** Each rebuttal points back to the flagship `jesus-is-god` arguments (John 1:1, John 20:28, John 8:58, Col 1:16-17, Titus 2:13).

## Citations flagged UNCERTAIN / contested (go in objections.json `uncertainCitations`)
1. **Proverbs 8:22-31 (application + qanah)** — DOUBLY contested: (a) Hebrew qanah is lexically ambiguous (possess/acquire vs create); LXX reads "created". (b) Applying personified Wisdom to the pre-incarnate Son is an interpretive tradition, not a direct NT identification. Rated `supplementary`; present honestly, do not lean on it.
2. **Revelation 3:14 (archē)** — "beginning" vs "origin/ruler" is a real translation choice; the passive reading ("first thing created") is defensible grammatically even though the active ("source/ruler of creation") fits the context better. Rated `strong`, not slam-dunk.
3. **John 14:28** — the verse is TRUE on any reading ("the Father is greater"); the dispute is only what "greater" refers to (position/incarnation vs nature). The rebuttal (position, not nature; cf. Phil 2:6-7) is strong but rests on the two-natures framework a Witness rejects a priori; flag that the argument is systematic, not a single-verse knockout.
4. **Matthew 24:36 "nor the Son"** — TEXTUAL: the Challoner DRA at Matt 24:36 omits "nor the Son"; many Greek mss and modern critical texts include it (it is secure at Mark 13:32). Do not claim the DRA Matt 24:36 contains the clause. Use Mark 13:32 as the primary.
5. **1 John / Shema echad** — the "compound unity" argument for echad is contested by Hebraists (echad most often just means the numeral "one"); it does NOT by itself prove plurality in God. Use it only to show the Shema does not EXCLUDE the Trinity (it uses echad, not the solitary yachid), not to prove the Trinity from the word.

## Verification method
- DRA English: drbo.org (Challoner) verified for Mark 13:32, Matt 24:36, Luke 18:19, John 10:34-35, John 17:3, John 20:17, Acts 2:36, Deut 6:4, Isa 43:10-11, 1 Tim 2:5, Prov 8:22; biblestudytools RHE / biblehub parallel for 1 Cor 15:28, 1 Cor 11:3.
- NWT (2013): John 14:28 "the Father is greater than I am", Rev 3:14 "the beginning of the creation by God", Prov 8:22 "Jehovah produced me as the beginning of his way" — verified via Watchtower Online Library (wol.jw.org) / jw.org.
- Greek/Hebrew (prōtotokos, archē, qanah, echad, meizōn) from standard lexica (BDAG/HALOT level) as reflected on biblehub lexicon pages; transliterations given.

*Content was rephrased for compliance with licensing restrictions; Scripture quotations are from the public-domain Douay-Rheims (DRA).*

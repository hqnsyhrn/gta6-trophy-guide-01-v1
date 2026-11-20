# Leonida Platinum Guide — GTA 6 Trophy Guide & Tracker

![Bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)
![Rank](https://make.fun/badge/gta6-trophy-guide-01/hqnsyhrn/gta6-trophy-guide-01-v1/rank.svg)
![Reward](https://make.fun/badge/gta6-trophy-guide-01/hqnsyhrn/gta6-trophy-guide-01-v1/reward.svg)

Bounty: https://make.fun/bounty/gta6-trophy-guide-01

An offline, open-source web app that guides and tracks all **55 PlayStation 5 trophies** of Grand Theft Auto VI: official names, descriptions and grades (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden), a guide in our own words for each trophy with every step citing its sources, a roadmap to the platinum (S1–S7), the one possibly missable trophy flagged with both versions of the disputed count, and a tracker that saves progress in the browser with export/import, kind/grade/status filters, search, and a spoiler setting that hides story trophies until earned.

## What is inside

- `app/` — the static app (no build step, no network requests at run time): `index.html`, `app.js`, `style.css`, `data/trophies.json`
- `screenshots/` — 4 real renders of the app in a browser
- `main.ts` — the entry program: copies `app/` and `screenshots/` to the output and writes `dossier.json` with `buildDossier`
- `vendor/makefun-frontend.ts` — the kit's library, unchanged

## Facts (all shown in the app's audit strip, computed from the data)

- 55 official trophies · 1P 2G 6S 46B · 28 hidden
- 55/55 guides cite a source · 227/227 steps cited · 10 sources read 20 Nov 2026
- 1 possibly missable: Positive Mental Attitude (Chapter 1 balcony meditation with Lucia)
- Difficulty 4/10 · ~200 hours to platinum · 0 online trophies
- Honesty labels per trophy: CONFIRMED / UNCONFIRMED / SINGLE-SOURCE / SOURCES DISAGREE — 42 confirmed, 4 unconfirmed, 7 single-source, 2 disagree
- 100% completion is about 60% of the game's true total content: 200/277 vehicles, 100/255 animals, 300 stunts, 70/80 challenges, 100 optional missions

## Save discipline

No mission replay. No New Game+. Cheats disable trophies and saving. 15 manual save slots — keep a save at the start and end of every chapter.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Build the dossier

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Unofficial fan guide. Not affiliated with Rockstar Games. Trophy names and descriptions © PlayStation as published.

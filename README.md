# PokéLedger

A personal Pokémon collection website for English and Japanese physical cards, with USD market benchmarks.

## What is included

- 34,037 catalogue entries across 389 sets, imported on October 4, 2026.
- 20,786 cards matched to USD prices from TCGplayer through TCGCSV.
- Search by Pokémon name, matched English names for Japanese cards, card number, or set.
- Filter by language, release year, set, series, and available rarity.
- Filter by Pokémon using English and Japanese names. Pokémon are indexed by names appearing in card titles; regional forms and special card suffixes stay grouped with their species. This filter also applies to the catalogue year chart.
- Year distribution chart and table for the catalogue and owned copies.
- Durable personal collection storage, quantity, printing, condition, purchase cost, set completion, and CSV export.
- Collection valuation and gain/loss on priced entries only.
- Current card detail prices cached for 24 hours and daily price observations saved when a card is viewed or a collection is refreshed.

## Data limitations

This is source coverage, not a claim of every Pokémon card ever printed. Digital Pokémon TCG Pocket cards and future-dated sets are excluded. Catalogue gaps and unmatched or ambiguous market products remain unpriced. Market benchmarks do not adjust for condition or grading. Rarity filters cover entries with available market metadata.

TCGCSV's historical archive currently returns a notice that it has been temporarily removed. No historical values are fabricated. The website shows a 15-day change only when observations exist for today and exactly 15 days earlier, using the same printing and price measure. It does not collect observations automatically while closed.

Catalogue tiles show the imported price snapshot; opening a card and refreshing the collection check current prices. The source snapshot was last updated October 3, 2026 at 20:05 UTC.

## Running locally

The development preview is at http://127.0.0.1:5173/ while its server runs. If local collection access asks for sign-in, open http://127.0.0.1:5173/signin-with-chatgpt in the same browser. Local preview uses a development identity; a private hosted deployment uses your signed-in identity.

Use Node 22.13 or later. Install dependencies with pnpm install, then run pnpm dev. The first run imports the catalogue and current quotes; internet access is required. Generated catalogue, market mapping, and set cache files are excluded from Git. The species list is included. The source counts above describe the locally tested October 4 snapshot; a fresh import can change.

For the restricted Windows preview, start with:

```
node scripts/prepare-data.mjs
node --import ./scripts/sites-env.mjs --require ./scripts/windows-user.cjs scripts/run-framework.mjs dev
```

The Windows compatibility preload handles a restricted-session user lookup; it does not change application authentication.

## Refreshing the imported data

```
node scripts/sync-catalog.mjs
node scripts/sync-prices.mjs
```

The price importer uses cached group files under the workspace's work/prices folder, scoped to the source update timestamp so an older cache is not relabeled as current. Requests follow TCGCSV's custom User-Agent and request spacing guidelines. Price matches require a unique set and card-number match; Separate market products sharing a card number are preserved as distinctly labeled printings.

## Validation

Type checking and production compilation succeeded. Local checks verified Japanese USD lookup, a saved price observation, collection creation, reload, edit, and deletion. Sample collection entries were removed after verification.

## Hosting status

A private Site was registered, but publication was blocked by automatic approval review when the publishing workflow attempted to receive its required input. No successful deployment URL exists yet. The complete local source is preserved here.

## Sources

- https://tcgdex.dev/rest
- https://tcgdex.dev/markets-prices
- https://tcgcsv.com/docs
- https://tcgcsv.com/faq

## Images

Images try TCGdex WebP and PNG, followed by an alternate TCGplayer image matched within a unique set/language and collector number. English names must also match. Ambiguous products are skipped. Artwork is a catalogue reference and does not establish condition, foil treatment, or grading.

## Fresh checkout database

After starting the development server once, apply the included migrations in a second terminal:

```sh
pnpm exec wrangler d1 migrations apply site-creator-d1 --local --persist-to .wrangler/state --config .sites-runtime/wrangler-local.json
```

Open `/signin-with-chatgpt` on the local preview if collection access requires sign-in. Keep the resulting local database out of Git. The checked-in hosting configuration declares the database binding only; a hosted deployment needs its own registered project.

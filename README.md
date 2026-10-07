# PokéLedger

A personal Pokémon card tracker for English and Japanese physical cards, with US market prices in USD.

## Website

Deployment is pending. The live link will be added after the Vercel deployment is available.

## Features

- Search cards and filter by Pokémon, language, release year, set, series, and rarity.
- Browse release-year distributions for the catalogue or your collection.
- Track quantities, printing, condition, purchase cost, estimated value, and set completion.
- Export your collection as CSV.
- View current USD quotes, price observations, and links to comparable eBay sold listings.
- Load alternate card images only when set, language, and collector number identify a unique product. English names must also match.

## Run locally

Use Node.js 22.13 or later.

```sh
npm install
npm run dev
```

Open http://localhost:5173. The first run imports the catalogue and price mappings from public APIs and may take several minutes. Internet access is required. Generated data is ignored by Git.

```sh
npm run data:sync
npm run typecheck
npm run build
npm start
```

The catalogue is a build-time snapshot. Run the sync command and rebuild to refresh it. Card details fetch market quotes with a daily cache.

## Deploy on Vercel

1. Merge the project pull request, or select its branch when importing the repository.
2. Import `harsh-github007/Pok-mon` into Vercel.
3. Use the **Next.js** framework preset, repository root, Node.js 22, and the included build/install settings.
4. Deploy, then copy the production URL into the Website section above.

No authentication provider, database, or API key is required. A clean build downloads the catalogue and quotes; upstream availability can affect the build.

## Collection storage

Your collection and daily observations are stored in the browser on the current website address. They do not sync across devices, browsers, preview deployments, or domains. Clearing browser data removes them. Export CSV backups before changing devices or domains. An older database-backed installation is not automatically imported into this version.

## Data and limitations

- Catalogue and primary images: [TCGdex](https://tcgdex.dev).
- Market quotes and alternate product images: [TCGplayer through TCGCSV](https://tcgcsv.com).
- Pokémon names: [PokeAPI species data](https://github.com/PokeAPI/pokeapi).
- Sold-listing comparisons: [eBay](https://www.ebay.com).

The locally tested October 4, 2026 snapshot contains 34,037 cards across 389 sets, with 20,786 entries matched to USD quotes. A fresh import can change these counts. Source coverage is incomplete; digital Pocket cards and future-dated sets are excluded. Ambiguous images remain unavailable. Reference images do not establish foil treatment, grading, or condition.

Market estimates use raw-card benchmarks. Unpriced cards are excluded from value and gain/loss. A 15-day percentage appears only when the same printing has an observation today and exactly 15 days earlier. Observations are recorded when you open cards; no unattended daily collection or retrospective history is provided.

Independent personal project. Not affiliated with The Pokémon Company, Nintendo, or marketplace providers.

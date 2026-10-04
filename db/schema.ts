// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { integer, real, sqliteTable, text, primaryKey, index } from 'drizzle-orm/sqlite-core';
export const collection = sqliteTable('collection', {
 id: text('id').primaryKey(), owner: text('owner').notNull(), card: text('card').notNull(),
 lang: text('lang').notNull(), variant: text('variant').notNull(), condition: text('condition').notNull(),
 quantity: integer('quantity').notNull(), cost: real('cost').notNull(), metadata: text('metadata').notNull()
}, t=>[index('idx_collection_owner').on(t.owner)]);
export const snapshots = sqliteTable('snapshots', {
 card: text('card').notNull(),lang:text('lang').notNull(),variant:text('variant').notNull(),day:text('day').notNull(),
 price:real('price').notNull(),updated:text('updated').notNull()
}, t=>[primaryKey({columns:[t.card,t.lang,t.variant,t.day]})]);
export const priceCache=sqliteTable('price_cache',{key:text('key').primaryKey(),fetched:text('fetched').notNull(),data:text('data').notNull()});

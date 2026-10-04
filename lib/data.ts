import { env } from 'cloudflare:workers';
import priceIndex from './price-index.json';
export function database(){if(!env.DB)throw Error('Collection storage is temporarily unavailable.');return env.DB;}
export async function remoteCard(lang:string,id:string){
 const r=await fetch(`https://api.tcgdex.net/v2/${lang}/cards/${encodeURIComponent(id)}`,{signal:AbortSignal.timeout(15000)});
 if(!r.ok)throw Error('Card details are temporarily unavailable.');return r.json() as Promise<any>;
}
export function usdVariants(card:any){
 const t=card.pricing?.tcgplayer;
 if(!t||t.unit!=='USD')return [];
 return Object.entries(t).filter(([k,v]:any)=>v && typeof v==='object' && typeof v.marketPrice==='number' && Number.isFinite(v.marketPrice)).map(([name,v]:any)=>({name,price:v.marketPrice,low:v.lowPrice,updated:t.updated,productId:v.productId}));
}
export async function marketPrices(lang:string,id:string){
 const match=(priceIndex as Record<string,{category:number,group:number,products:{id:number,title:string}[]}>)[lang+':'+id];
 if(!match)return null;
 const db=database(),key=match.category+':'+match.group;
 const cached=await db.prepare('SELECT data,fetched FROM price_cache WHERE key=?').bind(key).first<{data:string,fetched:string}>();
 let data:any,updated:string;
 if(cached&&Date.now()-Date.parse(cached.fetched)<86400000){data=JSON.parse(cached.data);updated=cached.fetched}
 else {const headers={'User-Agent':'PokeLedger/1.0 (personal card collection tracker)'};const r=await fetch(`https://tcgcsv.com/tcgplayer/${match.category}/${match.group}/prices`,{headers,signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('Live market prices are temporarily unavailable.');data=await r.json();updated=new Date().toISOString();const timestamp=await fetch('https://tcgcsv.com/last-updated.txt',{headers}).then(r=>r.ok?r.text():null).catch(()=>null);if(timestamp)data.sourceUpdated=timestamp.trim();await db.prepare('INSERT INTO price_cache(key,data,fetched) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET data=excluded.data,fetched=excluded.fetched').bind(key,JSON.stringify(data),updated).run();}
 return match.products.flatMap(p=>data.results.filter((v:any)=>v.productId===p.id&&typeof v.marketPrice==='number').map((v:any)=>({name:v.subTypeName.toLowerCase().replaceAll(' ','-')+(match.products.length>1?'-product-'+p.id:''),label:match.products.length>1?p.title+' · '+v.subTypeName:v.subTypeName,price:v.marketPrice,low:v.lowPrice,updated:data.sourceUpdated||updated,productId:v.productId})));
}
export async function recordPrices(lang:string,id:string,variants:any[]){
 const db=database();const day=new Date().toISOString().slice(0,10);
 const statements=variants.map(v=>db.prepare('INSERT INTO snapshots(card,lang,variant,day,price,updated) VALUES(?,?,?,?,?,?) ON CONFLICT(card,lang,variant,day) DO UPDATE SET price=excluded.price,updated=excluded.updated').bind(id,lang,v.name,day,v.price,v.updated||day));
 if(statements.length)await db.batch(statements);
}

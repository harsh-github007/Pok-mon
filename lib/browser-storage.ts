const COLLECTION='pokeledger.collection.v1';
const HISTORY='pokeledger.history.v1';
export function readCollection<T>():T[]{
 const raw=localStorage.getItem(COLLECTION);if(!raw)return [];const entries=JSON.parse(raw);
 if(!Array.isArray(entries)||!entries.every(e=>e&&typeof e.id==='string'&&typeof e.card==='string'&&['en','ja'].includes(e.lang)&&Number.isInteger(e.quantity)&&e.quantity>0&&Number.isFinite(e.cost)&&e.cost>=0&&e.metadata))throw Error('Saved collection data could not be read.');
 return entries;
}
export function writeCollection(entries:unknown[]){
 try{localStorage.setItem(COLLECTION,JSON.stringify(entries));}catch{throw Error('Your browser could not save this collection. Check storage availability or export a backup.');}
}
export function observePrices(lang:string,id:string,variants:{name:string;price:number;updated?:string}[]){
 const day=new Date().toISOString().slice(0,10),cutoff=new Date(Date.now()-30*86400000).toISOString().slice(0,10);
 const raw=localStorage.getItem(HISTORY),all=raw?JSON.parse(raw):{};
 if(!all||typeof all!=='object'||Array.isArray(all))throw Error('Saved price history could not be read.');
 for(const key of Object.keys(all))all[key]=all[key].filter((h:any)=>h.day>=cutoff);
 const key=lang+':'+id;let history=all[key]||[];
 for(const v of variants){if(!Number.isFinite(v.price))continue;history=history.filter((h:any)=>!(h.variant===v.name&&h.day===day));history.push({variant:v.name,day,price:v.price,updated:v.updated||day});}
 all[key]=history.sort((a:any,b:any)=>a.day.localeCompare(b.day));
 localStorage.setItem(HISTORY,JSON.stringify(all));return all[key];
}

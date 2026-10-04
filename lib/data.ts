import priceIndex from './price-index.json';
const headers={'User-Agent':'PokeLedger/1.0 (personal card collection tracker)'};
export async function remoteCard(lang:string,id:string){
 const r=await fetch(`https://api.tcgdex.net/v2/${lang}/cards/${encodeURIComponent(id)}`,{signal:AbortSignal.timeout(15000),next:{revalidate:86400}});
 if(!r.ok)throw Error('Card details are temporarily unavailable.');return r.json();
}
export function usdVariants(card:any){
 const t=card.pricing?.tcgplayer;if(!t||t.unit!=='USD')return [];
 return Object.entries(t).filter(([,v]:any)=>v&&typeof v==='object'&&Number.isFinite(v.marketPrice)).map(([name,v]:any)=>({name,price:v.marketPrice,low:v.lowPrice,updated:t.updated,productId:v.productId}));
}
export async function marketPrices(lang:string,id:string){
 const match=(priceIndex as Record<string,{category:number;group:number;products:{id:number;title:string}[]}>)[lang+':'+id];
 if(!match)return null;
 const [r,timestamp]=await Promise.all([
  fetch(`https://tcgcsv.com/tcgplayer/${match.category}/${match.group}/prices`,{headers,signal:AbortSignal.timeout(15000),next:{revalidate:86400}}),
  fetch('https://tcgcsv.com/last-updated.txt',{headers,signal:AbortSignal.timeout(15000),next:{revalidate:86400}}).then(r=>r.ok?r.text():null).catch(()=>null)
 ]);
 if(!r.ok)throw Error('Live market prices are temporarily unavailable.');const data=await r.json();
 return match.products.flatMap(p=>data.results.filter((v:any)=>v.productId===p.id&&Number.isFinite(v.marketPrice)).map((v:any)=>({name:v.subTypeName.toLowerCase().replaceAll(' ','-')+(match.products.length>1?'-product-'+p.id:''),label:match.products.length>1?p.title+' · '+v.subTypeName:v.subTypeName,price:v.marketPrice,low:v.lowPrice,updated:timestamp?.trim()||null,productId:v.productId})));
}

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
mkdirSync('public/data', {recursive:true});
const cutoff = new Date().toISOString().slice(0,10);
const sets=[], cards=[], failures=[];
async function get(url){const r=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error(r.status+' '+url);return r.json()}
for(const lang of ['en','ja']) {
 const list=await get(`https://api.tcgdex.net/v2/${lang}/sets`);
 let cursor=0;
 await Promise.all(Array.from({length:4},async()=>{while(cursor<list.length){const s=list[cursor++];try{
 const path=`public/data/set-${lang}-${s.id}.json`;
 const data=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):await get(`https://api.tcgdex.net/v2/${lang}/sets/${encodeURIComponent(s.id)}`);
 writeFileSync(path,JSON.stringify(data));
 if(data.serie?.name==='Pokémon TCG Pocket')continue;
 if(data.releaseDate && data.releaseDate>cutoff)continue;
 const meta={id:s.id,lang,name:data.name,date:data.releaseDate||null,year:data.releaseDate?.slice(0,4)||'Unknown',series:data.serie?.name||'Other',total:data.cards.length};
 sets.push(meta);for(const c of data.cards)cards.push({...c,lang,setId:s.id,setName:meta.name,year:meta.year,date:meta.date,series:meta.series});
 }catch(e){failures.push({lang,id:s.id,error:e.message})}}}));
 console.log(lang,'complete',cards.length);
}
sets.sort((a,b)=>(b.date||'').localeCompare(a.date||''));
cards.sort((a,b)=>(b.date||'').localeCompare(a.date||'')||a.id.localeCompare(b.id,undefined,{numeric:true}));
writeFileSync('public/data/catalog.json',JSON.stringify({asOf:cutoff,source:'TCGdex',sets,cards,failures}));
console.log(JSON.stringify({cards:cards.length,sets:sets.length,failures}));

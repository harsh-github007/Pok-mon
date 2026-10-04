import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
mkdirSync('../../work/prices',{recursive:true});
const catalog=JSON.parse(readFileSync('public/data/catalog.json','utf8'));
const headers={'User-Agent':'PokeLedger/1.0 (personal collection tracker)'};
const sourceUpdated=await fetch('https://tcgcsv.com/last-updated.txt',{headers}).then(r=>{if(!r.ok)throw Error('Price timestamp unavailable');return r.text()});
const cacheRoot='../../work/prices/'+sourceUpdated.trim().replace(/[^0-9A-Za-z]/g,'');
mkdirSync(cacheRoot,{recursive:true});
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
const num=s=>s.split('/')[0].trim().replace(/^0+(?=\d)/,'').toLowerCase();
let matched=0,failures=[];
async function get(path){const file=cacheRoot+'/'+path.replaceAll('/','-')+'.json';if(existsSync(file))return JSON.parse(readFileSync(file));const r=await fetch('https://tcgcsv.com/'+path,{headers,signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error(r.status);const data=await r.json();writeFileSync(file,JSON.stringify(data));await new Promise(r=>setTimeout(r,110));return data}
for(const [lang,category] of [['en',3],['ja',85]]){
 const groups=(await get(`tcgplayer/${category}/groups`)).results;
 for(const set of catalog.sets.filter(s=>s.lang===lang)){
 const candidates=groups.filter(g=>lang==='ja'?norm(g.abbreviation||'')===norm(set.id):norm(g.name.replace(/^[^:]+:\s*/,''))===norm(set.name)||norm(g.name)===norm(set.name));
 if(candidates.length!==1)continue;
 const group=candidates[0];
 try{const products=(await get(`tcgplayer/${category}/${group.groupId}/products`)).results,prices=(await get(`tcgplayer/${category}/${group.groupId}/prices`)).results;
 for(const c of catalog.cards.filter(c=>c.lang===lang&&c.setId===set.id)){
 const ps=products.filter(p=>p.extendedData?.some(e=>e.name==='Number'&&num(e.value)===num(c.localId))&&!p.presaleInfo?.isPresale);
 if(!ps.length)continue;const p=ps[0];
 c.englishName=p.name;c.rarity=p.extendedData.find(e=>e.name==='Rarity')?.value;c.type=p.extendedData.find(e=>e.name==='Card Type')?.value;c.productId=p.productId;c.marketGroup=group.groupId;c.marketCategory=category;c.marketImage=p.imageUrl;
 c.marketProducts=ps.map(p=>({id:p.productId,title:p.name}));
 c.prices=ps.flatMap(p=>prices.filter(v=>v.productId===p.productId&&typeof v.marketPrice==='number').map(v=>({name:v.subTypeName.toLowerCase().replaceAll(' ','-')+(ps.length>1?'-product-'+p.productId:''),label:ps.length>1?p.name+' · '+v.subTypeName:v.subTypeName,price:v.marketPrice,low:v.lowPrice,productId:p.productId,updated:sourceUpdated.trim()})));
 c.marketSet=group.name;if(c.prices.length)matched++;
 }
 }catch(e){failures.push({lang,set:set.id,error:e.message})}
 }
 console.log(lang,'price matches',matched);
}
catalog.priceCoverage={matched,asOf:catalog.asOf,source:'TCGplayer via TCGCSV',failures};
writeFileSync('public/data/catalog.json',JSON.stringify(catalog));
writeFileSync('lib/price-index.json',JSON.stringify(Object.fromEntries(catalog.cards.filter(c=>c.marketGroup).map(c=>[c.lang+':'+c.id,{category:c.marketCategory,group:c.marketGroup,products:c.marketProducts||[{id:c.productId,title:c.englishName}]}]))));
console.log(JSON.stringify(catalog.priceCoverage));
if(existsSync('public/data/species.json'))execFileSync(process.execPath,['scripts/index-pokemon.mjs'],{stdio:'inherit'});

execFileSync(process.execPath,['scripts/index-images.mjs'],{stdio:'inherit'});

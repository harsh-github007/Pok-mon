import {readFileSync,writeFileSync,existsSync} from 'node:fs';
function csv(line){const out=[];let token='',quoted=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){if(quoted&&line[i+1]==='"'){token+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){out.push(token);token='';}else token+=c;}out.push(token);return out;}
let species;
if(existsSync('../../work/pokemon-species-names.csv')){
 const map=new Map();for(const line of readFileSync('../../work/pokemon-species-names.csv','utf8').trim().split(/\r?\n/).slice(1)){const [id,lang,name]=csv(line);if(!['9','11','1'].includes(lang))continue;const item=map.get(id)||{id};item[lang==='9'?'name':lang==='11'?'japanese':'kana']=name;map.set(id,item);}
 species=[...map.values()].filter(s=>s.name).sort((a,b)=>a.name.localeCompare(b.name));
 writeFileSync('public/data/species.json',JSON.stringify(species));
}else species=JSON.parse(readFileSync('public/data/species.json','utf8'));
const normalize=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/♀/g,' female ').replace(/♂/g,' male ').replace(/[^a-z0-9]+/g,' ').trim();
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const english=new Map(species.map(s=>[normalize(s.name),s.id]));
const japanese=new Map(species.flatMap(s=>[s.japanese,s.kana].filter(Boolean).map(n=>[n,s.id])));
const enPattern=new RegExp('\\b('+[...english.keys()].sort((a,b)=>b.length-a.length).map(escape).join('|')+')\\b','g');
const jaPattern=new RegExp([...japanese.keys()].sort((a,b)=>b.length-a.length).map(escape).join('|'),'g');
const catalog=JSON.parse(readFileSync('public/data/catalog.json','utf8'));
let matched=0;for(const c of catalog.cards){const ids=new Set();for(const m of normalize(c.name+' '+(c.englishName||'')).matchAll(enPattern))ids.add(english.get(m[1]));if(c.lang==='ja')for(const m of c.name.matchAll(jaPattern))ids.add(japanese.get(m[0]));c.pokemon=[...ids];if(ids.size)matched++;}
writeFileSync('public/data/catalog.json',JSON.stringify(catalog));console.log(JSON.stringify({species:species.length,matchedCards:matched}));

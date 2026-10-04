import {readFileSync,writeFileSync,existsSync,readdirSync} from 'node:fs';
const catalog=JSON.parse(readFileSync('public/data/catalog.json','utf8'));
const root='../../work/prices/'+readdirSync('../../work/prices').filter(x=>/^\d{8}T/.test(x)).sort().at(-1)+'/';
const norm=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const number=s=>s.split('/')[0].trim().replace(/^0+(?=\d)/,'').toLowerCase();
const aliases={'en:30th-c':24837};
let verified=0,added=0,ambiguous=0;
for(const set of catalog.sets){
 const category=set.lang==='en'?3:85;
 const groups=JSON.parse(readFileSync(root+`tcgplayer-${category}-groups.json`)).results;
 const candidates=groups.filter(g=>aliases[set.lang+':'+set.id]?g.groupId===aliases[set.lang+':'+set.id]:set.lang==='ja'?norm(g.abbreviation||'')===norm(set.id):norm(g.name.replace(/^[^:]+:\s*/,''))===norm(set.name)||norm(g.name)===norm(set.name));
 if(candidates.length!==1)continue;
 const file=root+`tcgplayer-${category}-${candidates[0].groupId}-products.json`;
 if(!existsSync(file))continue;
 const products=JSON.parse(readFileSync(file)).results;
 for(const card of catalog.cards.filter(c=>c.lang===set.lang&&c.setId===set.id)){
  delete card.verifiedImage;
  // Never choose arbitrarily between stamped, alternate, or other product printings.
  const matches=products.filter(p=>!p.presaleInfo?.isPresale&&p.imageUrl&&p.extendedData?.some(e=>e.name==='Number'&&number(e.value)===number(card.localId)));
  if(matches.length!==1){if(matches.length>1)ambiguous++;continue;}
  const product=matches[0];
  if(set.lang==='en'&&norm(product.name.replace(/\s*-\s*\d+.*$/,''))!==norm(card.name))continue;
  card.verifiedImage=product.imageUrl;
  card.imageMatch={source:'TCGplayer via TCGCSV',productId:product.productId,groupId:candidates[0].groupId,language:set.lang,number:card.localId};
  verified++;if(!card.image)added++;
 }
}
catalog.imageCoverage={verifiedAlternate:verified,addedForMissing:added,ambiguousSkipped:ambiguous};
writeFileSync('public/data/catalog.json',JSON.stringify(catalog));
console.log(catalog.imageCoverage);

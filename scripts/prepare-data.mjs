import {existsSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
mkdirSync('lib',{recursive:true});
if(!existsSync('lib/price-index.json'))writeFileSync('lib/price-index.json','{}');
if(!existsSync('public/data/catalog.json')){
 console.log('Importing English and Japanese cards. Internet access is required.');
 execFileSync(process.execPath,['scripts/sync-catalog.mjs'],{stdio:'inherit'});
 execFileSync(process.execPath,['scripts/sync-prices.mjs'],{stdio:'inherit'});
}

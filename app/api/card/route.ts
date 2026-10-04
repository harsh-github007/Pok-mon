import {database,remoteCard,usdVariants,recordPrices,marketPrices} from '../../../lib/data';
export async function GET(req:Request){
 const u=new URL(req.url),lang=u.searchParams.get('lang'),id=u.searchParams.get('id');
 if(!['en','ja'].includes(lang||'')||!id||id.length>100)return Response.json({error:'Invalid card.'},{status:400});
 try {let priceWarning:string|null=null;const [card,market]=await Promise.all([remoteCard(lang!,id).catch(()=>null),marketPrices(lang!,id).catch(()=>{priceWarning='Live market lookup failed. Available alternate quotes are shown.';return null})]);if(!card&&!market)throw Error('Card details and current prices are temporarily unavailable.');const variants=market?.length?market:usdVariants(card||{});let history:any[]=[],storageError=null;
 try{await recordPrices(lang!,id,variants);history=(await database().prepare('SELECT variant,day,price,updated FROM snapshots WHERE card=? AND lang=? AND day>=? ORDER BY day').bind(id,lang,new Date(Date.now()-30*86400000).toISOString().slice(0,10)).all()).results;}catch(e){storageError='Price history is temporarily unavailable.'}
 return Response.json({card,variants,history,storageError,priceWarning});
 }catch(e){return Response.json({error:(e as Error).message},{status:502})}
}

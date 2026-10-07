import {remoteCard,usdVariants,marketPrices} from '../../../lib/data';
export const maxDuration=30;
export async function GET(req:Request){
 const u=new URL(req.url),lang=u.searchParams.get('lang'),id=u.searchParams.get('id');
 if(!['en','ja'].includes(lang||'')||!id||id.length>100)return Response.json({error:'Invalid card.'},{status:400});
 try{let priceWarning:string|null=null;const [card,market]=await Promise.all([remoteCard(lang!,id).catch(()=>null),marketPrices(lang!,id).catch(()=>{priceWarning='Live market lookup failed. Available alternate quotes are shown.';return null;})]);
 if(!card&&!market)throw Error('Card details and current prices are temporarily unavailable.');
 return Response.json({card,variants:market?.length?market:usdVariants(card||{}),priceWarning});
 }catch(e){return Response.json({error:(e as Error).message},{status:502});}
}

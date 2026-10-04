'use client';
import {useState} from 'react';

type ImageCard={name:string;image?:string;verifiedImage?:string};
export default function CardImage({card,high=false}:{card:ImageCard;high?:boolean}){
 const sources=[...(card.image?[card.image+(high?'/high.webp':'/low.webp'),card.image+(high?'/low.webp':'/high.webp'),card.image+'/high.png']:[]),...(card.verifiedImage?[card.verifiedImage]:[])];
 const identity=sources.join('|');
 return <ImageAttempt key={identity} sources={sources} name={card.name}/>;
}
function ImageAttempt({sources,name}:{sources:string[];name:string}){
 const [index,setIndex]=useState(0);
 return index<sources.length?<img loading="lazy" src={sources[index]} alt={name} onError={()=>setIndex(i=>i+1)}/>:<span className="no-image" role="img" aria-label={'Verified image unavailable for '+name}>Exact image unavailable</span>;
}

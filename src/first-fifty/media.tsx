"use client";
import { useEffect, useRef, useState } from 'react';
const recordings: Record<string,string> = {
 'impact': '/first-fifty/videos/orders-2-20.mp4',
 'first-order': '/first-fifty/videos/first-order.mp4',
 'orders-2-20': '/first-fifty/videos/orders-2-20.mp4',
 'orders-20-50': '/first-fifty/videos/orders-20-50.mp4',
};
const labels: Record<string,string> = {
 'impact': 'Delivery partner earnings overview',
 'first-order': 'First order incentive introduction',
 'orders-2-20': 'The 2 to 20 order incentive journey',
 'orders-20-50': 'The 20 to 50 order incentive journey',
};
export default function Media({name,poster,...props}: React.HTMLAttributes<HTMLDivElement> & {name:string;poster:string}) {
 const ref=useRef<HTMLVideoElement>(null);
 const [playing,setPlaying]=useState(false);
 useEffect(()=>{
  const video=ref.current;if(!video)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const observer=new IntersectionObserver(([entry])=>{
   if(entry.isIntersecting&&!reduced.matches)video.play().catch(()=>{});else video.pause();
  },{threshold:.3});
  observer.observe(video);return ()=>observer.disconnect();
 },[]);
 return <div {...props} className={`${props.className??''} media`}>
 {recordings[name] ? <>
  <video ref={ref} muted loop playsInline preload="metadata" poster={poster} aria-label={labels[name]} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}>
   <source src={recordings[name]} type="video/mp4" />
  </video>
  <button className="media-toggle" aria-label={`${playing?'Pause':'Play'} ${labels[name]}`} onClick={()=>{const v=ref.current;if(v){if(v.paused)v.play().catch(()=>{});else v.pause();}}}>{playing?'Ⅱ':'▶'}</button>
 </>:<img src={poster} alt={labels[name]} />}
 </div>;
}

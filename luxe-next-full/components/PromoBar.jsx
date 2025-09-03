'use client';
import { useEffect, useState } from 'react';

export default function PromoBar(){
  const slides = [
    { id: 1, html: <>✨ <strong>GET  OFF YOUR FIRST ORDER WHEN YOU</strong> <a href='/login' style={{color:'#FFD700',textDecoration:'underline'}}>SIGN UP</a>!</> },
    { id: 2, html: <>👜 Handmade Bags</> },
    { id: 3, html: <>📱 Tech Accessories</> },
    { id: 4, html: <>🌟 Custom Collection</> },
  ];
  const [idx,setIdx] = useState(0);
  useEffect(()=> {
    const t = setInterval(()=> setIdx(i => (i+1) % slides.length), 4500);
    return ()=> clearInterval(t);
  },[]);
  return (
    <div className='top-promo'>
      <div style={{display:'flex', width: '100%', transform: 	ranslateX(-%), transition: 'transform .5s ease'}}>
        {slides.map(s => (<div key={s.id} className='slide' style={{minWidth:'100%'}}>{s.html}</div>))}
      </div>
      <div style={{position:'absolute', top:'50%', left:8, transform:'translateY(-50%)'}}><button onClick={()=>setIdx((idx-1+slides.length)%slides.length)} style={{background:'transparent',border:'none',color:'#fff',fontSize:18}}>&#10094;</button></div>
      <div style={{position:'absolute', top:'50%', right:8, transform:'translateY(-50%)'}}><button onClick={()=>setIdx((idx+1)%slides.length)} style={{background:'transparent',border:'none',color:'#fff',fontSize:18}}>&#10095;</button></div>
    </div>
  );
}
import { getVapid } from './_vapid.mjs';
export default async (req)=>{
  if(req.method!=='GET')return new Response('GET only',{status:405});
  const keys=await getVapid();
  return new Response(JSON.stringify({publicKey:keys.publicKey}),{headers:{'content-type':'application/json','cache-control':'no-store'}});
};

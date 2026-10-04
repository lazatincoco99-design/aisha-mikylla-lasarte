import { getStore } from '@netlify/blobs';
import crypto from 'node:crypto';
import webpush from 'web-push';
import { getVapid, store } from './_vapid.mjs';

const json = (data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
const hash = value => crypto.createHash('sha256').update(value).digest('hex');

export default async (req) => {
  if (req.method !== 'POST') return json({error:'POST only'},405);
  await getVapid();
  try {
    const body=await req.json();
    const subscription=body.subscription;
    if (!subscription?.endpoint) return json({error:'Missing push subscription.'},400);
    const userKey='user/'+hash(subscription.endpoint);
    const previous=await store.get(userKey,{type:'json'}) || {};
    const record={subscription,jobs:Array.isArray(body.jobs)?body.jobs:previous.jobs||[],updatedAt:new Date().toISOString()};
    await store.set(userKey,JSON.stringify(record),{metadata:{updatedAt:record.updatedAt}});

    if (body.test) {
      const payload={web_push:8030,notification:{title:'Aisha’s Nursing Hub 🔔',body:'Web Push is working on this iPhone!',icon:'https://aishamikykla.netlify.app/icon-192.png',badge:'https://aishamikykla.netlify.app/icon-192.png',navigate:'https://aishamikykla.netlify.app/',silent:false}};
      await webpush.sendNotification(subscription,JSON.stringify(payload),{TTL:300});
    }
    return json({ok:true,jobCount:record.jobs.length});
  } catch(e) {
    console.error(e);
    return json({error:e?.message||'Push registration failed.'},500);
  }
};

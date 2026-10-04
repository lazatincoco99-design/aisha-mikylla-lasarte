import { getStore } from '@netlify/blobs';
import webpush from 'web-push';
import crypto from 'node:crypto';
import { getVapid, store } from './_vapid.mjs';

const keyFor=sub=>crypto.createHash('sha256').update(sub.endpoint).digest('hex');

export default async () => {
  await getVapid();
  const {blobs}=await store.list({prefix:'user/'});
  const now=Date.now();
  let sent=0,removed=0;
  for(const entry of blobs){
    const record=await store.get(entry.key,{type:'json'});
    if(!record?.subscription)continue;
    const jobs=Array.isArray(record.jobs)?record.jobs:[];
    const due=jobs.filter(j=>j?.notifyAt && Number(j.notifyAt)<=now+30000 && Number(j.notifyAt)>=now-180000);
    if(!due.length)continue;
    let changed=false;
    for(const job of due){
      const payload={web_push:8030,notification:{title:job.title||'Aisha’s Nursing Hub',body:job.body||'You have something scheduled.',icon:'https://aisha-mikylla.netlify.app/icon-192.png',badge:'https://aisha-mikylla.netlify.app/icon-192.png',navigate:'https://aisha-mikylla.netlify.app/',silent:false,tag:'aisha-'+job.id}};
      try{await webpush.sendNotification(record.subscription,JSON.stringify(payload),{TTL:3600});sent++;job.sentAt=new Date().toISOString();changed=true}
      catch(e){
        const status=e?.statusCode;
        console.error('push failed',entry.key,status,e?.message);
        if(status===404||status===410){await store.delete(entry.key);removed=1;changed=false;break}
      }
    }
    if(changed){record.jobs=jobs.filter(j=>!j.sentAt);record.updatedAt=new Date().toISOString();await store.set(entry.key,JSON.stringify(record),{metadata:{updatedAt:record.updatedAt}})}
  }
  return new Response(JSON.stringify({ok:true,sent,removed,checked:blobs.length}),{headers:{'content-type':'application/json'}});
};

export const config={schedule:'* * * * *'};

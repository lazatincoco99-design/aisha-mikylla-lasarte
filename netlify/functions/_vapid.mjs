import { getStore } from '@netlify/blobs';
import webpush from 'web-push';

const store=getStore('aisha-nursing-push');
const SUBJECT='https://aisha-mikylla.netlify.app/';

export async function getVapid(){
  let keys=await store.get('config/vapid',{type:'json'});
  if(!keys?.publicKey||!keys?.privateKey){
    keys=webpush.generateVAPIDKeys();
    await store.set('config/vapid',JSON.stringify(keys));
  }
  webpush.setVapidDetails(SUBJECT,keys.publicKey,keys.privateKey);
  return keys;
}

export {store};

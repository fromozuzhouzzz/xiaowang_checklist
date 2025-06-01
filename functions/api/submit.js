export async function onRequestPost({ request, env }) {
  const { date, shift, completed, by } = await request.json();
  if (!date||!shift||!completed||!by) return new Response('Bad', {status:400});
  const key = `log:${date}`;
  const log = await env.KV.get(key, {type:'json'}) || { open:null, close:null };
  log[shift] = { completed, by, ts:Date.now() };
  await env.KV.put(key, JSON.stringify(log));
  return Response.json({ok:true});
} 
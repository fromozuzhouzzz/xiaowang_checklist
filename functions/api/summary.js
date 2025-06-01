export async function onRequestGet({ query, env }) {
  const month = query.get('month'); // YYYY-MM
  if (!month) return new Response('Need month', {status:400});
  const list = await env.KV.list({ prefix:'log:'+month });
  const res = {};
  for (const { name } of list.keys) {
    const date = name.split(':')[1];
    const log = await env.KV.get(name, {type:'json'});
    res[date] = {
      open: log.open && log.open.completed.length===3, // 3 為任務總數，可動態
      close: log.close && log.close.completed.length===3
    };
  }
  return Response.json(res);
} 
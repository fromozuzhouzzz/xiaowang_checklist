export async function onRequestGet({ env, query }) {
  const shift = query.get('shift');
  if (!['open','close'].includes(shift)) return new Response('Bad shift', {status:400});
  const tasksKey = `tasks:${shift}`;
  let tasks = await env.KV.get(tasksKey, { type:'json' });
  if (!tasks) {
    // 首次初始化：從前端 tasks.js 內容複製過來
    tasks = shift==='open' ? [
      { id:1,title:'打開招牌燈' },
      { id:2,title:'檢查大門安全' },
      { id:3,title:'啟動收銀系統' }
    ] : [
      { id:1,title:'關閉招牌燈' },
      { id:2,title:'門窗上鎖' },
      { id:3,title:'收銀結算備份' }
    ];
    await env.KV.put(tasksKey, JSON.stringify(tasks));
  }
  return Response.json(tasks);
} 
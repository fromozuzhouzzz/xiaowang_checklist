export async function onRequestGet({ env, query }) {
  const shift = query.get('shift');
  if (!['open','close'].includes(shift)) return new Response('Bad shift', {status:400});
  const tasksKey = `tasks:${shift}`;
  let tasks = await env.KV.get(tasksKey, { type:'json' });
  if (!tasks) {
    // 首次初始化：从前端 tasks.js 内容复制过来
    tasks = shift==='open' ? [
      { id:1,title:'打开招牌灯' },
      { id:2,title:'检查大门安全' },
      { id:3,title:'启动收银系统' }
    ] : [
      { id:1,title:'关闭招牌灯' },
      { id:2,title:'门窗上锁' },
      { id:3,title:'收银结算备份' }
    ];
    await env.KV.put(tasksKey, JSON.stringify(tasks));
  }
  return Response.json(tasks);
} 
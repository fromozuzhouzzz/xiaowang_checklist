export async function onRequestGet({ query, env }) {
  const month = query.get('month'); // YYYY-MM
  if (!month) return new Response('Need month', {status:400});
  
  // 獲取任務數量（動態）
  const openTasks = await env.KV.get('tasks:open', { type:'json' });
  const closeTasks = await env.KV.get('tasks:close', { type:'json' });
  const openTaskCount = openTasks ? openTasks.length : 3;
  const closeTaskCount = closeTasks ? closeTasks.length : 3;
  
  // 獲取該月份的所有記錄
  const list = await env.KV.list({ prefix:'log:'+month });
  const res = {};
  
  // 為該月份的每一天生成數據結構
  const year = parseInt(month.split('-')[0]);
  const monthNum = parseInt(month.split('-')[1]);
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  
  // 初始化該月份所有日期
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${month}-${day.toString().padStart(2, '0')}`;
    res[date] = {
      open: false,
      close: false
    };
  }
  
  // 更新有記錄的日期
  for (const { name } of list.keys) {
    const date = name.split(':')[1];
    const log = await env.KV.get(name, {type:'json'});
    if (log) {
      res[date] = {
        open: log.open && log.open.completed && log.open.completed.length === openTaskCount,
        close: log.close && log.close.completed && log.close.completed.length === closeTaskCount
      };
    }
  }
  
  return Response.json(res);
} 
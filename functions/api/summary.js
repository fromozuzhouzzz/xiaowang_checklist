export async function onRequestGet({ query, env }) {
  try {
    const month = query.get('month'); // YYYY-MM
    if (!month) return new Response('Need month', {status:400});
    
    // Get task counts dynamically
    let openTaskCount = 3;
    let closeTaskCount = 3;
    
    try {
      const openTasks = await env.KV.get('tasks:open', { type:'json' });
      const closeTasks = await env.KV.get('tasks:close', { type:'json' });
      if (openTasks) openTaskCount = openTasks.length;
      if (closeTasks) closeTaskCount = closeTasks.length;
    } catch (e) {
      console.log('Failed to get task counts, using default:', e);
    }
    
    // Get all records for this month
    const list = await env.KV.list({ prefix:'log:'+month });
    const res = {};
    
    // Generate data structure for each day of the month
    const [year, monthNum] = month.split('-').map(Number);
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    
    // Initialize all dates for the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${month}-${day.toString().padStart(2, '0')}`;
      res[date] = {
        open: false,
        close: false
      };
    }
    
    // Update dates with records
    for (const { name } of list.keys) {
      try {
        const date = name.split(':')[1];
        const log = await env.KV.get(name, {type:'json'});
        if (log && res[date]) {
          res[date] = {
            open: log.open && log.open.completed && log.open.completed.length === openTaskCount,
            close: log.close && log.close.completed && log.close.completed.length === closeTaskCount
          };
        }
      } catch (e) {
        console.log('Failed to process record:', name, e);
      }
    }
    
    return Response.json(res);
  } catch (error) {
    console.error('Summary API error:', error);
    return new Response('Internal Server Error: ' + error.message, {status:500});
  }
} 
export async function onRequestGet({ query, env }) {
  try {
    // Check if KV is properly bound
    if (!env.KV) {
      return new Response('KV storage not configured. Please check KV bindings in Cloudflare Pages settings.', {status:500});
    }

    const month = query.get('month'); // YYYY-MM
    if (!month) return new Response('Need month parameter', {status:400});
    
    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return new Response('Invalid month format. Use YYYY-MM', {status:400});
    }
    
    // Get task counts dynamically
    let openTaskCount = 3;
    let closeTaskCount = 3;
    
    try {
      const openTasks = await env.KV.get('tasks:open', { type:'json' });
      const closeTasks = await env.KV.get('tasks:close', { type:'json' });
      if (openTasks && Array.isArray(openTasks)) openTaskCount = openTasks.length;
      if (closeTasks && Array.isArray(closeTasks)) closeTaskCount = closeTasks.length;
    } catch (e) {
      console.log('Failed to get task counts, using default:', e);
    }
    
    // Get all records for this month
    const list = await env.KV.list({ prefix:'log:'+month });
    const res = {};
    
    // Generate data structure for each day of the month
    const [year, monthNum] = month.split('-').map(Number);
    
    // Validate year and month
    if (year < 2020 || year > 2050 || monthNum < 1 || monthNum > 12) {
      return new Response('Invalid year or month', {status:400});
    }
    
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
    if (list.keys && list.keys.length > 0) {
      for (const { name } of list.keys) {
        try {
          const date = name.split(':')[1];
          if (res[date]) {
            const log = await env.KV.get(name, {type:'json'});
            if (log) {
              res[date] = {
                open: !!(log.open && log.open.completed && log.open.completed.length === openTaskCount),
                close: !!(log.close && log.close.completed && log.close.completed.length === closeTaskCount)
              };
            }
          }
        } catch (e) {
          console.log('Failed to process record:', name, e);
        }
      }
    }
    
    return Response.json(res);
  } catch (error) {
    console.error('Summary API error:', error);
    return new Response('Internal Server Error: ' + error.message, {status:500});
  }
} 
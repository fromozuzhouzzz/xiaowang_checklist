export async function onRequestGet({ request, env }) {
  try {
    console.log('Summary API called');
    
    // Check if KV is properly bound
    if (!env.KV) {
      console.error('KV storage not bound to environment');
      return new Response('KV storage not configured. Please check KV bindings in Cloudflare Pages settings.', {status:500});
    }

    // Get month parameter from URL
    const url = new URL(request.url);
    const month = url.searchParams.get('month');
    console.log('Requested month:', month);
    
    if (!month) {
      console.error('No month parameter provided');
      return new Response('Need month parameter', {status:400});
    }
    
    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(month)) {
      console.error('Invalid month format:', month);
      return new Response('Invalid month format. Use YYYY-MM', {status:400});
    }
    
    // Get task counts dynamically
    let openTaskCount = 3;
    let closeTaskCount = 3;
    
    try {
      console.log('Fetching task counts from KV...');
      const openTasks = await env.KV.get('tasks:open', { type:'json' });
      const closeTasks = await env.KV.get('tasks:close', { type:'json' });
      console.log('Open tasks:', openTasks);
      console.log('Close tasks:', closeTasks);
      
      if (openTasks && Array.isArray(openTasks)) openTaskCount = openTasks.length;
      if (closeTasks && Array.isArray(closeTasks)) closeTaskCount = closeTasks.length;
    } catch (e) {
      console.log('Failed to get task counts, using default:', e);
    }
    
    console.log('Task counts - open:', openTaskCount, 'close:', closeTaskCount);
    
    // Get all records for this month
    console.log('Listing KV records for prefix:', 'log:'+month);
    const list = await env.KV.list({ prefix:'log:'+month });
    console.log('KV list result:', list);
    
    const res = {};
    
    // Generate data structure for each day of the month
    const [year, monthNum] = month.split('-').map(Number);
    console.log('Parsed year:', year, 'month:', monthNum);
    
    // Validate year and month
    if (year < 2024 || year > 2050 || monthNum < 1 || monthNum > 12) {
      console.error('Invalid year or month - year:', year, 'month:', monthNum);
      return new Response('Invalid year or month', {status:400});
    }
    
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    console.log('Days in month:', daysInMonth);
    
    // Initialize all dates for the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${month}-${day.toString().padStart(2, '0')}`;
      res[date] = {
        open: false,
        close: false
      };
    }
    
    console.log('Initialized dates:', Object.keys(res).length);
    
    // Update dates with records
    if (list.keys && list.keys.length > 0) {
      console.log('Processing', list.keys.length, 'records');
      for (const { name } of list.keys) {
        try {
          const date = name.split(':')[1];
          if (res[date]) {
            const log = await env.KV.get(name, {type:'json'});
            if (log) {
              res[date] = {
                open: !!(log.open && log.open.completed && log.open.completed.length === openTaskCount),
                close: !!(log.close && log.close.completed && log.close.completed.length === closeTaskCount),
                openSubmitter: log.open ? log.open.by : null,
                openSubmitTime: log.open ? (log.open.submitTime || '未知时间') : null,
                closeSubmitter: log.close ? log.close.by : null,
                closeSubmitTime: log.close ? (log.close.submitTime || '未知时间') : null
              };
            }
          }
        } catch (e) {
          console.log('Failed to process record:', name, e);
        }
      }
    } else {
      console.log('No records found for this month');
    }
    
    console.log('Final result:', res);
    return Response.json(res);
  } catch (error) {
    console.error('Summary API error:', error);
    console.error('Error stack:', error.stack);
    return new Response('Internal Server Error: ' + error.message, {status:500});
  }
} 
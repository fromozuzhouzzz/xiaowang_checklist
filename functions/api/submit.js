export async function onRequestPost({ request, env }) {
  try {
    const { date, shift, completed, by } = await request.json();
    console.log('Received submission:', { date, shift, completed, by });
    
    // Add current timestamp
    const submitTime = new Date().toISOString();
    console.log('Submit time:', submitTime);
    
    const key = `log:${date}`;
    
    // Get existing log or create new one
    let log = await env.KV.get(key, { type: 'json' }) || {};
    
    // Update the specific shift data with submitter and time info
    log[shift] = { 
      completed, 
      by,
      submitTime 
    };
    
    await env.KV.put(key, JSON.stringify(log));
    console.log('Saved log:', log);
    
    return new Response('OK');
  } catch (error) {
    console.error('Submit error:', error);
    return new Response('Error: ' + error.message, { status: 500 });
  }
} 
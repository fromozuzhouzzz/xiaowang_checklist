export async function onRequestPost({ request, env }) {
  try {
    // 验证用户认证
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: '未提供有效的认证token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const token = authHeader.substring(7);
    const sessionKey = `session:${token}`;
    const sessionData = await env.KV.get(sessionKey);
    
    if (!sessionData) {
      return new Response(JSON.stringify({ error: '会话已过期，请重新登录' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const session = JSON.parse(sessionData);
    const { date, shift, completed } = await request.json();
    
    // 使用会话中的真实姓名，而不是客户端提供的姓名
    const by = session.realName;
    
    console.log('Received submission:', { date, shift, completed, by, username: session.username });
    
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
      submitTime,
      username: session.username  // 记录用户名用于追踪
    };
    
    await env.KV.put(key, JSON.stringify(log));
    console.log('Saved log:', log);
    
    return new Response(JSON.stringify({ success: true, message: '提交成功' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Submit error:', error);
    return new Response(JSON.stringify({ error: '提交失败: ' + error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 
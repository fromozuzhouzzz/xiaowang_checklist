export async function onRequestGet({ request, env }) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: '未提供有效的认证token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const sessionKey = `session:${token}`;
    const sessionData = await env.KV.get(sessionKey);
    
    if (!sessionData) {
      return new Response(JSON.stringify({ error: '会话已过期，请重新登录' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const session = JSON.parse(sessionData);
    
    return new Response(JSON.stringify({
      success: true,
      user: {
        username: session.username,
        realName: session.realName
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Auth verification error:', error);
    return new Response(JSON.stringify({ error: '认证验证失败: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost({ request, env }) {
  // Logout functionality
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: '未提供有效的认证token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const token = authHeader.substring(7);
    const sessionKey = `session:${token}`;
    
    // 删除会话
    await env.KV.delete(sessionKey);
    
    return new Response(JSON.stringify({
      success: true,
      message: '已退出登录'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({ error: '退出登录失败: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 
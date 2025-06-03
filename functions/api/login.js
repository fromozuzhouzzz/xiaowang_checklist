export async function onRequestPost({ request, env }) {
  try {
    const { username, password } = await request.json();
    
    // 验证输入
    if (!username || !password) {
      return new Response(JSON.stringify({ error: '用户名和密码都是必填项' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 查找用户
    const userKey = `user:${username}`;
    const userData = await env.KV.get(userKey);
    
    if (!userData) {
      return new Response(JSON.stringify({ error: '用户不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const user = JSON.parse(userData);
    
    // 验证密码
    if (user.password !== password) {
      return new Response(JSON.stringify({ error: '密码错误' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 生成简单的token (在生产环境中应该使用JWT)
    const token = btoa(`${username}:${Date.now()}`);
    
    // 存储会话
    const sessionKey = `session:${token}`;
    const session = {
      username: user.username,
      realName: user.realName,
      loginTime: new Date().toISOString()
    };
    
    // 设置会话有效期为7天
    await env.KV.put(sessionKey, JSON.stringify(session), { expirationTtl: 7 * 24 * 60 * 60 });
    
    console.log('User logged in:', { username: user.username, realName: user.realName });
    
    return new Response(JSON.stringify({
      success: true,
      message: '登录成功',
      token,
      user: {
        username: user.username,
        realName: user.realName
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: '登录失败: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 
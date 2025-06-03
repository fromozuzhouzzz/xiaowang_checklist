export async function onRequestPost({ request, env }) {
  try {
    const { username, password, realName } = await request.json();
    
    // 验证输入
    if (!username || !password || !realName) {
      return new Response(JSON.stringify({ error: '用户名、密码和真实姓名都是必填项' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (username.length < 3) {
      return new Response(JSON.stringify({ error: '用户名至少需要3个字符' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: '密码至少需要6个字符' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 检查用户是否已存在
    const userKey = `user:${username}`;
    const existingUser = await env.KV.get(userKey);
    
    if (existingUser) {
      return new Response(JSON.stringify({ error: '用户名已存在' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 创建用户
    const user = {
      username,
      password, // 在生产环境中应该加密密码
      realName,
      createdAt: new Date().toISOString()
    };
    
    await env.KV.put(userKey, JSON.stringify(user));
    console.log('User registered:', { username, realName });
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: '注册成功',
      user: { username, realName }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: '注册失败: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 
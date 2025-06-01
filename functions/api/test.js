export async function onRequestGet({ env }) {
  try {
    // Test KV binding
    if (!env.KV) {
      return new Response('KV not bound', { status: 500 });
    }
    
    // Test KV operations
    await env.KV.put('test-key', 'test-value');
    const value = await env.KV.get('test-key');
    
    return Response.json({
      status: 'success',
      kv_bound: true,
      test_value: value,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
} 
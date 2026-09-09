export {};

import https from 'https';

function requestApi(url: string): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode || 0, body: parsed });
        } catch {
          resolve({ status: res.statusCode || 0, body: data });
        }
      });
    }).on('error', reject);
  });
}

describe('API Integration Test - JSONPlaceholder', () => {
  const BASE_URL = 'https://jsonplaceholder.typicode.com';

  test('GET /posts - deve retornar status 200 e lista de postagens', async () => {
    const response = await requestApi(`${BASE_URL}/posts?_limit=5`);

    // Valida status e formato
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(5);

    // Valida o contrato (schema) do primeiro objeto
    const post = response.body[0];
    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
    expect(typeof post.title).toBe('string');
  });

  test('GET /posts/999999 - deve retornar status 404 para item inexistente', async () => {
    const response = await requestApi(`${BASE_URL}/posts/999999`);

    expect(response.status).toBe(404);
  });
});

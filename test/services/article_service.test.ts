export {}; // Garante que o TypeScript trata este arquivo como um módulo

// --- 1. Definição do Tipo e do Mock ---
interface IArticleInput {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

class ArticleServiceMock {
  async createArticle(data: IArticleInput) {
    if (!data.title || data.title.trim() === '') {
      return { success: false, error: 'Title cannot be empty' };
    }
    if (data.body.length < 10) {
      return { success: false, error: 'Body must have at least 10 characters' };
    }
    return {
      success: true,
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString()
    };
  }
}

// --- 2. O Teste Unitário com Jest ---
describe('ArticleService - Validação de Formulário', () => {
  const service = new ArticleServiceMock();

  test('deve criar o artigo com sucesso quando dados forem válidos', async () => {
    const input = {
      title: 'Como Testar com Jest',
      description: 'Um guia prático de QA',
      body: 'Este é o corpo do artigo com mais de dez caracteres.',
    };

    const result = await service.createArticle(input);

    expect(result.success).toBe(true);
    expect(result.slug).toBe('como-testar-com-jest');
  });

  test('deve falhar se o título for vazio', async () => {
    const input = {
      title: '',
      description: 'Sem título',
      body: 'Texto válido com tamanho suficiente',
    };

    const result = await service.createArticle(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Title cannot be empty');
  });
});

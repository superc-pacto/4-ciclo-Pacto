exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ sucesso: false, erro: 'Método não permitido.' }) };
  }

  const scriptUrl = process.env.APPS_SCRIPT_URL;
  const apiToken = process.env.PACTO_API_TOKEN;

  if (!scriptUrl || !apiToken) {
    return {
      statusCode: 500,
      body: JSON.stringify({ sucesso: false, erro: 'Variáveis de ambiente não configuradas no Netlify.' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const payload = { ...body, token: apiToken };

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });

    const text = await response.text();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: text
    };
  } catch (erro) {
    return {
      statusCode: 500,
      body: JSON.stringify({ sucesso: false, erro: 'Falha ao conectar com a planilha: ' + erro.message })
    };
  }
};

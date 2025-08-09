const MarkdownIt = require('markdown-it');

// Inicializar o conversor Markdown com suporte completo a tabelas
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
// Habilitar explicitamente tabelas e outros recursos GFM
.enable(['table', 'strikethrough']);

// Função para converter markdown simples para HTML
const convertToHtml = (markdown) => {
  return md.render(markdown);
};

// Função para gerar HTML completo com CSS
const convertToFullHtml = (markdown, title = 'Documento') => {
  const content = md.render(markdown);
  
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #2c3e50;
        }
        h1 {
            border-bottom: 2px solid #eaecef;
            padding-bottom: 0.5rem;
        }
        code {
            background-color: #f6f8fa;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background-color: #f6f8fa;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
        }
        blockquote {
            border-left: 4px solid #dfe2e5;
            padding-left: 1rem;
            margin-left: 0;
            color: #6a737d;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        th, td {
            border: 1px solid #dfe2e5;
            padding: 0.5rem 1rem;
            text-align: left;
        }
        th {
            background-color: #f6f8fa;
            font-weight: bold;
        }
        a {
            color: #0366d6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
};

// Função para gerar HTML otimizado para PDF
const convertToPdfHtml = (markdown, title = 'Documento') => {
  const content = md.render(markdown);
  
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @page {
            margin: 2cm;
            size: A4;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
            max-width: none;
            margin: 0;
            padding: 0;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5rem;
            margin-bottom: 0.8rem;
            color: #2c3e50;
            page-break-after: avoid;
        }
        h1 {
            border-bottom: 2px solid #eaecef;
            padding-bottom: 0.5rem;
            font-size: 2em;
        }
        h2 {
            font-size: 1.5em;
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3em;
        }
        h3 { font-size: 1.3em; }
        h4 { font-size: 1.1em; }
        p {
            margin-bottom: 1rem;
            orphans: 3;
            widows: 3;
        }
        code {
            background-color: #f6f8fa;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        pre {
            background-color: #f6f8fa;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
            page-break-inside: avoid;
            font-size: 0.85em;
        }
        pre code {
            background-color: transparent;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid #dfe2e5;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #6a737d;
            page-break-inside: avoid;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
            page-break-inside: avoid;
        }
        th, td {
            border: 1px solid #dfe2e5;
            padding: 0.5rem 1rem;
            text-align: left;
        }
        th {
            background-color: #f6f8fa;
            font-weight: bold;
        }
        tr {
            page-break-inside: avoid;
        }
        ul, ol {
            margin: 0 0 1rem 0;
            padding-left: 2em;
        }
        li {
            margin: 0.25em 0;
            page-break-inside: avoid;
        }
        a {
            color: #0366d6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        img {
            max-width: 100%;
            height: auto;
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
};

module.exports = {
  convertToHtml,
  convertToFullHtml,
  convertToPdfHtml
};

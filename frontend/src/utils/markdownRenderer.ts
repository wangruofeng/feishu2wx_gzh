import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// 创建一个临时的 MarkdownIt 实例用于 escapeHtml
const tempMd = new MarkdownIt();

// 创建 highlight 函数（避免循环引用）
function createHighlightFunction() {
  return function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value;
        return `<div class="code-block-wrapper"><div class="code-block-header"><span class="code-block-lang">${lang.toUpperCase()}</span></div><pre class="hljs"><code>${highlighted}</code></pre></div>`;
      } catch (__) {
        // 如果高亮失败，使用转义后的文本
      }
    }
    // 使用临时实例的 escapeHtml 方法
    const escaped = tempMd.utils.escapeHtml(str);
    return `<div class="code-block-wrapper"><div class="code-block-header"><span class="code-block-lang">CODE</span></div><pre class="hljs"><code>${escaped}</code></pre></div>`;
  };
}

// 创建 MarkdownIt 实例
const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: createHighlightFunction(),
});

// 配置链接在新窗口打开
const defaultRender = md.renderer.rules.link_open || function(tokens: any, idx: number, options: any, env: any, self: any) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens: any, idx: number, options: any, env: any, self: any) {
  const aIndex = tokens[idx].attrIndex('target');
  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']);
  } else {
    tokens[idx].attrs![aIndex][1] = '_blank';
  }
  return defaultRender(tokens, idx, options, env, self);
};

// 自定义分割线渲染
md.renderer.rules.hr = function (tokens: any, idx: number, options: any, env: any, self: any) {
  return '<hr class="custom-hr">';
};

export function renderMarkdown(markdown: string): string {
  return md.render(markdown);
}

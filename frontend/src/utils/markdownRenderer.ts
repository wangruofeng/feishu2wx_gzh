import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// 创建一个临时的 MarkdownIt 实例用于 escapeHtml
const tempMd = new MarkdownIt();

// 创建 highlight 函数（避免循环引用）
function createHighlightFunction() {
  return function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(str, { language: lang }).value +
               '</code></pre>';
      } catch (__) {
        // 如果高亮失败，使用转义后的文本
      }
    }
    // 使用临时实例的 escapeHtml 方法
    return '<pre class="hljs"><code>' + tempMd.utils.escapeHtml(str) + '</code></pre>';
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

export function renderMarkdown(markdown: string): string {
  return md.render(markdown);
}

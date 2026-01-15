import React, { useRef, useCallback } from 'react';
import { convertHtmlToMarkdown } from '../utils/htmlToMarkdown';
import './EditorPane.css';

interface Props {
  markdown: string;
  setMarkdown: (md: string) => void;
}

const EditorPane: React.FC<Props> = ({ markdown, setMarkdown }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 处理粘贴事件
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const htmlData = e.clipboardData.getData('text/html');
    const textData = e.clipboardData.getData('text/plain');
    
    // 如果有HTML数据（比如从飞书复制），转换为Markdown
    if (htmlData && htmlData.trim()) {
      e.preventDefault();
      const md = convertHtmlToMarkdown(htmlData);
      
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newMd = markdown.slice(0, start) + md + markdown.slice(end);
        setMarkdown(newMd);
        
        // 恢复光标位置
        setTimeout(() => {
          const newPos = start + md.length;
          textarea.setSelectionRange(newPos, newPos);
          textarea.focus();
        }, 0);
      }
    } else if (textData) {
      // 纯文本直接插入
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newMd = markdown.slice(0, start) + textData + markdown.slice(end);
        setMarkdown(newMd);
      }
    }
  }, [markdown, setMarkdown]);


  // 插入Markdown语法
  const insertMarkdown = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.slice(start, end);
    const replacement = before + selectedText + after;
    const newMd = markdown.slice(0, start) + replacement + markdown.slice(end);
    setMarkdown(newMd);

    setTimeout(() => {
      const newStart = start + before.length;
      const newEnd = newStart + selectedText.length;
      textarea.setSelectionRange(newStart, newEnd);
      textarea.focus();
    }, 0);
  }, [markdown, setMarkdown]);

  return (
    <div className="editor-pane">
      <div className="editor-header">
        <h2>Markdown 源码</h2>
      </div>

      <div className="editor-container">
        <textarea
          ref={textareaRef}
          className="markdown-editor"
          value={markdown}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMarkdown(e.target.value)}
          onPaste={handlePaste}
          placeholder="请粘贴飞书文档内容或直接编写 Markdown...&#10;&#10;提示：&#10;• 从飞书文档复制内容后直接粘贴即可自动转换&#10;• 支持常见 Markdown 语法&#10;• 图片请使用 Markdown 格式：![描述](图片URL)"
          spellCheck={false}
        />
      </div>

      <div className="editor-toolbar">
        <button onClick={() => insertMarkdown('# ', '')} title="标题1">H1</button>
        <button onClick={() => insertMarkdown('## ', '')} title="标题2">H2</button>
        <button onClick={() => insertMarkdown('### ', '')} title="标题3">H3</button>
        <div className="toolbar-divider" />
        <button onClick={() => insertMarkdown('**', '**')} title="粗体">B</button>
        <button onClick={() => insertMarkdown('*', '*')} title="斜体">I</button>
        <button onClick={() => insertMarkdown('`', '`')} title="行内代码">Code</button>
        <div className="toolbar-divider" />
        <button onClick={() => insertMarkdown('- ', '')} title="无序列表">• List</button>
        <button onClick={() => insertMarkdown('1. ', '')} title="有序列表">1. List</button>
        <button onClick={() => insertMarkdown('> ', '')} title="引用">Quote</button>
        <div className="toolbar-divider" />
        <button onClick={() => insertMarkdown('[链接文本](', ')')} title="链接">Link</button>
        <button onClick={() => insertMarkdown('![图片描述](', ')')} title="图片">Image</button>
      </div>
    </div>
  );
};

export default EditorPane;

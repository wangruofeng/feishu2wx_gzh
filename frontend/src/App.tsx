import React, { useState, useEffect, useCallback } from 'react';
import EditorPane from './components/EditorPane';
import PreviewPane from './components/PreviewPane';
import ThemeSwitcher from './components/ThemeSwitcher';
import DevicePreviewToggle from './components/DevicePreviewToggle';
import Toolbar from './components/Toolbar';
import { renderMarkdown } from './utils/markdownRenderer';
import { copyHtmlToWeChat } from './utils/wechatCopy';
import './App.css';
import './styles/themes.css';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [html, setHtml] = useState<string>('');
  const [theme, setTheme] = useState<string>('green');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isCopying, setIsCopying] = useState<boolean>(false);

  // 实时渲染 markdown → html
  useEffect(() => {
    const rendered = renderMarkdown(markdown);
    setHtml(rendered);
  }, [markdown]);

  // 一键复制到微信公众号
  const handleCopyToWeChat = useCallback(async () => {
    if (!html.trim()) {
      alert('请先输入或粘贴内容');
      return;
    }

    setIsCopying(true);
    try {
      const result = await copyHtmlToWeChat(html, theme);
      alert(result.message);
    } catch (error) {
      console.error('复制失败:', error);
      alert('❌ 复制失败。\n\n请手动选择右侧预览区域的内容，按 Ctrl+C (Windows) 或 Cmd+C (Mac) 复制，然后粘贴到微信公众号编辑器。');
    } finally {
      setIsCopying(false);
    }
  }, [html, theme]);

  return (
    <div className={`app theme-${theme}`}>
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">📝</span>
            飞书文档 → 微信公众号排版器
          </h1>
          <div className="header-controls">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
            <DevicePreviewToggle device={device} setDevice={setDevice} />
          </div>
        </div>
      </header>

      <main className={`main-container device-${device}`}>
        <EditorPane markdown={markdown} setMarkdown={setMarkdown} />
        <PreviewPane html={html} device={device} />
      </main>

      <footer className="app-footer">
        <Toolbar 
          markdown={markdown} 
          setMarkdown={setMarkdown}
          onCopyToWeChat={handleCopyToWeChat}
          isCopying={isCopying}
        />
      </footer>
    </div>
  );
};

export default App;

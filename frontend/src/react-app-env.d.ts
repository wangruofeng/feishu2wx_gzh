/// <reference types="react-scripts" />

// ClipboardItem 类型定义（用于复制富文本）
interface ClipboardItem {
  readonly types: readonly string[];
  getType(type: string): Promise<Blob>;
}

interface ClipboardItemConstructor {
  new (items: { [mimeType: string]: Blob }): ClipboardItem;
}

declare var ClipboardItem: ClipboardItemConstructor;

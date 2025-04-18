'use client';

import './editor.css';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { CodeNode } from '@lexical/code';
import { TableNode } from '@lexical/table';
import { ImageNode } from './nodes/ImageNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $insertNodes } from 'lexical';
import { useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { $generateNodesFromDOM } from '@lexical/html';

import ToolbarPlugin from './plugins/ToolbarPlugin';
import ImagePlugin from './plugins/ImagePlugin';

interface LexicalEditorProps {
  initialContent?: string;
  onChange?: (html: string) => void;
  className?: string;
}

function Placeholder() {
  return <div className="editor-placeholder">Введите текст...</div>;
}

function EditorErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<div className="error">Что-то пошло не так...</div>}
      onError={(error) => console.error(error)}
    >
      {children}
    </ErrorBoundary>
  );
}

export function LexicalEditor({ initialContent = '', onChange, className = '' }: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'MyEditor',
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      LinkNode,
      CodeNode,
      TableNode,
      QuoteNode,
      ImageNode,
    ],
    theme: {
      root: 'prose max-w-none min-h-[200px] p-4 focus:outline-none w-full block',
      link: 'cursor-pointer text-blue-500 hover:text-blue-700 underline',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        underlineStrikethrough: 'underline line-through',
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      heading: {
        h1: 'text-4xl font-bold mt-6 mb-4 pb-2 border-b',
        h2: 'text-3xl font-bold mt-5 mb-3',
        h3: 'text-2xl font-bold mt-4 mb-2',
        h4: 'text-xl font-bold mt-3 mb-2',
        h5: 'text-lg font-bold mt-2 mb-1',
        h6: 'text-base font-bold mt-2 mb-1',
      },
      list: {
        ul: 'list-disc list-outside pl-[2.5em] my-4',
        ol: 'list-decimal list-outside pl-[2.5em] my-4',
        listitem: 'pl-[0.5em] mb-1',
        nested: {
          listitem: 'pl-[0.5em]'
        },
        olDepth: [
          'list-decimal',
          'list-[lower-alpha]',
          'list-[lower-roman]'
        ]
      },
      paragraph: 'mb-4',
      image: 'max-w-full h-auto my-4',
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div style={{ width: '100%', display: 'block' }} className={`editor-container border rounded-lg ${className}`}>
        <ToolbarPlugin />
        <div style={{ width: '100%', display: 'block' }}>
          <RichTextPlugin
            contentEditable={<ContentEditable style={{ width: '100%', display: 'block' }} className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={EditorErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <ImagePlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={onChange} />
          <InitialContentPlugin content={initialContent} />
        </div>
      </div>
    </LexicalComposer>
  );
}

function OnChangePlugin({ onChange }: { onChange?: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();
  const lastContentRef = useRef<string>('');

  useEffect(() => {
    if (!onChange) return;

    return editor.registerUpdateListener(({ editorState }) => {

      editorState.read(() => {
        const currentContent = JSON.stringify(editor.getEditorState().toJSON());
        
        // Only trigger onChange if the content actually changed
        if (currentContent !== lastContentRef.current) {
          lastContentRef.current = currentContent;
          onChange(currentContent);
        }
      });
    });
  }, [editor, onChange]);

  return null;
}

function InitialContentPlugin({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    editor.update(() => {
      try {
        const parsedContent = JSON.parse(content);
        const editorState = editor.parseEditorState(parsedContent);
        editor.setEditorState(editorState);
      } catch {
        // If content is not valid JSON (e.g., plain HTML), create new content
        const parser = new DOMParser();
        const decodedHtml = content
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&');
        const dom = parser.parseFromString(decodedHtml, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        
        $getRoot().select();
        $insertNodes(nodes);
      }
    });
  }, [editor, content]);

  return null;
}
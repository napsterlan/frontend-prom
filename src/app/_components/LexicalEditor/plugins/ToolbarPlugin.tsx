'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
} from 'lexical';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatHeading = (tag: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        nodes.forEach((node) => {
          if ($isHeadingNode(node)) {
            node.replace($createParagraphNode());
          } else {
            node.replace($createHeadingNode(tag));
          }
        });
      }
    });
  };

  return (
    <div className="border-b p-2 mb-4 flex flex-wrap gap-2">
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
      >
        Жирный
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
      >
        Курсив
      </button>
      <button
        onClick={() => formatHeading('h2')}
        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
      >
        H2
      </button>
      <button
        onClick={() => formatHeading('h3')}
        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
      >
        H3
      </button>
      <button
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
      >
        Список
      </button>
      <button
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
      >
        Нумерованный список
      </button>
    </div>
  );
} 
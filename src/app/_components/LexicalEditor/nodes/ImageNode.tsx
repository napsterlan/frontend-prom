'use client';

import { DecoratorNode } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ReactNode } from 'react';
import Image from 'next/image';
import { SerializedLexicalNode } from 'lexical';

export class ImageNode extends DecoratorNode<ReactNode> {
  __src: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__key);
  }

  constructor(src: string, key?: string) {
    super(key);
    this.__src = src;
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'relative w-full';
    return div;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    const DeleteButton = () => {
      const [editor] = useLexicalComposerContext();
      
      return (
        <button
          onClick={() => {
            editor.update(() => {
              this.remove();
            });
          }}
          className="absolute top-2 right-2 bg-black text-white rounded px-1.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-50 cursor-pointer"
          title="Удалить изображение"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      );
    };

    return (
      <div className="relative w-fit mx-auto my-4 group">
        <Image
          src={this.__src}
          alt=""
          width={800}
          height={600}
          className="max-w-full h-auto"
          style={{ objectFit: 'contain' }}
          unoptimized
        />
        <DeleteButton />
      </div>
    );
  }

  static importJSON(serializedNode: SerializedLexicalNode): ImageNode {
    const nodeData = serializedNode as unknown as { src: string };
    return $createImageNode(nodeData.src);
  }

  exportJSON() {
    return {
      src: this.__src,
      type: 'image',
      version: 1,
    };
  }
}

export function $createImageNode(src: string): ImageNode {
  return new ImageNode(src);
} 
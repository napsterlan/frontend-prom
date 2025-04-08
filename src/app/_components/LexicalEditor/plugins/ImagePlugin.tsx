'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $insertNodes } from 'lexical';
import { useCallback } from 'react';
import { uploadImages } from '@/api/apiClient';
import { $createImageNode } from '../nodes/ImageNode';

export function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  const handleImageUpload = useCallback(async (files: FileList) => {
    const paths = await uploadImages(Array.from(files), 'editor/images');
    
    editor.update(() => {
      const nodes = paths.filePaths.map((path: string) => {
        const imageNode = $createImageNode(path);
        const paragraphNode = $createParagraphNode();
        paragraphNode.append(imageNode);
        return paragraphNode;
      });
      
      $insertNodes(nodes);
    });
  }, [editor]);

  return null;
}

export default ImagePlugin; 
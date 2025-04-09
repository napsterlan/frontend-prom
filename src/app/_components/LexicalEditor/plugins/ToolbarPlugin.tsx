'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode
} from '@lexical/list';
import {
  $createHeadingNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  $isElementNode,
  $createRangeSelection,
  $setSelection,
  UNDO_COMMAND,
  REDO_COMMAND,
  $insertNodes,
} from 'lexical';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useToast } from '@/components/ui/ToastContext';
import { $createLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { uploadImages } from '@/api';
import { $createImageNode } from '../nodes/ImageNode';

// Иконки
const UndoIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10H17C19.2091 10 21 11.7909 21 14C21 16.2091 19.2091 18 17 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 6L3 10L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RedoIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 10H7C4.79086 10 3 11.7909 3 14C3 16.2091 4.79086 18 7 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 6L21 10L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ImageIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlignmentIcons = {
  left: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 14H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  center: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 14H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  right: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 14H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
};

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5'] as const;
type HeadingTag = typeof HEADING_TAGS[number];

interface ActiveFormats {
  isBold: boolean;
  isItalic: boolean;
  headingTag: HeadingTag | null;
  isUnorderedList: boolean;
  isOrderedList: boolean;
  isLink: boolean;
  textAlign: 'left' | 'center' | 'right';
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { showToast } = useToast();
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({
    isBold: false,
    isItalic: false,
    headingTag: null,
    isUnorderedList: false,
    isOrderedList: false,
    isLink: false,
    textAlign: 'left'
  });

  const [showHeadings, setShowHeadings] = useState(false);
  const [showLists, setShowLists] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [savedSelection, setSavedSelection] = useState<ReturnType<typeof $getSelection> | null>(null);
  const [selectedText, setSelectedText] = useState('');
  
  const headingsRef = useRef<HTMLDivElement>(null);
  const listsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const headingButtons = HEADING_TAGS.map((tag) => ({
    tag,
    label: `Заголовок ${tag.slice(1)}`,
    className: `text-${tag === 'h1' ? '4xl' : tag === 'h2' ? '3xl' : tag === 'h3' ? '2xl' : tag === 'h4' ? 'xl' : 'lg'}`
  }));

  const listButtons = [
    { type: 'bullet', label: 'Маркированный список', command: INSERT_UNORDERED_LIST_COMMAND },
    { type: 'number', label: 'Нумерованный список', command: INSERT_ORDERED_LIST_COMMAND }
  ];

  useEffect(() => {
    return editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          setActiveFormats({
            isBold: false,
            isItalic: false,
            headingTag: null,
            isUnorderedList: false,
            isOrderedList: false,
            isLink: false,
            textAlign: 'left'
          });
          return;
        }

        const nodes = selection.getNodes();
        
        // Проверяем форматирование текста
        const isBold = selection.hasFormat('bold');
        const isItalic = selection.hasFormat('italic');

        // Проверяем заголовки
        const headingTag = HEADING_TAGS.find(tag => 
          nodes.some(node => {
            const parent = node.getParent();
            return $isHeadingNode(parent) && parent.getTag() === tag;
          })
        ) || null;

        // Проверяем списки
        const checkList = (type: 'bullet' | 'number') => nodes.some(node => {
          let parent = node.getParent();
          while (parent !== null) {
            if ($isListNode(parent) && parent.getListType() === type) return true;
            parent = parent.getParent();
          }
          return false;
        });

        const isUnorderedList = checkList('bullet');
        const isOrderedList = checkList('number');

        // Проверяем ссылки
        const isLink = nodes.some(node => {
          let parent = node.getParent();
          while (parent !== null) {
            if ($isLinkNode(parent)) return true;
            parent = parent.getParent();
          }
          return false;
        });

        setActiveFormats({
          isBold,
          isItalic,
          headingTag,
          isUnorderedList,
          isOrderedList,
          isLink,
          textAlign: 'left' // TODO: Добавить определение текущего выравнивания
        });
      });
    });
  }, [editor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headingsRef.current && !headingsRef.current.contains(event.target as Node)) {
        setShowHeadings(false);
      }
      if (listsRef.current && !listsRef.current.contains(event.target as Node)) {
        setShowLists(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatText = useCallback((format: 'bold' | 'italic') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  }, [editor]);

  const formatHeading = useCallback((tag: HeadingTag) => {
    editor.update(() => {
      try {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const nodes = selection.getNodes();
        if (nodes.length === 0) return;

        const isValidSelection = nodes.every(node => {
          const textContent = node.getTextContent();
          const anchor = selection.anchor;
          const focus = selection.focus;
          return (
            anchor.offset <= textContent.length &&
            focus.offset <= textContent.length
          );
        });

        if (!isValidSelection) return;

        // Проверяем, находимся ли в списке
        const isInList = nodes.some(node => {
          let parent = node.getParent();
          while (parent !== null) {
            if ($isListNode(parent)) return true;
            parent = parent.getParent();
          }
          return false;
        });

        if (isInList) {
          showToast('Нельзя преобразовать список в заголовок. Сначала отключите форматирование списка.', 'warning');
          return;
        }

        const firstNode = nodes[0];
        const firstParent = firstNode.getParent();
        if (!firstParent) return;

        const isCurrentlyHeading = $isHeadingNode(firstParent) && firstParent.getTag() === tag;

        if (isCurrentlyHeading) {
          const paragraph = $createParagraphNode();
          firstParent.replace(paragraph);
          nodes.forEach(node => paragraph.append(node));
        } else {
          const heading = $createHeadingNode(tag);
          firstParent.replace(heading);
          nodes.forEach(node => heading.append(node));
        }

        setShowHeadings(false);
      } catch (error) {
        console.error('Error formatting heading:', error);
        showToast('Произошла ошибка при форматировании заголовка', 'error');
      }
    });
  }, [editor, showToast]);

  const toggleList = useCallback((command: typeof INSERT_ORDERED_LIST_COMMAND | typeof INSERT_UNORDERED_LIST_COMMAND) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const nodes = selection.getNodes();
      const isInList = nodes.some(node => {
        let parent = node.getParent();
        while (parent !== null) {
          if ($isListNode(parent)) {
            const currentListType = parent.getListType();
            const targetListType = command === INSERT_ORDERED_LIST_COMMAND ? 'number' : 'bullet';
            
            if (currentListType === targetListType) {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
              editor.dispatchCommand(command, undefined);
            }
            return true;
          }
          parent = parent.getParent();
        }
        return false;
      });

      if (!isInList) {
        editor.dispatchCommand(command, undefined);
      }
    });
  }, [editor]);

  const handleLink = useCallback((url: string | null) => {
    editor.update(() => {
      try {
        if (savedSelection && $isRangeSelection(savedSelection)) {
          const isValidSelection = savedSelection.getNodes().every(node => {
            const textContent = node.getTextContent();
            const anchor = savedSelection.anchor;
            const focus = savedSelection.focus;
            return (
              anchor.offset <= textContent.length &&
              focus.offset <= textContent.length
            );
          });

          if (isValidSelection) {
            $setSelection(savedSelection);
          } else {
            // Если выделение невалидно, создаем новое
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
          }
        }

        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        if (url === null) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        } else if (url.trim() !== '') {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        
        setShowLinkDialog(false);
        setLinkUrl('https://');
        setSavedSelection(null);
      } catch (error) {
        console.error('Error handling link:', error);
        showToast('Произошла ошибка при работе со ссылкой', 'error');
        setShowLinkDialog(false);
        setLinkUrl('https://');
        setSavedSelection(null);
      }
    });
  }, [editor, savedSelection, showToast]);

  const handleUndo = useCallback(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [editor]);

  const handleRedo = useCallback(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }, [editor]);

  const handleAlignment = useCallback((alignment: 'left' | 'center' | 'right') => {
    editor.update(() => {
      try {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const isValidSelection = selection.getNodes().every(node => {
          const textContent = node.getTextContent();
          const anchor = selection.anchor;
          const focus = selection.focus;
          return (
            anchor.offset <= textContent.length &&
            focus.offset <= textContent.length
          );
        });

        if (!isValidSelection) return;

        selection.getNodes().forEach(node => {
          const parent = node.getParent();
          if (parent && $isElementNode(parent)) {
            parent.setFormat(alignment);
          }
        });
        setActiveFormats(prev => ({ ...prev, textAlign: alignment }));
      } catch (error) {
        console.error('Error handling alignment:', error);
      }
    });
  }, [editor]);

  const handleImageUpload = useCallback(async (files: FileList) => {
    try {
      const paths = await uploadImages(Array.from(files), 'editor/images');
      
      editor.update(() => {
        const nodes = paths.filePaths.map(path => {
          // Добавляем полный URL к MinIO
          const apiUrl = process.env.NEXT_PUBLIC_MINIO_URL || 'http://192.168.31.40:9015/promled-website-test/';
          const fullPath = `${apiUrl}${path}`;
          const imageNode = $createImageNode(fullPath);
          const paragraphNode = $createParagraphNode();
          paragraphNode.append(imageNode);
          return paragraphNode;
        });
        
        $insertNodes(nodes);
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      showToast('Ошибка при загрузке изображений', 'error');
    }
  }, [editor, showToast]);

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files);
    }
    // Очищаем input чтобы можно было загрузить тот же файл повторно
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleImageUpload]);

  return (
    <div className="border-b p-2 mb-4 flex flex-wrap gap-2">
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={handleUndo}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
          title="Отменить (Ctrl+Z)"
        >
          <UndoIcon />
        </button>
        <button
          type="button"
          onClick={handleRedo}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
          title="Повторить (Ctrl+Y)"
        >
          <RedoIcon />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button
          type="button"
          onClick={() => formatText('bold')}
          className={`px-3 py-1 rounded ${
            activeFormats.isBold ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Жирный (Ctrl+B)"
        >
          Жирный
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className={`px-3 py-1 rounded ${
            activeFormats.isItalic ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Курсив (Ctrl+I)"
        >
          Курсив
        </button>

        <div className="relative" ref={headingsRef}>
          <button
            type="button"
            onClick={() => setShowHeadings(!showHeadings)}
            className={`px-3 py-1 rounded flex items-center gap-1 ${
              activeFormats.headingTag ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Заголовки
            <svg 
              className={`w-4 h-4 transition-transform ${showHeadings ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showHeadings && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
              {headingButtons.map(({ tag, label, className }) => (
                <button
                  key={tag}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${className} ${
                    activeFormats.headingTag === tag ? 'bg-gray-200' : ''
                  } whitespace-nowrap`}
                  onClick={() => formatHeading(tag)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={listsRef}>
          <button
            type="button"
            onClick={() => setShowLists(!showLists)}
            className={`px-3 py-1 rounded flex items-center gap-1 ${
              (activeFormats.isUnorderedList || activeFormats.isOrderedList) 
              ? 'bg-gray-300' 
              : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Списки
            <svg 
              className={`w-4 h-4 transition-transform ${showLists ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showLists && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
              {listButtons.map(({ type, label, command }) => (
                <button
                  key={type}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    (type === 'bullet' && activeFormats.isUnorderedList) || 
                    (type === 'number' && activeFormats.isOrderedList) 
                      ? 'bg-gray-200' 
                      : ''
                  } whitespace-nowrap`}
                  onClick={() => {
                    toggleList(command);
                    setShowLists(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            editor.update(() => {
              const selection = $getSelection();
              if (!$isRangeSelection(selection)) return;
              setSelectedText(selection.getTextContent());
              setSavedSelection(selection.clone());
            });
            setShowLinkDialog(true);
          }}
          className={`px-3 py-1 rounded ${
            activeFormats.isLink ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Вставить/редактировать ссылку"
        >
          Ссылка
        </button>

        {showLinkDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {activeFormats.isLink ? 'Редактировать ссылку' : 'Вставить ссылку'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowLinkDialog(false);
                    setSavedSelection(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {selectedText && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Выделенный текст
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                      {selectedText}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                    URL
                  </label>
                  <input
                    id="url"
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://"
                    className="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  {activeFormats.isLink && (
                    <button
                      type="button"
                      onClick={() => handleLink(null)}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      Удалить
                    </button>
                  )}
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setShowLinkDialog(false);
                      setSavedSelection(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLink(linkUrl)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {activeFormats.isLink ? 'Сохранить' : 'Вставить'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleImageClick}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
          title="Загрузить изображение"
        >
          <ImageIcon />
        </button>

        <div className="flex-1" />
        
        <div className="w-px h-6 bg-gray-300 mx-2" />

        {(['left', 'center', 'right'] as const).map((alignment) => (
          <button
            key={alignment}
            type="button"
            onClick={() => handleAlignment(alignment)}
            className={`px-3 py-1 rounded ${
              activeFormats.textAlign === alignment ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title={`По ${alignment === 'left' ? 'левому краю' : alignment === 'center' ? 'центру' : 'правому краю'}`}
          >
            {AlignmentIcons[alignment]()}
          </button>
        ))}
      </div>
    </div>
  );
}
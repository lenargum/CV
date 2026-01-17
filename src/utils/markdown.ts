/**
 * Lightweight markdown parser for CV content
 * Supports: **bold**, *italic*, `code`, [links](url), ~~strikethrough~~, and gap blocks via "\n\n".
 */

import React from 'react';

export interface MarkdownNode {
  type: 'text' | 'bold' | 'italic' | 'code' | 'link' | 'strikethrough' | 'gap';
  content: string;
  url?: string;
  isBold?: boolean;
  isItalic?: boolean;
}

/**
 * Parse markdown text into structured nodes with support for nested elements
 */
export function parseMarkdown(text: string): MarkdownNode[] {
  const nodes: MarkdownNode[] = [];
  let currentIndex = 0;

  // Enhanced regex patterns that handle nested elements
  const patterns = [
    // Gap blocks: one or more double newlines (supports CRLF and LF)
    { type: 'gap' as const, regex: /(\r?\n\r?\n+)/g },
    // Bold links: **[text](url)**
    { type: 'bold-link' as const, regex: /\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/g },
    // Italic links: *[text](url)*
    { type: 'italic-link' as const, regex: /\*\[([^\]]+)\]\(([^)]+)\)\*/g },
    // Regular bold: **text**
    { type: 'bold' as const, regex: /\*\*((?!\[).*?)\*\*/g },
    // Regular italic: *text* (but not if it's part of a link)
    { type: 'italic' as const, regex: /\*((?!\[).*?)\*/g },
    // Code: `text`
    { type: 'code' as const, regex: /`(.*?)`/g },
    // Regular links: [text](url)
    { type: 'link' as const, regex: /\[([^\]]+)\]\(([^)]+)\)/g },
    // Strikethrough: ~~text~~
    { type: 'strikethrough' as const, regex: /~~(.*?)~~/g },
  ];

  while (currentIndex < text.length) {
    let nearestMatch: { 
      index: number; 
      length: number; 
      type: MarkdownNode['type'] | 'bold-link' | 'italic-link'; 
      content: string; 
      url?: string;
      isBold?: boolean;
      isItalic?: boolean;
    } | null = null;

    // Find the nearest markdown pattern
    for (const pattern of patterns) {
      pattern.regex.lastIndex = currentIndex;
      const match = pattern.regex.exec(text);
      
      if (match && (nearestMatch === null || match.index < nearestMatch.index)) {
        nearestMatch = {
          index: match.index,
          length: match[0].length,
          type: pattern.type,
          content: match[1],
          url: pattern.type.includes('link') ? match[2] : undefined,
          isBold: pattern.type === 'bold-link',
          isItalic: pattern.type === 'italic-link',
        };
      }
    }

    if (nearestMatch) {
      // Add text before the match
      if (nearestMatch.index > currentIndex) {
        nodes.push({
          type: 'text',
          content: text.slice(currentIndex, nearestMatch.index),
        });
      }

      // Add the matched element
      if (nearestMatch.type === 'bold-link' || nearestMatch.type === 'italic-link') {
        nodes.push({
          type: 'link',
          content: nearestMatch.content,
          url: nearestMatch.url,
          isBold: nearestMatch.isBold,
          isItalic: nearestMatch.isItalic,
        } as any);
      } else {
        nodes.push({
          type: nearestMatch.type as MarkdownNode['type'],
          content: nearestMatch.content,
          url: nearestMatch.url,
        });
      }

      currentIndex = nearestMatch.index + nearestMatch.length;
    } else {
      // No more matches, add remaining text
      nodes.push({
        type: 'text',
        content: text.slice(currentIndex),
      });
      break;
    }
  }

  return nodes;
}

/**
 * Convert markdown nodes to React elements
 */
export function renderMarkdown(text: string): React.ReactNode[] {
  const nodes = parseMarkdown(text);
  
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'bold':
        return React.createElement('strong', { key: index, className: 'font-semibold text-text-primary' }, node.content);
      
      case 'italic':
        return React.createElement('em', { key: index, className: 'italic' }, node.content);
      
      case 'code':
        return React.createElement('code', { 
          key: index, 
          className: 'bg-gray-100 text-text-primary px-1.5 py-0.5 rounded text-sm font-mono' 
        }, node.content);
      
      case 'link':
        const linkClasses = [
          'underline',
          node.isBold ? 'font-semibold text-text-primary' : '',
          node.isItalic ? 'italic' : ''
        ].filter(Boolean).join(' ');
        
        return React.createElement('a', { 
          key: index, 
          href: node.url, 
          target: '_blank', 
          rel: 'noopener noreferrer',
          className: linkClasses
        }, node.content);
      
      case 'strikethrough':
        return React.createElement('del', { key: index, className: 'line-through text-text-tertiary' }, node.content);

      case 'gap':
        // Render a block-level spacer; default classes can be overridden via MarkdownText props
        // The concrete class/height is injected by MarkdownText through context of props.
        // Here we use a semantic placeholder that MarkdownText will replace at call-site via options.
        return React.createElement('span', { key: index, 'aria-hidden': true, className: '__md-gap__' });
      
      case 'text':
      default:
        return node.content;
    }
  });
}

/**
 * React component for rendering markdown text
 */
interface MarkdownTextProps {
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: string;
  className?: string;
  /** Tailwind/CSS classes applied to gap blocks generated by "\n\n". Defaults to 'block h-4 my-4 shrink-0'. */
  gapClassName?: string;
  /** Explicit height for gap blocks in pixels (optional). When set, applied as inline style height. */
  gapHeight?: number;
}

export function MarkdownText({ as = 'span', children, className = '', gapClassName, gapHeight }: MarkdownTextProps): React.ReactElement {
  const parsed = renderMarkdown(children);

  // Replace placeholder gap markers with actual elements using the provided configuration
  const effectiveGapClass = ['block', 'shrink-0', gapClassName || 'h-4 print:h-2'].filter(Boolean).join(' ');

  const elements = parsed.map((node, index) => {
    if (React.isValidElement(node) && (node.props as any)?.className === '__md-gap__') {
      const props: any = { key: index, className: effectiveGapClass, 'aria-hidden': true };
      if (typeof gapHeight === 'number') props.style = { height: gapHeight };
      return React.createElement('span', props);
    }
    return node as React.ReactNode;
  });

  return React.createElement(as, { className }, ...elements);
}
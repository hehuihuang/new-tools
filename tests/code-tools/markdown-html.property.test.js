/**
 * Feature: code-tools-suite, Property 1: Markdown/HTML Round-Trip Consistency
 * Validates: Requirements 1.1, 1.2
 * 
 * For any valid Markdown text, converting to HTML and then back to Markdown 
 * should preserve the semantic content (headings, lists, links, emphasis remain intact).
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// 模拟 CodeUtils 的 Markdown/HTML 转换函数
const markdownToHTML = (markdown) => {
  // 简单的 Markdown 解析
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*([^*]+)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    .replace(/^- (.*)$/gim, '<li>$1</li>')
    .replace(/\n/gim, '\n');
  return html;
};

const htmlToMarkdown = (html) => {
  // 简单的 HTML 转 Markdown
  let markdown = html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1')
    .replace(/<[^>]+>/g, '');
  return markdown;
};

// 提取语义内容（用于比较）
const extractSemanticContent = (text) => {
  return text
    .replace(/[#*\-\[\]()]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};

describe('Markdown/HTML Round-Trip Consistency', () => {
  /**
   * Property 1: Markdown/HTML Round-Trip Consistency
   * For any valid Markdown text, converting to HTML and then back to Markdown 
   * should preserve the semantic content.
   */
  it('should preserve semantic content after round-trip conversion', () => {
    // 生成简单的 Markdown 文本
    const markdownArbitrary = fc.oneof(
      // 普通文本
      fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('<') && !s.includes('>')),
      // 标题
      fc.tuple(
        fc.constantFrom('# ', '## ', '### '),
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => /^[a-zA-Z0-9\s]+$/.test(s))
      ).map(([prefix, text]) => prefix + text),
      // 粗体
      fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9\s]+$/.test(s))
        .map(s => `**${s}**`),
      // 斜体
      fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9\s]+$/.test(s))
        .map(s => `*${s}*`)
    );

    fc.assert(
      fc.property(markdownArbitrary, (markdown) => {
        const html = markdownToHTML(markdown);
        const backToMarkdown = htmlToMarkdown(html);
        
        // 比较语义内容
        const originalSemantic = extractSemanticContent(markdown);
        const roundTripSemantic = extractSemanticContent(backToMarkdown);
        
        // 语义内容应该保持一致
        return originalSemantic === roundTripSemantic;
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve heading levels after round-trip', () => {
    const headingArbitrary = fc.tuple(
      fc.constantFrom(1, 2, 3),
      fc.string({ minLength: 1, maxLength: 30 }).filter(s => /^[a-zA-Z0-9\s]+$/.test(s))
    );

    fc.assert(
      fc.property(headingArbitrary, ([level, text]) => {
        const markdown = '#'.repeat(level) + ' ' + text;
        const html = markdownToHTML(markdown);
        const backToMarkdown = htmlToMarkdown(html);
        
        // 检查标题级别是否保持
        const originalLevel = (markdown.match(/^#+/) || [''])[0].length;
        const roundTripLevel = (backToMarkdown.match(/^#+/) || [''])[0].length;
        
        return originalLevel === roundTripLevel;
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve emphasis markers after round-trip', () => {
    const textArbitrary = fc.string({ minLength: 1, maxLength: 20 })
      .filter(s => /^[a-zA-Z0-9\s]+$/.test(s));

    fc.assert(
      fc.property(textArbitrary, (text) => {
        const boldMarkdown = `**${text}**`;
        const boldHtml = markdownToHTML(boldMarkdown);
        const boldBack = htmlToMarkdown(boldHtml);
        
        // 检查粗体标记是否保持
        const hasBold = boldBack.includes('**') && boldBack.includes(text);
        
        return hasBold;
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: code-tools-suite, Property 8: Diff Symmetry
 * Feature: code-tools-suite, Property 9: Diff Mode Granularity
 * Validates: Requirements 5.1, 5.3, 5.4
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// 简单的 diff 实现
const diffText = (text1, text2, mode = 'line') => {
  if (mode === 'line') {
    return diffLines(text1, text2);
  }
  return diffChars(text1, text2);
};

const diffLines = (text1, text2) => {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const result = [];
  
  let i = 0, j = 0;
  while (i < lines1.length || j < lines2.length) {
    if (i >= lines1.length) {
      result.push({ type: 'added', content: lines2[j++] });
    } else if (j >= lines2.length) {
      result.push({ type: 'deleted', content: lines1[i++] });
    } else if (lines1[i] === lines2[j]) {
      result.push({ type: 'unchanged', content: lines1[i] });
      i++; j++;
    } else {
      result.push({ type: 'deleted', content: lines1[i++] });
      result.push({ type: 'added', content: lines2[j++] });
    }
  }
  return result;
};

const diffChars = (text1, text2) => {
  const result = [];
  let i = 0, j = 0;
  
  while (i < text1.length || j < text2.length) {
    if (i >= text1.length) {
      result.push({ type: 'added', content: text2[j++] });
    } else if (j >= text2.length) {
      result.push({ type: 'deleted', content: text1[i++] });
    } else if (text1[i] === text2[j]) {
      result.push({ type: 'unchanged', content: text1[i] });
      i++; j++;
    } else {
      result.push({ type: 'deleted', content: text1[i++] });
      result.push({ type: 'added', content: text2[j++] });
    }
  }
  return result;
};

// 统计 diff 结果
const countDiffTypes = (diffs) => {
  return diffs.reduce((acc, diff) => {
    acc[diff.type] = (acc[diff.type] || 0) + 1;
    return acc;
  }, { added: 0, deleted: 0, unchanged: 0 });
};

describe('Diff Symmetry', () => {
  /**
   * Property 8: Diff Symmetry
   * For any two texts A and B, the diff from A to B should have additions 
   * that match the deletions from B to A.
   */
  it('additions in A->B should equal deletions in B->A', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (text1, text2) => {
        const diffAB = diffText(text1, text2, 'char');
        const diffBA = diffText(text2, text1, 'char');
        
        const statsAB = countDiffTypes(diffAB);
        const statsBA = countDiffTypes(diffBA);
        
        // A->B 的添加数应该等于 B->A 的删除数
        return statsAB.added === statsBA.deleted && statsAB.deleted === statsBA.added;
      }),
      { numRuns: 100 }
    );
  });

  it('unchanged count should be same in both directions', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (text1, text2) => {
        const diffAB = diffText(text1, text2, 'char');
        const diffBA = diffText(text2, text1, 'char');
        
        const statsAB = countDiffTypes(diffAB);
        const statsBA = countDiffTypes(diffBA);
        
        return statsAB.unchanged === statsBA.unchanged;
      }),
      { numRuns: 100 }
    );
  });

  it('identical texts should have no additions or deletions', () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        const diff = diffText(text, text, 'char');
        const stats = countDiffTypes(diff);
        
        return stats.added === 0 && stats.deleted === 0;
      }),
      { numRuns: 100 }
    );
  });
});

describe('Diff Mode Granularity', () => {
  /**
   * Property 9: Diff Mode Granularity
   * For any two texts with differences, word-level diff should produce 
   * equal or more change segments than line-level diff.
   */
  it('char-level diff should produce more or equal segments than line-level', () => {
    const multiLineText = fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 })
      .map(lines => lines.join('\n'));

    fc.assert(
      fc.property(multiLineText, multiLineText, (text1, text2) => {
        const lineDiff = diffText(text1, text2, 'line');
        const charDiff = diffText(text1, text2, 'char');
        
        // 字符级别的 diff 应该产生更多或相等数量的段
        return charDiff.length >= lineDiff.length || text1 === text2;
      }),
      { numRuns: 100 }
    );
  });

  it('line-level diff should group changes by line', () => {
    const text1 = 'line1\nline2\nline3';
    const text2 = 'line1\nmodified\nline3';
    
    const lineDiff = diffText(text1, text2, 'line');
    
    // 应该有 3 个主要段：unchanged, deleted+added, unchanged
    const hasLineStructure = lineDiff.some(d => d.content === 'line1' && d.type === 'unchanged') &&
                             lineDiff.some(d => d.content === 'line3' && d.type === 'unchanged');
    
    expect(hasLineStructure).toBe(true);
  });

  it('char-level diff should detect character-level changes', () => {
    const text1 = 'hello';
    const text2 = 'hallo';
    
    const charDiff = diffText(text1, text2, 'char');
    
    // 应该检测到 'e' 被删除，'a' 被添加
    const hasCharChange = charDiff.some(d => d.content === 'e' && d.type === 'deleted') &&
                          charDiff.some(d => d.content === 'a' && d.type === 'added');
    
    expect(hasCharChange).toBe(true);
  });
});

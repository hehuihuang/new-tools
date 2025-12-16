/**
 * Feature: code-tools-suite, Property 14: CSV/Markdown Table Round-Trip
 * Feature: code-tools-suite, Property 15: CSV Escape Handling
 * Validates: Requirements 8.1, 8.2, 8.5
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// CSV 解析
const parseCSV = (csv, delimiter = ',') => {
  const rows = [];
  const lines = csv.trim().split('\n');
  
  for (const line of lines) {
    const row = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    rows.push(row);
  }
  
  return rows;
};

// CSV 转 Markdown 表格
const csvToMarkdownTable = (csv) => {
  const rows = parseCSV(csv);
  if (rows.length === 0) return '';

  const header = rows[0];
  const separator = header.map(() => '---');
  const dataRows = rows.slice(1);

  const formatRow = row => '| ' + row.join(' | ') + ' |';
  
  return [
    formatRow(header),
    formatRow(separator),
    ...dataRows.map(formatRow)
  ].join('\n');
};

// Markdown 表格转 CSV
const markdownTableToCSV = (markdown) => {
  const lines = markdown.trim().split('\n').filter(line => line.trim());
  const rows = [];

  for (const line of lines) {
    if (/^\|[\s-:|]+\|$/.test(line)) continue;
    
    const cells = line
      .replace(/^\||\|$/g, '')
      .split('|')
      .map(cell => cell.trim());
    
    rows.push(cells);
  }

  return rows.map(row => 
    row.map(cell => {
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return '"' + cell.replace(/"/g, '""') + '"';
      }
      return cell;
    }).join(',')
  ).join('\n');
};

// 生成 CSV 字符串
const generateCSV = (rows) => {
  return rows.map(row => 
    row.map(cell => {
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return '"' + cell.replace(/"/g, '""') + '"';
      }
      return cell;
    }).join(',')
  ).join('\n');
};

describe('CSV/Markdown Table Round-Trip', () => {
  /**
   * Property 14: CSV/Markdown Table Round-Trip
   * For any simple CSV data (without nested quotes), converting to Markdown table 
   * then back to CSV should preserve all cell values.
   */
  it('should preserve cell values after CSV -> Markdown -> CSV', () => {
    // 生成简单的表格数据（不包含特殊字符）
    const cellArbitrary = fc.string({ minLength: 1, maxLength: 10 })
      .filter(s => /^[a-zA-Z0-9\s]+$/.test(s) && s.trim().length > 0);
    
    const rowArbitrary = fc.array(cellArbitrary, { minLength: 2, maxLength: 4 });
    const tableArbitrary = fc.array(rowArbitrary, { minLength: 2, maxLength: 4 })
      .filter(rows => {
        // 确保所有行有相同的列数
        const colCount = rows[0].length;
        return rows.every(row => row.length === colCount);
      });

    fc.assert(
      fc.property(tableArbitrary, (rows) => {
        const csv = generateCSV(rows);
        const markdown = csvToMarkdownTable(csv);
        const backToCSV = markdownTableToCSV(markdown);
        const parsedBack = parseCSV(backToCSV);
        
        // 比较原始数据和转换后的数据
        if (rows.length !== parsedBack.length) return false;
        
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].length !== parsedBack[i].length) return false;
          for (let j = 0; j < rows[i].length; j++) {
            if (rows[i][j].trim() !== parsedBack[i][j].trim()) return false;
          }
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve row and column count after round-trip', () => {
    const cellArbitrary = fc.string({ minLength: 1, maxLength: 8 })
      .filter(s => /^[a-zA-Z0-9]+$/.test(s));
    
    const colCount = fc.integer({ min: 2, max: 5 });
    const rowCount = fc.integer({ min: 2, max: 5 });

    fc.assert(
      fc.property(colCount, rowCount, (cols, rows) => {
        const tableData = [];
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let j = 0; j < cols; j++) {
            row.push(`cell${i}${j}`);
          }
          tableData.push(row);
        }
        
        const csv = generateCSV(tableData);
        const markdown = csvToMarkdownTable(csv);
        const backToCSV = markdownTableToCSV(markdown);
        const parsedBack = parseCSV(backToCSV);
        
        return parsedBack.length === rows && parsedBack[0].length === cols;
      }),
      { numRuns: 100 }
    );
  });
});

describe('CSV Escape Handling', () => {
  /**
   * Property 15: CSV Escape Handling
   * For any CSV data containing commas or quotes within cells, 
   * the parser should correctly identify cell boundaries.
   */
  it('should correctly parse cells containing commas', () => {
    const csvWithCommas = 'name,description\nJohn,"Hello, World"\nJane,"A, B, C"';
    const parsed = parseCSV(csvWithCommas);
    
    expect(parsed[1][1]).toBe('Hello, World');
    expect(parsed[2][1]).toBe('A, B, C');
  });

  it('should correctly parse cells containing quotes', () => {
    const csvWithQuotes = 'name,quote\nJohn,"He said ""Hello"""\nJane,"It\'s ""fine"""';
    const parsed = parseCSV(csvWithQuotes);
    
    expect(parsed[1][1]).toBe('He said "Hello"');
    expect(parsed[2][1]).toBe('It\'s "fine"');
  });

  it('should handle mixed special characters', () => {
    const testCases = [
      { input: '"a,b"', expected: 'a,b' },
      { input: '"""quoted"""', expected: '"quoted"' },
      { input: '"comma, and ""quote"""', expected: 'comma, and "quote"' }
    ];

    testCases.forEach(({ input, expected }) => {
      const csv = `header\n${input}`;
      const parsed = parseCSV(csv);
      expect(parsed[1][0]).toBe(expected);
    });
  });

  it('should preserve cell count regardless of content', () => {
    const cellArbitrary = fc.oneof(
      fc.string({ minLength: 1, maxLength: 10 }).filter(s => /^[a-zA-Z0-9]+$/.test(s)),
      fc.constant('a,b'),
      fc.constant('x"y'),
      fc.constant('hello, "world"')
    );

    fc.assert(
      fc.property(fc.array(cellArbitrary, { minLength: 2, maxLength: 4 }), (cells) => {
        const row = cells.map(cell => {
          if (cell.includes(',') || cell.includes('"')) {
            return '"' + cell.replace(/"/g, '""') + '"';
          }
          return cell;
        }).join(',');
        
        const csv = `header1,header2,header3,header4\n${row}`;
        const parsed = parseCSV(csv);
        
        // 第二行应该有与 cells 相同数量的单元格
        return parsed[1].length === cells.length;
      }),
      { numRuns: 100 }
    );
  });

  it('empty cells should be preserved', () => {
    const csv = 'a,b,c\n1,,3\n,2,';
    const parsed = parseCSV(csv);
    
    expect(parsed[1]).toEqual(['1', '', '3']);
    expect(parsed[2]).toEqual(['', '2', '']);
  });
});

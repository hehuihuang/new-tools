# Implementation Plan

- [x] 1. Set up project structure and shared resources




  - [x] 1.1 Create text-tools directory structure


    - Create `text-tools/` folder with `shared/` subdirectory


    - _Requirements: 10.1_


  - [x] 1.2 Create shared styles (styles.css)




    - Copy and adapt blue-themed styles from code-tools/shared/styles.css

    - _Requirements: 10.1_
  - [x] 1.3 Create shared components (components.js)

    - Implement createHeader, createPrivacyNotice, showMessage, copyToClipboard functions
    - _Requirements: 10.2, 10.3, 10.4_

  - [x] 1.4 Create shared utilities (utils.js)





    - Implement splitLines, joinLines, countChars, countWords, escapeHtml functions


    - _Requirements: 10.1_

- [-] 2. Implement Text Deduplicator tool



  - [x] 2.1 Create text-dedup.html with UI layout

    - Input textarea, mode selection (行去重/去空行/去重复词), output area, statistics display
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 2.2 Implement dedupLines function

    - Remove duplicate lines while preserving first occurrence order

    - _Requirements: 1.1_
  - [x] 2.3 Implement removeEmptyLines function


    - Remove empty lines and whitespace-only lines
    - _Requirements: 1.2_
  - [x] 2.4 Implement dedupWords function

    - Remove duplicate words within each line
    - _Requirements: 1.3_
  - [x] 2.5 Write property tests for text deduplication


    - **Property 1: Line Deduplication Preserves Order and Uniqueness**
    - **Property 2: Empty Line Removal Completeness**
    - **Property 3: Word Deduplication Within Lines**
    - **Validates: Requirements 1.1, 1.2, 1.3**

- [ ] 3. Implement Text Sorter tool
  - [x] 3.1 Create text-sort.html with UI layout

    - Input textarea, sort mode selection, ascending/descending toggle, output area
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 3.2 Implement sortAlpha function

    - Sort lines alphabetically using localeCompare
    - _Requirements: 2.1_
  - [x] 3.3 Implement sortNumeric function

    - Sort lines by numeric value, treat non-numeric as zero
    - _Requirements: 2.2_
  - [x] 3.4 Implement sortByLength function

    - Sort lines by character count
    - _Requirements: 2.3_
  - [x] 3.5 Write property tests for text sorting


    - **Property 4: Alphabetical Sort Ordering**
    - **Property 5: Numeric Sort Ordering**
    - **Property 6: Length Sort Ordering**
    - **Property 7: Sort Direction Reversal**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

- [ ] 4. Implement Text Replacer tool
  - [x] 4.1 Create text-replace.html with UI layout


    - Input textarea, search/replace inputs, regex toggle, case-sensitive toggle, output area with highlighting
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 4.2 Implement findMatches function

    - Find all occurrences and return count with positions
    - _Requirements: 3.1_
  - [x] 4.3 Implement replaceAll function

    - Replace all matches with replacement text
    - _Requirements: 3.2, 3.3, 3.4_
  - [x] 4.4 Write property tests for text replacement


    - **Property 8: Find Match Count Accuracy**
    - **Property 9: Replace All Completeness**
    - **Property 10: Case Sensitivity Correctness**
    - **Validates: Requirements 3.1, 3.2, 3.4**

- [ ] 5. Implement Text Splitter tool
  - [x] 5.1 Create text-split.html with UI layout


    - Input textarea, delimiter selection (predefined + custom), split/join mode toggle, output area
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [x] 5.2 Implement splitText function

    - Split text by specified delimiter
    - _Requirements: 4.1_
  - [x] 5.3 Implement joinText function

    - Join lines with specified delimiter
    - _Requirements: 4.2_
  - [x] 5.4 Write property tests for text split/join


    - **Property 11: Split/Join Round Trip**
    - **Validates: Requirements 4.1, 4.2**

- [x] 6. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement Text Cleaner tool
  - [x] 7.1 Create text-clean.html with UI layout


    - Input textarea, cleaning options checkboxes, output area
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 7.2 Implement trimLines function

    - Trim leading/trailing whitespace from each line
    - _Requirements: 5.1_
  - [x] 7.3 Implement collapseSpaces function

    - Collapse multiple consecutive spaces into single space
    - _Requirements: 5.2_
  - [x] 7.4 Implement removeSpecialChars function

    - Remove non-alphanumeric characters except common punctuation
    - _Requirements: 5.3_
  - [x] 7.5 Implement stripHtmlTags function

    - Remove HTML tags while preserving text content
    - _Requirements: 5.4_
  - [x] 7.6 Write property tests for text cleaning



    - **Property 12: Trim Completeness**
    - **Property 13: Space Collapse Correctness**
    - **Property 14: HTML Tag Removal**
    - **Validates: Requirements 5.1, 5.2, 5.4**

- [ ] 8. Implement Text Statistics tool
  - [x] 8.1 Create text-stats.html with UI layout


    - Input textarea, real-time statistics display, character frequency table
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  - [x] 8.2 Implement calculateStats function

    - Calculate all statistics: char count, word count, sentence count, line count
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  - [x] 8.3 Implement getCharFrequency function

    - Generate character frequency map
    - _Requirements: 6.5_
  - [x] 8.4 Write property tests for text statistics


    - **Property 15: Character Frequency Sum**
    - **Property 16: Word Count Consistency**
    - **Property 17: Line Count Accuracy**
    - **Validates: Requirements 6.1, 6.2, 6.4, 6.5**

- [ ] 9. Implement Emoji Converter tool
  - [x] 9.1 Create emoji-convert.html with UI layout


    - Input textarea, conversion mode toggle, output area
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [x] 9.2 Implement charToUnicode function

    - Convert characters to Unicode code point representation (U+XXXX format)
    - _Requirements: 7.1_
  - [x] 9.3 Implement unicodeToChar function

    - Convert Unicode code points back to characters
    - _Requirements: 7.2_
  - [x] 9.4 Write property tests for emoji conversion


    - **Property 18: Unicode Round Trip**
    - **Validates: Requirements 7.1, 7.2**

- [ ] 10. Implement Random Generator tool
  - [x] 10.1 Create random-gen.html with UI layout


    - Generation mode selection, options panel (length, character types), output area, generate button
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  - [x] 10.2 Implement generatePassword function

    - Generate random password with specified length and character types
    - _Requirements: 8.1_
  - [x] 10.3 Implement generateString function

    - Generate random alphanumeric string
    - _Requirements: 8.2_
  - [x] 10.4 Implement generateUUID function

    - Generate valid UUID v4
    - _Requirements: 8.3_
  - [x] 10.5 Implement generateLorem function

    - Generate Lorem Ipsum paragraphs
    - _Requirements: 8.4_
  - [x] 10.6 Write property tests for random generation


    - **Property 19: Password Generation Constraints**
    - **Property 20: UUID v4 Format Validity**
    - **Property 21: Lorem Ipsum Paragraph Count**
    - **Property 22: Random Generation Variability**
    - **Validates: Requirements 8.1, 8.3, 8.4, 8.5**

- [ ] 11. Update Navigation Portal
  - [x] 11.1 Update tooles/index.html text tools section


    - Replace placeholder links with actual tool links
    - Add all 8 text tool links with target="_blank"
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 12. Final Checkpoint - Ensure all tests pass



  - Ensure all tests pass, ask the user if questions arise.

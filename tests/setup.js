/**
 * Vitest 测试环境设置
 */

// 设置全局测试环境
global.URL.createObjectURL = () => 'mock-url';
global.URL.revokeObjectURL = () => {};

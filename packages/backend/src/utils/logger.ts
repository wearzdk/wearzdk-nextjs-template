import fs from 'node:fs';
import path from 'node:path';
import pino from 'pino';

// 创建基础 logger 实例
const baseLogger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

// 如果logs目录不存在，则创建
if (!fs.existsSync(path.join(process.cwd(), 'logs'))) {
  fs.mkdirSync(path.join(process.cwd(), 'logs'));
}

// 创建带模块名的子 logger，并将日志输出到运行目录
export function createModuleLogger(moduleName: string) {
  const logPath = path.join(process.cwd(), `logs/${moduleName}.log`);
  return pino({
    transport: {
      target: 'pino/file',
      options: { destination: logPath },
    },
  }).child({ module: moduleName });
}

// 预定义常用模块的 logger
export const log = {
  pay: createModuleLogger('pay'),
  writer: createModuleLogger('writer'),
  user: createModuleLogger('user'),
  common: createModuleLogger('common'),
};

// 导出基础 logger 用于其他场景
export default baseLogger;

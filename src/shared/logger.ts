import chalk from 'chalk'

enum Colors {
  INFO = '#00afef',
  SUCCESS = '#00c48f',
  WARING = '#ff9800',
  ERROR = '#f44336',
}

function createLogger(color: Colors) {
  return function (...args: any[]) {
    console.log(chalk.hex(color)(...args))
  }
}

export default {
  info: createLogger(Colors.INFO),
  success: createLogger(Colors.SUCCESS),
  warning: createLogger(Colors.WARING),
  error: createLogger(Colors.ERROR),
}

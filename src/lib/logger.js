import Logger from 'licia/Logger'

let logger

export default logger = new Logger(
  '[RodEruda]',
  ENV === 'production' ? 'warn' : 'debug'
)

logger.formatter = function (type, argList) {
  argList.unshift(this.name)

  return argList
}

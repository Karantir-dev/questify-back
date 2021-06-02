// Можно им обернуть функции из controllers (только убрать tryCatch) в routes
const wrapError = fn => async (req, res, next) => {
  try {
    const result = await fn(req, res, next)
    return result
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.status = 'error'
      error.code = 400
      error.message = 'Validation error'
    }
    next(error)
  }
}

module.exports = wrapError

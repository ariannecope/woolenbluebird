// Wraps an async Express handler so rejected promises reach the error
// middleware instead of crashing the process.
export function asyncHandler(handler) {
  return (req, res, next) => {
    handler(req, res, next).catch(next)
  }
}

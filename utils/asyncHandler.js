// utils/asyncHandler.js

const asyncHandler = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next); // Catch and forward errors to the next middleware
    };
  };
  export default asyncHandler;
  
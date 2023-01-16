module.exports.toSuccess = function (data) {
  return {
    success: true,
    data,
    message: null,
  };
};

module.exports.toFailure = function (message) {
  return {
    success: false,
    data: null,
    message,
  };
};

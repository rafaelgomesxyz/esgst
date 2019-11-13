class CustomError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   */
  constructor(message, status = 0) {
    super(message);
    this.status = status;
  }
}

CustomError.COMMON_MESSAGES = {
  internal: 'Internal error. Please contact the administrator.',
  sg: 'Internal error when fetching data from SteamGifts. SteamGifts might be down or the data might not exist. Please try again later.',
  steam: 'Internal error when fetching data from Steam. Steam might be down or the data might not exist. Please try again later.',
};

module.exports = CustomError;
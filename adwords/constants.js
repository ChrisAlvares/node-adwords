/**
 * The values here are taken from the PHP Google Adwords Library
 * https://github.com/googleads/googleads-php-lib
 */

module.exports = {
    /**
     * Recommended page size for most services.
     * @var int
     */
    RECOMMENDED_PAGE_SIZE: 500,
    /**
     * The number of micros in a dollar (or equivalent curreny unit).
     * @var int
     */
     MICROS_PER_DOLLAR:1000000,
    /**
     * The number of micro degrees in a degree.
     * @var int
     */
    MICRO_DEGREES_PER_DEGREE:1000000,

    /**
     * Determines if there is an oAuth error
     * @var string
     */
    OAUTH_ERROR: 'AuthenticationError.OAUTH_TOKEN_INVALID',

    /**
     * Gives a default adwords version
     * @var string
     */
    DEFAULT_ADWORDS_VERSION: 'v201609'
};

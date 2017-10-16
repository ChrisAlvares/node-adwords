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
    DEFAULT_ADWORDS_VERSION: 'v201710',

    /**
     * The Date Range Enumerations
     * @var object
     */
    DATE_RANGE_TYPES: {
        CUSTOM_DATE: 'CUSTOM_DATE',
        TODAY: 'TODAY',
        YESTERDAY: 'YESTERDAY',
        LAST_7_DAYS: 'LAST_7_DAYS',
        THIS_WEEK_SUN_TODAY: 'THIS_WEEK_SUN_TODAY',
        THIS_WEEK_MON_TODAY: 'THIS_WEEK_MON_TODAY',
        LAST_WEEK: 'LAST_WEEK',
        LAST_14_DAYS: 'LAST_14_DAYS',
        LAST_30_DAYS: 'LAST_30_DAYS',
        LAST_BUSINESS_WEEK: 'LAST_BUSINESS_WEEK',
        LAST_WEEK_SUN_SAT: 'LAST_WEEK_SUN_SAT',
        THIS_MONTH: 'THIS_MONTH'
    }
};

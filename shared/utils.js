var utils = {
    format: function () {
        var args = arguments;
        return args[0].replace(/{(\d+)}/g, function (match, number) {
            var index = parseInt(number) + 1;
            return typeof args[index] != 'undefined'
                ? args[index]
                : match;
        });
    }
};

exports.utils = utils;
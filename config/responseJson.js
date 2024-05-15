async function responseTrue(status, message, data) {
    return {
        status: status,
        message: message,
        data: data
    };
}

async function responseFalse(status, message, error) {
    return {
        status: status,
        message: message,
        error: error
    };
}

module.exports = { responseTrue, responseFalse };
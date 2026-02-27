const { logEvents } = require("./logger")

const errorHandler = (err, req, res, next) => {

    // Log error to file
    logEvents(
        `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin || 'No Origin'}`,
        'errLog.log'
    )

    // Log stack to console
    console.error(err.stack)

    // Set status code
    const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
    res.status(status)

    // Send JSON response
    res.json({ message: err.message })
}

module.exports = errorHandler

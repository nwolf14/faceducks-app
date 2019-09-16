let config = {};
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local-debug') {
    config = {
        nodemailer: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'oddjobs699@gmail.com',
                password: 'norbertpiotrek2018'
            }
        }
    };
}
else if (process.env.NODE_ENV === 'production') {
    config = {};
}
module.exports = { config };
//# sourceMappingURL=config.js.map
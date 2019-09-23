let config = {
    host: "http://localhost:6200",
    frontHost: "http://localhost:5000",
    nodemailer: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        authMethod: "OAuth2",
        auth: {
            type: "OAuth2",
            clientId: "474684651576-kco95362ddtmscm6tagvmvf48arr1088.apps.googleusercontent.com",
            clientSecret: "MCKLk8SXGDswmQHshb05aSlq",
            user: "nwolf960@gmail.com",
            refreshToken: "1/jVVdG94liLNdmA0RToQZTvlGcW0T2394LfOtFlp6DdI",
            accessToken: "ya29.GluIB8YRx4z-hQrQgRDXn60SGqMxsYyvyscLCMADmuopiu2Lohbw_GEGgLTjw67ibezBSUMZWjE3syTRjzbJpHY5BKbK2JPnMZz-LPeSYdM0r9SYmahwoUUYCLPT",
            expires: 3420000
        }
    }
};
if (process.env.NODE_ENV === "development") {
    config.host = "http://localhost:6200";
    config.frontHost = "http://localhost:3100";
}
if (process.env.NODE_ENV === "local-debug") {
    config.host = "http://localhost:5100";
    config.frontHost = "http://localhost:3100";
}
module.exports = Object.assign({}, config);
//# sourceMappingURL=index.js.map
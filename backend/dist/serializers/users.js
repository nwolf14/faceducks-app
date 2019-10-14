"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getByUserNameSerializer(user) {
    const { userName, id } = user;
    return {
        userName,
        id
    };
}
module.exports.getByUserNameSerializer = getByUserNameSerializer;
//# sourceMappingURL=users.js.map
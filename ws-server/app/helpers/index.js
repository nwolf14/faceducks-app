function case_insensitive_comp(strA, strB) {
  return strA.toLowerCase().localeCompare(strB.toLowerCase());
}

function htmlEntities(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function creatMessagesKeyForTwoUsers(userOne, userTwo) {
  const users = userOne.concat(userTwo);
  let usersKey = users.split("");
  usersKey = usersKey.sort();
  usersKey = usersKey.sort(case_insensitive_comp);
  return usersKey.join("");
}

module.exports = { creatMessagesKeyForTwoUsers, htmlEntities };

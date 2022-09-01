function checkIfStringIsUUID4(string) {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(string);
}

function arraysHaveSameElements(array1, array2) {
    if (array1.length === array2.length) {
      return array1.every(element => {
        if (array2.includes(element)) {
          return true;
        }
        return false;
      });
    }
    return false;
}

module.exports = {
    checkIfStringIsUUID4,
    arraysHaveSameElements,
};

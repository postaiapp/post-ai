const capitalize = (str: string | null) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : null;

const getFormattedName = (userName: string): [string | null, string | null] => {
    const nameParts = userName.split(' ') || [];
    const firstName = capitalize(nameParts[0]);
    const lastName = capitalize(nameParts[1] || null);
    return [firstName, lastName];
};

export { capitalize, getFormattedName };

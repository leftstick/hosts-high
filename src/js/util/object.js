

export function eraseGetter(obj) {
    return obj && JSON.parse(JSON.stringify(obj));
}

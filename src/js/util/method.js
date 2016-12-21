
export function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const _this = this,
            args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(_this, args);
            }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(_this, args);
        }
    };
}

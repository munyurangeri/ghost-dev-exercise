export function html([first, ...strings], ...values) {
    return values
        .reduce((acc, curr) => acc.concat(curr, strings.shift()), [first])
        .filter(x => x && x !== true || x === 0)
        .join("");
};

// export add
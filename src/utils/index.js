/**
 * Helper function to sort an array of objects by chosen key
 */
export const sort = (arr, key, ignoreThe) => {
    try {
        arr.sort(function(a, b) {
            if (key) {
                a = a[key];
                b = b[key];
            }

            if (ignoreThe) {
                a = noThe(a);
                b = noThe(b);
            }

            if (a.toLowerCase() < b.toLowerCase()) {
                return -1;
            }

            if (a.toLowerCase() > b.toLowerCase()) {
                return 1;
            }

            return 0;
        });

        return arr;

    } catch (err) {
        console.log('sort failed', arr, key);
    }
}

const noThe = (str) => {
    if (typeof str === 'string') {
        const pieces = str.split(' ');
        
        if (pieces.length) {
            if (pieces[0].toLowerCase() === 'the') {
                pieces.shift();
                return pieces.join(' ');
            }
        }
    }

    return str;
}

/**
 * Group a list of song objects by the first letter of each title
 */
export const alphaGroup = (arr, key, ignoreThe) => {
    // first sort
    sort(arr, key, ignoreThe);

    const items = arr.reduce((acc, cur) => {
        let firstLetter = key ? cur[key][0] : cur[0];
        if (Number.isInteger(parseInt(firstLetter, 10))) {
            firstLetter = '#';
        }
        firstLetter = firstLetter.toUpperCase();

        return { ...acc, [firstLetter]: [...(acc[firstLetter] || []), cur] };
    }, {});

    const grouped = Object.keys(items).map((letter) => {
        return {
            letter: letter,
            items: items[letter]
        }
    });

    return grouped;
}

export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const shuffle = (arr) => { 
    for (let i = arr.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [arr[i], arr[j]] = [arr[j], arr[i]]; 
    }

    return arr; 
}

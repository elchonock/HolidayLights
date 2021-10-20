function getRandomColor() {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
    const color = [];
    let colorStr;
    for (let i = 0; i<6; i++) {
        color.push(digits[Math.floor((Math.random() * (digits.length)))]);
    }
    colorStr = color.join('');
    return '#' + colorStr;    
}

export {getRandomColor};
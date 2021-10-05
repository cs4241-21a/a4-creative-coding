var body = document.body,
    r = document.querySelector('#r'),
    g = document.querySelector('#g'),
    b = document.querySelector('#b'),
    a = document.querySelector('#a'),
    outputR = document.querySelector('#outputR'),
    outputG = document.querySelector('#outputG'),
    outputB = document.querySelector('#outputB'),
    outputA = document.querySelector('#outputA'),
    hexVal_out = document.querySelector('#hexVal');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.strokeStyle = 'rgb(42,42,42)';
ctx.strokeRect(1, 1, 540, 300);
ctx.fillStyle = '#ffffffff';
ctx.fillRect(1, 1, 540, 300);

function setColor() {
    ctx.fillStyle = '#ffffffff';
    ctx.fillRect(1, 1, 540, 300);
    ctx.fillStyle = 'rgba(' + r.value + ',' + g.value + ',' + b.value + ',' + a.value/100 + ')';
    ctx.fillRect(1, 1, 540, 300);
    hexVal_out.value = hexVal();
}

function hexVal() {
    var r_hexVal = parseInt(r.value).toString(16),
        g_hexVal = parseInt(g.value).toString(16),
        b_hexVal = parseInt(b.value).toString(16),
        a_hexVal = alphaMath();
    return '#' + pad(r_hexVal) + pad(g_hexVal) + pad(b_hexVal) + pad(a_hexVal);
}

function alphaMath() {
    var baseTen = parseInt(255 * parseInt(a.value) / 100);
    return baseTen.toString(16);
}

function pad(n) {
    return (n.length < 2) ? '0' + n : n;
}

r.addEventListener('input', function () {
    setColor();
    outputR.value = r.value;
}, false);

g.addEventListener('input', function () {
    setColor();
    outputG.value = g.value;
}, false);

b.addEventListener('input', function () {
    setColor();
    outputB.value = b.value;
}, false);

a.addEventListener('input', function () {
    setColor();
    outputA.value = a.value;
}, false);
var scor;
var N;

function rand(a, b) {
    return Math.floor(a + Math.random() * (b - a));
}

function start_joc() {
    N = 20;
    scor = 0;
    vect_obiecte = new Array();
    var w = 30;
    var h = 30;
    var x = rand(0, parseInt(canv.width) - w);
    var y = rand(0, parseInt(canv.height) - h);
    var src = "prajitura.png";
    for (var i = 0; i < N; i++) {
        var zindex = i;
        var ob_img = new ObiectJoc(src, x, y, w, h, zindex);
        vect_obiecte.push(ob_img);
    }

    psj = new Personaj("img.png", 100, 100, 30, 30);
    setInterval(drow, 50);
   var drowPraji= setInterval(function () {
        for (var i = 0; i < N; i++) {
            var zindex = i;
            var ob_img = new ObiectJoc(src, x, y, w, h, zindex);
            vect_obiecte.push(ob_img);
        }
    }, 10000);
    
}

function stop_joc() {
    N = 0;
}

window.onload = function () {
    canv = document.getElementById("canv");
    ctx = canv.getContext("2d");
    v_img = new Array();
    $.get('imagini.xml', function (data) {
        var imagini = data.getElementsByTagName("imagine");
        nr_de_incarcat = imagini.length;
        for (var i = 0; i < imagini.length; ++i) {
            var e = document.createElement("img");
            v_img.push(e);
            e.src = imagini[i].getElementsByTagName("src")[0].textContent;
            e.width = imagini[i].getElementsByTagName("width")[0].textContent;
            e.height = imagini[i].getElementsByTagName("height")[0].textContent;
        }
    });
}

function ObiectJoc(src, x, y, w, h, zindex) {
    this.src = src;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.miscare_continua = true;
    this.zindex = zindex;
    var xf = rand(0, parseInt(canv.width - w));
    var yf = rand(0, parseInt(canv.height - h));
    init_miscare(this, x, y, xf, yf, 20);
}

function init_miscare(ob, left_i, top_i, left_f, top_f, nr_pasi) {
    var DLeft = left_f - left_i;
    var DTop = top_f - top_i;
    var dleft = DLeft / nr_pasi;
    var dtop = DTop / nr_pasi;
    var top_r = top_i;
    var left_r = left_i;
    misca(ob, top_r, left_r, 1, nr_pasi, dleft, dtop, left_f, top_f);
}

function misca(ob, top_r, left_r, pas_c, nr_pasi, dleft, dtop, left_f, top_f) {
    if (pas_c < nr_pasi) {
        top_r += dtop;
        left_r += dleft;
        ob.y = (Math.round(top_r));
        ob.x = (Math.round(left_r));
        pas_c++;
        setTimeout(function () {
            misca(ob, top_r, left_r, pas_c, nr_pasi, dleft, dtop, left_f, top_f);
        }, 50);
    } else {
        ob.y = top_f;
        ob.x = left_f;
        if (ob.miscare_continua) {
            xf = rand(0, parseInt(canv.width) - ob.w);
            yf = rand(0, parseInt(canv.height) - ob.h);
            init_miscare(ob, ob.x, ob.y, xf, yf, 20);
        }
    }
}

function drow() {
    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.beginPath();
    for (var i = 0; i < vect_obiecte.length; i++) {
        if (coliziune(vect_obiecte[i], psj)) {
            vect_obiecte.splice(i, 1);
            i--;
            scor++;
            document.getElementById("scor").innerHTML = "Scor: "+scor;
        } else {
            ctx.drawImage(v_img[1], vect_obiecte[i].x, vect_obiecte[i].y);
        }
    }
    ctx.drawImage(v_img[0], psj.x, psj.y);
    ctx.closePath();
}

function coliziune(ob1, ob2) {
    if (ob1.x <= ob2.x + ob2.w && ob2.x + ob2.w <= ob1.x + ob1.w) {
        if (ob1.y <= ob2.y && ob2.y <= ob1.y + ob1.h) {
            return true;
        }
        if (ob1.y <= ob2.y + ob2.h && ob2.y + ob2.h <= ob1.y + ob1.h) {
            return true;
        }
    }
    if (ob1.x <= ob2.x && ob2.x <= ob1.x + ob1.w) {
        if (ob1.y <= ob2.y && ob2.y <= ob1.y + ob1.h) {
            return true;
        }
        if (ob1.y < ob2.y + ob2.h && ob2.y + ob2.h <= ob1.y + ob1.h) {
            return true;
        }
    }
    if (ob2.x <= ob1.x + ob1.w && ob1.x + ob1.w <= ob2.x + ob2.w) {
        if (ob2.y <= ob1.y && ob1.y <= ob2.y + ob2.h) {
            return true;
        }
        if (ob2.y <= ob1.y + ob1.h && ob1.y + ob1.h <= ob2.y + ob2.h) {
            return true;
        }
    }
    if (ob2.x <= ob1.x && ob1.x <= ob2.x + ob2.w) {
        if (ob2.y <= ob1.y && ob1.y <= ob2.y + ob2.h) {
            return true;
        }
        if (ob2.y < ob1.y + ob1.h && ob1.y + ob1.h <= ob2.y + ob2.h) {
            return true;
        }
    }
    return false;
}

function Personaj(src, x, y, w, h) {
    this.src = src;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function handler(e) {
    var code = e.keyCode;
    //sus
    if (code == 38) {
        psj.y -= 20;
    }
    // jos
    if (code == 40) {
        psj.y += 20;
    }
    // dreapta
    if (code == 39) {
        psj.x += 20;
    }
    // stanga
    if (code == 37) {
        psj.x -= 20;
    }
}
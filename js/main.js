let pr = ""

let poses;
$.getJSON(`${pr}json/poses.json`, (data) => { poses = data });

let bgs;
$.getJSON(`${pr}json/bgs.json`, (data) => { bgs = data });

let pos = "11";
let posattr = "t";
let outf = "";

let instances = 1;
let chosenbg = "house";
let bgeffect = "dissolve_scene";
let resultmode = "chr";

$(() => {
    characterselect.innerHTML = null;
    $("#characterselect").on('change', () => {
        reset(); updatemenus();
        openbodymenubutton.innerHTML = "Body Menu";
        openheadmenubutton.innerHTML = "Head Menu";
    })
    for (x = 0; x < Object.keys(poses).length; x++) {
        elem = document.createElement("option");
        elem.innerHTML = Object.keys(poses)[x];
        characterselect.append(elem);
    }
    updatemenus();
})

function updateresult() {
    if (resultmode == "chr") {
        if (openbodymenubutton.innerHTML != "Body Menu") {
            if (poses[characterselect.value].headmap[openbodymenubutton.innerHTML] == "default") {
                resulttext.value = ("show " + characterselect.value + " " + openbodymenubutton.innerHTML + outf + openheadmenubutton.innerHTML + " at " + posattr + pos).replace(/undefined|Head Menu/, "");
            } else {
                resulttext.value = ("show " + characterselect.value + " " + openbodymenubutton.innerHTML + outf + ((poses[characterselect.value].headmap[openbodymenubutton.innerHTML] == null) ? '' : (poses[characterselect.value].headmap[openbodymenubutton.innerHTML] == "default") ? openheadmenubutton.innerHTML : poses[characterselect.value].headmap[openbodymenubutton.innerHTML][openheadmenubutton.innerHTML]) + " at " + posattr + pos).replace(/undefined|Head Menu/, "");
            }
        } else { clearresult(); }
    } else {
        resulttext.value = `scene bg ${chosenbg} with ${bgeffect}`
    }
}

function updatepreview() {
    changehead(characterselect.value, openheadmenubutton.innerHTML);
    changebody(characterselect.value, openbodymenubutton.innerHTML, outf);
}

function addheadcard(character, head) {
    console.log("\n");
    console.log(`%cAdding head ${head} for ${character}...`, "padding: 5px; color: white; background-color: red; border-radius: 5px 5px 0 0;")
    var div = document.createElement("div");
    div.className = "menuitem headmenuitem";
    div.id = head + "_head";
    div.onclick = function () { choosehead(this); };
    img = document.createElement("img");
    img.src = pr + "images/" + character + "/" + head + ".png";
    img.style.objectPosition = "-" + poses[character].headposition.x + " -" + poses[character].headposition.y;
    txt = document.createElement("p");
    txt.innerHTML = head;
    div.append(img);
    div.append(txt);
    headmenu.append(div);
    div = null;
    console.log(`%cAdded head ${head}`, "padding: 5px; color: white; background-color: red; border-radius: 0 0 5px 5px;")
}

function addbodycard(character, body) {
    console.log("\n");
    console.log(`%cAdding body ${body} for ${character}...`, "background-color: blue; padding: 5px; color: white; border-radius: 5px 5px 0 0");
    var div = document.createElement("div");
    div.className = "menuitem bodymenuitem";
    div.onclick = function () { choosebody(this); };
    if (Array.isArray(poses[character].body[body])) {
        console.log(`%cBody ${body} has 2 elements inside: ${poses[character].body[body][0]} and ${poses[character].body[body][1]}`, "background-color: darkblue; padding: 5px; color: white; border-radius: 0 5px 5px 0;");
        imgleft = document.createElement("img");
        imgright = document.createElement("img");
        imgleft.draggable = false;
        imgright.draggable = false;
        imgleft.src = pr + "images/" + character + "/" + poses[character].body[body][0] + "l" + ".png";
        imgright.src = pr + "images/" + character + "/" + poses[character].body[body][1] + "r" + ".png";
        div.append(imgleft);
        div.append(imgright);
        div.id = "body";
    } else {
        console.log(`%cBody ${body} has 1 element inside: ${poses[character].body[body]}`, "background-color: darkblue; padding: 5px; color: white; border-radius: 0 5px 5px 0;")
        img = document.createElement("img");
        img.src = pr + "images/" + character + "/" + poses[character].body[body] + ".png";
        div.append(img);
        div.id = "body ns";
    }
    txt = document.createElement("p");
    txt.innerHTML = body;
    div.append(txt);
    bodymenu.append(div);
    div = null;
    console.log(`%cAdded body ${body}`, "background-color: blue; padding: 5px; color: white; border-radius: 0 0 5px 5px;");
}

function addoutfitcard(character, outfit) {
    console.log("\n");
    console.log(`%cAdding outfit ${outfit} for ${character}...`, "background-color: green; padding: 5px; color: white; border-radius: 5px 5px 0 0");
    var div = document.createElement("div");
    div.className = "menuitem outfitmenuitem";
    div.onclick = function () { chooseoutfit(outfit); };
    imgleft = document.createElement("img");
    imgright = document.createElement("img");
    imgleft.src = pr + "images/" + character + "/" + poses[character].body[Object.keys(poses[character].body)[0]][0] + poses[character].outfit[outfit] + "l" + ".png";
    imgright.src = pr + "images/" + character + "/" + poses[character].body[Object.keys(poses[character].body)[0]][1] + poses[character].outfit[outfit] + "r" + ".png";
    div.append(imgleft);
    div.append(imgright);
    txt = document.createElement("p");
    txt.innerHTML = outfit;
    div.append(txt);
    outfitmenu.append(div);
    div = null;
    console.log(`%cAdded outfit ${outfit}`, "background-color: green; padding: 5px; color: white; border-radius: 0 0 5px 5px");
}

function addbgcard(bg) {
    console.log("\n");
    console.log(`%cAdding background ${bg}...`, "padding: 5px; color: white; background-color: red; border-radius: 5px 5px 0 0;")
    var div = document.createElement("div");
    div.className = "menuitem bgmenuitem";
    div.id = bg + "_bg";
    div.onclick = function () { changeBg(bg); togglemenu('bg'); };
    img = document.createElement("img");
    img.src = `${pr}images/bg/${bg}.png`;
    txt = document.createElement("p");
    txt.innerHTML = bgs[bg];
    div.append(img);
    div.append(txt);
    bgcontainer.append(div);
    div = null;
    console.log(`%cAdded background ${bg}`, "padding: 5px; color: white; background-color: red; border-radius: 0 0 5px 5px;")
}

function updatemenus() {
    headmenu.innerHTML = null;
    /* for (y = 0; y < poses[characterselect.value].head.length; y++) {
        addheadcard(characterselect.value, y)
    } */
    bodymenu.innerHTML = null;
    for (z = 0; z < Object.keys(poses[characterselect.value].body).length; z++) {
        addbodycard(characterselect.value, Object.keys(poses[characterselect.value].body)[z])
    }

    console.log("\n");
    console.log("%cUpdated body menu with character data", "background-color: orange; padding: 5px; color: white; border-radius: 5px;");
    outfitmenu.innerHTML = null;
    for (y = 0; y < Object.keys(poses[characterselect.value].outfit).length; y++) {
        addoutfitcard(characterselect.value, Object.keys(poses[characterselect.value].outfit)[y])
    }
    console.log("\n");
    console.log("%cUpdated outfit menu with character data", "background-color: orange; padding: 5px; color: white; border-radius: 5px;");
    bgcontainer.innerHTML = null;
    for (x = 0; x < Object.keys(bgs).length; x++) {
        addbgcard(Object.keys(bgs)[x]);
    }
    console.log("\n");
    console.log("%cUpdated background menu with data", "background-color: orange; padding: 5px; color: white; border-radius: 5px;");
}

function changehead(character, headname) {
    head.src = pr + "images/" + character + "/" + headname + ".png";
}

function changebody(character, bodyname, outfit) {
    if (Array.isArray(poses[character].body[bodyname])) {
        bodyleft.src = pr + "images/" + character + "/" + poses[character].body[bodyname][Object.keys(poses[character].body[bodyname])[0]] + outfit + "l" + ".png";
        bodyright.src = pr + "images/" + character + "/" + poses[character].body[bodyname][Object.keys(poses[character].body[bodyname])[1]] + outfit + "r" + ".png";
    } else {
        bodyleft.src = pr + "images/" + character + "/" + poses[character].body[bodyname] + outfit + ".png";
        bodyright.src = pr + "images/default.png";
    }
}

function togglemenu(menu) {
    if ($(`#${menu}menu`).css("top") == '0px') {
        $(`#${menu}menu`).animate({ top: '100vh' });
    } else {
        $(`#${menu}menu`).animate({ top: '0vh' });
    }
}

function choosehead(sender) {
    openheadmenubutton.innerHTML = sender.childNodes[1].innerHTML;
    togglemenu('head');
    changehead(characterselect.value, openheadmenubutton.innerHTML)
    updateresult();
}

function choosebody(sender) {
    openheadmenubutton.disabled = false;
    var previousbody = openbodymenubutton.innerHTML;
    if (sender.id == "body") {
        openbodymenubutton.innerHTML = sender.childNodes[2].innerHTML;
    } else {
        openbodymenubutton.innerHTML = sender.childNodes[1].innerHTML;
    }
    togglemenu('body');
    if (poses[characterselect.value].headmap[previousbody] != poses[characterselect.value].headmap[openbodymenubutton.innerHTML]) {
        head.src = pr + "images/default.png";
        openheadmenubutton.innerHTML = "Head Menu";
    }
    if (poses[characterselect.value].outfitexclude != null) {
        if (poses[characterselect.value].outfitexclude.includes(openbodymenubutton.innerHTML)) {
            outf = '';
            openoutfitmenubutton.disabled = true;
        } else {
            openoutfitmenubutton.disabled = false;
        }
    }
    changebody(characterselect.value, openbodymenubutton.innerHTML, outf);
    headmenu.innerHTML = null;
    if (poses[characterselect.value].headmap[openbodymenubutton.innerHTML] == "default") {
        for (x = 0; x < poses[characterselect.value].head.length; x++) {
            addheadcard(characterselect.value, poses[characterselect.value].head[x])
        }
    } else if (poses[characterselect.value].headmap[openbodymenubutton.innerHTML] == null) {
        openheadmenubutton.disabled = true;
        head.src = pr + "images/default.png";
    } else {
        for (y = 0; y < Object.keys(poses[characterselect.value].headmap[openbodymenubutton.innerHTML]).length; y++) {
            addheadcard(characterselect.value, Object.keys(poses[characterselect.value].headmap[openbodymenubutton.innerHTML])[y])
        }
    }
    console.log("\n");
    console.log("%cUpdated head menu with character data", "background-color: orange; padding: 5px; color: white; border-radius: 5px;");
    updateresult();
}

function chooseoutfit(outfit) {
    outf = poses[characterselect.value].outfit[outfit];
    togglemenu('outfit');
    updateresult();
    updatepreview();
}

function clearpreview() {
    head.src = pr + "images/default.png";
    bodyleft.src = pr + "images/default.png";
    bodyright.src = pr + "images/default.png";
    outf = '';
}

function clearresult() {
    resulttext.value = "Choose body and head to see the result";
}

function reset() {
    clearpreview();
    clearresult();
    openoutfitmenubutton.disabled = false;
}

function newInstance() {
    if (instances <= 4) {
        instances += 1;
        var instance = document.createElement("iframe");
        instance.src = "index.html";
        instancesDiv.append(instance);
    }
}

function changeBg(bg) {
    background.src = `${pr}images/bg/${bg}.png`;
    chosenbg = bgs[bg];
    updateresult();
}
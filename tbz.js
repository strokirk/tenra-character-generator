var db = {
    'body': ['Unarmed Combat', 'Wormcharm'],
    'agility': ['Movement', 'Melee Weapons', 'Evasion', 'Stealth', 'Ninjutsu', 'Criminal Arts'],
    'senses': ['First aid', 'Notice', 'Marksman', 'Pursuit/Hunt', 'Forgery'],
    'knowledge': ['Information', 'Onmyoujutsu'],
    'spirit': ['Willpower', 'Resonance', 'Interface', 'Buddhist Magic'],
    'empathy': ['Persuation', 'Pillow Arts', 'Perform'],
    'station': ['Strategy', 'Etiquette', 'Shinto', 'Art of Rule']
}
var ranks = {
    'Movement': 1,
    'Melee Weapons': 1,
    'Evasion': 1,
    'Stealth': 1,
    'Unarmed Combat': 1,
    'First aid': 1,
    'Notice': 1,
    'Marksman': 1,
    'Pursuit/Hunt': 1,
    'Information': 1,
    'Willpower': 1,
    'Persuation': 1,
    'Pillow Arts': 1
};

$('.label').each(function( index ) {
    var name = $(this).text().toLowerCase();
    if (name in db) {
        var dbi = db[name];
        for (item in dbi) {
            var tr = $('<tr><td class="label">'+dbi[item]+'</td><td class="ranks"></td></tr>');
            tr.children('.ranks').data('skill', dbi[item]);
            $(this).closest('tbody').append(tr);
            $(this).parent('tr').addClass(name);
            $(this).closest('table').addClass(name);
            $(this).closest('table').closest('tr').addClass(name);
        }
    }
} );

function resetRanks(ranksDiv) {
    ranksDiv = $(ranksDiv);
    if (ranksDiv.data('skill') in ranks) {
        ranksDiv.data('value', ranks[ranksDiv.data('skill')]);
    }
    var value = ranksDiv.data('value');
    var divs = $(ranksDiv).children();
    for (var i = 0, len = divs.length; i < len; i++) {
        var elm = $(divs[i]);
        if (elm.data('rank') <= value) {
            elm.addClass('rank-filled');
        } else {
            elm.removeClass('rank-filled');
        }
    }
}
function hoverRanks(div) {
    div = $(div);
    div.prevAll().addClass('rank-filled');
    div.addClass('rank-filled');
    div.nextAll().removeClass('rank-filled');
}
function setRanks(ranksDiv, div) {
    var skill = $(ranksDiv).data('skill')
    var rank = $(div).data('rank');
    if (ranks[skill] == rank) {
        rank = rank - 1;
    }
    ranks[skill] = rank;
    resetRanks(ranksDiv);
}

$('#attribute-tables').find('input').each( function() {
    $(this).addClass('unfilled');
    $(this).bind('input', function() {$(this).removeClass('unfilled'); if (!(this.value)) $(this).addClass('unfilled');});
});
$('.ranks').each(function(e, i, a) {
    var that = this;
    var elm = $(this);
    var skill = elm.data('skill');
    if (!skill) { }
    if (skill && ranks[skill]) {
        elm.data('value', ranks[skill])
    } else {
        elm.data('value', 0);
    }
    for (var i = 0; i < 5; i++) {
        var div = $('<div class="rank"/>');
        div.data('rank', i + 1)
        var handlerIn = function(evt) { hoverRanks(this) };
        var handlerOut = function(evt) { resetRanks(that) };
        var handlerClick = function(evt) { setRanks(that, this) };
        div.hover(handlerIn, handlerOut);
        div.click(handlerClick);
        $(that).append(div);
        resetRanks(that);
    }
})

function setWounds(span) {
    if ($(span).hasClass("wound-level-max")) {
        $(span).removeClass("wound-level-max");
        $(span).removeClass("i-wound-filled");
        $(span).addClass("i-wound");
        $(span).prev().addClass("wound-level-max");
    } else {
        $(span).siblings().removeClass("wound-level-max");
        $(span).addClass("wound-level-max");
        $(span).addClass("i-wound-filled");
        $(span).prevAll("span").addClass("i-wound-filled")
        $(span).nextAll("span").removeClass("i-wound-filled");
    }
}

(function(){
    'use strict';
    function makeSpan() {
        var span = $('<span class="i-wound"></span>');
        var handlerClick = function() { setWounds(this) };
        span.click(handlerClick);
        return span;
    }
    function fillWithSpans(elm, num) {
        elm = $(elm);
        elm.html("")
        for (var i = 0; i < num; i++) { elm.prepend(makeSpan()) }
    }
    fillWithSpans($('#light div'), 10)
    fillWithSpans($('#heavy div'), 5)
    fillWithSpans($('#critical div'), 3)
    fillWithSpans($('#dead div'), 1)
})();


// choose

// name
// description
// image
// archetypes
// -- add together karma, attribute penalty, weapons, special abilities, skills etc



//


// Saving and loading
var saved_ids = ["name", "body", "agility", "spirit", "station", "knowledge", "empathy", "senses", "notes", "concept", "description", "archetypes", "soul", "vitality"];

function saveCharacterToLocal() {
    'use strict';
    console.log("Saving.");
    var characterObject = {};
    for (var i = 0, len = saved_ids.length; i < len; i++) {
        characterObject[saved_ids[i]] = $('#'+saved_ids[i]).val();
    }
    characterObject['skills'] = {};
    for (var rank in ranks) {
        characterObject['skills'][rank] = ranks[rank];
    }
    var json_char = JSON.stringify(characterObject);
    localStorage.setItem("saved-tenra-character", json_char);
}

function loadCharacterFromLocal() {
    'use strict';
    console.log("Loading.");
    var characterString = localStorage.getItem("saved-tenra-character");
    if (characterString) {
        console.log(characterString);
        var characterObject = JSON.parse(characterString);
        console.log(characterObject);
        var attr, skill;
        for (skill in characterObject['skills']){
            if (characterObject['skills'].hasOwnProperty(skill)) {
                ranks[skill] = characterObject['skills'][skill];
            }
        }
        for (attr in characterObject){
            if (characterObject.hasOwnProperty(attr)) {
                var elem = $('#'+attr);
                if (elem.length) {
                    elem.val(characterObject[attr]);
                    if (characterObject[attr]) elem.removeClass("unfilled");
                }
            }
        }
    }
    console.log("Loading complete. Updating.");
    $('.ranks').each( function() {resetRanks(this)} );
}

function calcSecondaryAttributes() {
    var body = $("#body").val();
    var spirit = $("#spirit").val();
    var knowledge = $("#knowledge").val();
    if (body && spirit) {
        var vitality = parseInt(body) + parseInt(spirit);
        $("#vitality").val(vitality);
    }
    if (knowledge && spirit) {
        var soul = (parseInt(spirit) + parseInt(knowledge)) * 2;
        $("#soul").val(soul);
    }
    if (body) {
        var rounddiv = function(val, div) { return Math.max(Math.ceil(parseInt(body) / div, 10), 1); }
        $("#light-wounds").val(rounddiv(body, 1));
        $("#heavy-wounds").val(rounddiv(body, 2));
        $("#critical-wounds").val(rounddiv(body, 4));
        $("#dead-wounds").val(1);
    }
}

console.log("Binding save/load handlers.");
$('#save').click( saveCharacterToLocal );
$('#load').click( loadCharacterFromLocal );
$('#calc').click( calcSecondaryAttributes );

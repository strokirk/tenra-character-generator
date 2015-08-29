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
            $(this).closest('tbody').append(tr);
            $(this).parent('tr').addClass(name);
            $(this).closest('table').addClass(name);
            $(this).closest('table').closest('tr').addClass(name);
        }
    }
} );

function setRanks(div) {
    var skill = $(div).parent().prev().text();
    if (!(skill in ranks)) ranks[skill] = 0;

    var rank = $(div).attr('rank');
    if (ranks[skill] < rank) {
        $(div).removeClass('rank-filled');
    } else {
        $(div).addClass('rank-filled');
    }
}
function setRanks2(div) {
    div = $(div);
    var skill = div.parent().prev().text();
    var rank = div.attr('rank');
    if (ranks[skill] == rank) {
        ranks[skill] = rank - 1;
        var skill = div.parent().prev().text();
        div.removeClass('rank-filled');
    } else {
        ranks[skill] = rank;
        var nextSiblings = div.nextAll();
        var leftSiblings = div.prevAll();
        div.addClass('rank-filled');
        div.prevAll().addClass('rank-filled');
        div.nextAll().removeClass('rank-filled');
    }
}
$('#attribute-tables').find('input').each( function() {
    $(this).addClass('unfilled');
    $(this).bind('input', function() {$(this).removeClass('unfilled'); if (!(this.value)) $(this).addClass('unfilled');});
});
$('.ranks').each(function(index) {
    for (var i = 0; i < 5; i++) {
        var div = $('<div class="rank" rank="' + (i + 1) + '"/>');
        var handlerIn = function() { setRanks(this) };
        var handlerOut = function() { setRanks(this) };
        var handlerClick = function() { setRanks2(this) };
        div.hover(handlerIn, handlerOut);
        div.click(handlerClick);
        $(this).append(div);
        setRanks(div);
    }
})

function setWounds(span) {
    if ($(span).hasClass(".wound-level-max")) {
        $(span).text("☐");
        $(span).removeClass(".wound-level-max");
        $(span).prev().addClass(".wound-level-max");
    } else {
        $(span).siblings().removeClass(".wound-level-max");
        $(span).addClass(".wound-level-max");
        $(span).text("☒");
        $(span).prevAll("span").text("☒");
        $(span).nextAll("span").text("☐");
    }
}

(function(){
    'use strict';
    function makeSpan() {
        var span = $("<span>☐</span>");
        var handlerClick = function() { setWounds(this) };
        span.click(handlerClick);
        return span;
    }
    for (var i = 0; i < 10; i++) { $('#light div').prepend(makeSpan()) }
    for (var i = 0; i < 5; i++)  { $('#heavy div').prepend(makeSpan()) }
    for (var i = 0; i < 3; i++)  { $('#critical div').prepend(makeSpan()) }
    for (var i = 0; i < 1; i++)  { $('#dead div').prepend(makeSpan()) }
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
    $('div.rank').each( function() {setRanks(this)} );
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
        $("#light-wounds").val(Math.max(parseInt(body) / 1, 1));
        $("#heavy-wounds").val(Math.max(parseInt(body) / 2, 1));
        $("#critical-wounds").val(Math.max(parseInt(body) / 4, 1));
        $("#dead-wounds").val(1);
    }
}

console.log("Binding save/load handlers.");
$('#save').click( saveCharacterToLocal );
$('#load').click( loadCharacterFromLocal );
$('#calc').click( calcSecondaryAttributes );

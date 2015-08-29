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
$('.ranks').each( function( index ) {
    for (var i = 0; i < 5; i++) {
        var div = $('<div class="rank" rank="'+(i+1)+'"/>');
        var handlerIn = function(){setRanks(this)};
        var handlerOut = function(){setRanks(this)};
        var handlerClick = function(){setRanks2(this)};
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
var saved_ids = ["name", "body", "agility", "spirit", "station", "knowledge", "empathy", "senses", "notes", "concept", "description", "archetypes"];

console.log(JSON.stringify);
function saveCharacterToLocal() {
    'use strict';
    console.log("Saving.");
    var characterObject = {};
    var characterString = "";
    for (var rank in ranks) {
        characterString += rank + "=" + ranks[rank] + ";";
    }
    if (characterString == "") characterString = ";;";
    else characterString += ";";
    for (var id in saved_ids) {
        characterString += saved_ids[id] + "=" + $('#'+saved_ids[id]).val() + ";";
    }
    localStorage.setItem("saved-tenra-character", characterString);
}

function loadCharacterFromLocal() {
    console.log("Loading.");
    var characterString = localStorage.getItem("saved-tenra-character");
    if (characterString) {
        console.log(characterString);
        var parts = characterString.split( /;;/ );
        var skills = parts[0].split( /(.*?=[0-5]);/ );
        for (var i in skills) {
            var skill = skills[i].split( /=/ );
            if (skill.length != 1) {
                // console.log(skill[0], skill[1]);
                ranks[skill[0]]=skill[1];
            }
        }
        var ids = parts[1].split( /(.*?=.*?);/ );
        for (var i in ids) {
            var id = ids[i].split( /=/ );
            if (id.length != 1) {
                console.log(ids[i]);
                $('#'+id[0]).val(id[1]);
                if (id[1] != "") $('#'+id[0]).removeClass("unfilled");
            }
        }
    }
    console.log("Loading complete. Updating.");
    $('div.rank').each( function() {setRanks(this)} );
}

console.log("Binding save/load handlers.");
$('#save').click( saveCharacterToLocal );
$('#load').click( loadCharacterFromLocal );

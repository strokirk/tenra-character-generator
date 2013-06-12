
var db = {   'body': ['Unarmed Combat', 'Wormcharm'],
    'agility': ['Movement', 'Melee Weapons', 'Evasion', 'Stealth', 'Ninjutsu', 'Criminal Arts'],
    'senses': ['First aid', 'Notice', 'Marksman', 'Pursuit/Hunt', 'Forgery'],
    'knowledge': ['Information', 'Onmyoujutsu'],
    'spirit': ['Willpower', 'Resonance', 'Interface', 'Buddhist Magic'],
    'empathy': ['Persuation', 'Pillow Arts', 'Perform'],
    'station': ['Strategy', 'Etiquette', 'Shinto', 'Art of Rule']
}

var key;
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

$('.input').each( function( index ) {
    $(this).append( $('<input type="text"></input>') )
})
var ranks = {'Movement':1,'Melee Weapons':1,'Evasion':1,'Stealth':1,'Unarmed Combat':1,'First aid':1,'Notice':1,'Marksman':1,'Pursuit/Hunt':1,'Information':1,'Willpower':1,'Persuation':1,'Pillow Arts':1};
function setRanks(span) {
    var skill = $(span).parent().prev().text();
    if (!(skill in ranks)) ranks[skill] = 0;
    var rank = $(span).prevAll().length + 1;
    if (ranks[skill] < rank) $(span).text("○");
    else $(span).text("●");
}
function setRanks2(span) {
    var skill = $(span).parent().prev().text();
    var rank = $(span).prevAll().length + 1;
    ranks[skill] = rank;
    $(span).prevAll().each(function(){setRanks(this)});
}
$('.ranks').each( function( index ) {
    for (var i = 0; i < 5; i++) {
        var span = $('<span class="rank">○</span>');
        var handlerIn = function(){$(this).text("●")};
        var handlerOut = function(){setRanks(this)};
        var handlerClick = function(){setRanks2(this)};
        span.hover(handlerIn, handlerOut);
        span.click(handlerClick);
        $(this).append(span);
        setRanks(span);
    }
})
$('#attribute-tables').find('table').each( function(){
   var el = $(this);
   el.width( el.width() + 2);
   if ( el.next().length ) {
       console.log( el.next().width(), el.width() );
       if (el.next().width() > el.width()) {
           el.width( el.next().width() +2 );
       }
       el.next().width( el.width() +2 );
   }
})

var table = $("<table class='wounds'></table>");
var tr1 = $("<tr></tr>");
var tr2 = $("<tr></tr>");
var light = $("<td><br><label>Light</label></td>");
var heavy = $("<td><br><label>Heavy</label></td>");
var critical = $("<td><br><label>Critical</label></td>");
var dead = $("<td><br><label>Dead</label></td>");
tr1.append(light); tr1.append(heavy); tr2.append(critical); tr2.append(dead);
table.append(tr1);
table.append(tr2);
$(".wounds").append( table )
function setWounds(span) {
    if ($(span).hasClass(".wound-level-max")) {
        $(span).text("☐");
        $(span).removeClass(".wound-level-max");
        $(span).prev().addClass(".wound-level-max");
    } else {
        $(span).siblings().has(".wound-level-max").removeClass(".wound-level-max");
        $(span).addClass(".wound-level-max");
        $(span).text("☒");
        $(span).prevAll("span").text("☒");
        $(span).nextAll("span").text("☐");
    }
}
function makeSpan() { var span=$("<span>☐</span>"); var handlerClick = function(){setWounds(this)}; span.click(handlerClick); return span; }
for (var i=0;i<10;i++) { light.prepend(makeSpan()) }
for (var i=0;i<5;i++) { heavy.prepend(makeSpan()) }
for (var i=0;i<3;i++) { critical.prepend(makeSpan()) }
for (var i=0;i<1;i++) { dead.prepend(makeSpan()) }


// choose

// name
// description
// image
// archetypes
// -- add together karma, attribute penalty, weapons, special abilities, skills etc

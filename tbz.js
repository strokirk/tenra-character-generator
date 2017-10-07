'use strict';

let db = {
  'body': ['Unarmed Combat', 'Wormcharm'],
  'agility': ['Movement', 'Melee Weapons', 'Evasion', 'Stealth', 'Ninjutsu', 'Criminal Arts'],
  'senses': ['First aid', 'Notice', 'Marksman', 'Pursuit/Hunt', 'Forgery'],
  'knowledge': ['Information', 'Onmyoujutsu'],
  'spirit': ['Willpower', 'Resonance', 'Interface', 'Buddhist Magic'],
  'empathy': ['Persuation', 'Pillow Arts', 'Perform'],
  'station': ['Strategy', 'Etiquette', 'Shinto', 'Art of Rule'],
}
let ranks = {
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
  'Pillow Arts': 1,
};

document.querySelectorAll('th.label').forEach(function(elm, index) {
  let name = elm.textContent.toLowerCase();
  let tbody = elm.parentNode.parentNode
  if (name in db) {
    let dbi = db[name];
    for (let item in dbi) {
      let tr = document.createElement("tr")
      tr.innerHTML = '<td class="label">' + dbi[item] + '</td><td class="ranks"></td>'
      tr.querySelector('.ranks').setAttribute("data-skill", dbi[item])
      tbody.appendChild(tr)
    }
    elm.parentNode.classList.add(name);
    tbody.parentNode.classList.add(name);
  }
});

function resetRanks() {
  const div = this.parentNode
  const skill = div.getAttribute('data-skill')
  if (skill in ranks) {
    div.setAttribute('data-value', ranks[skill])
  }
  const value = div.getAttribute('data-value')
  let divs = div.children
  for (let i = 0, len = divs.length; i < len; i++) {
    let elm = divs[i];
    const rank = elm.getAttribute('data-rank')
    if (rank <= value) {
      elm.classList.add('rank-filled')
    } else {
      elm.classList.remove('rank-filled')
    }
  }
}

function hoverRanks(evt) {
  const elm = this
  const siblings = [].slice.call(elm.parentNode.children)
  const i = siblings.indexOf(elm) + 1
  for (const div of siblings.slice(0, i)) {
    div.classList.add("rank-filled")
  }
  for (const div of siblings.slice(i)) {
    div.classList.remove("rank-filled")
  }
}

function setRanks() {
  const div = this
  const skill = div.parentNode.getAttribute("data-skill")
  let rank = div.getAttribute('data-rank')
  if (ranks[skill] == rank) {
    rank = rank - 1
  }
  ranks[skill] = rank
  resetRanks.call(div)
}

document.getElementById('attribute-tables')
  .querySelectorAll('input')
  .forEach(function(elm) {
    elm.classList.add('unfilled');
    elm.addEventListener('input', function() {
      elm.classList.remove('unfilled');
      if (!(elm.value)) elm.classList.add('unfilled');
    })
  })

document.querySelectorAll('.ranks')
  .forEach(function(elm) {
    let newVal = 0
    let skill = elm.getAttribute('data-skill');
    if (skill && ranks[skill]) {
      newVal = ranks[skill]
    }
    elm.setAttribute('data-value', newVal);
    for (let i = 0; i < 5; i++) {
      let div = document.createElement("div")
      div.classList.add("rank")
      div.setAttribute('data-rank', i + 1)
      div.addEventListener("mouseenter", hoverRanks)
      div.addEventListener("mouseleave", resetRanks);
      div.addEventListener("click", setRanks);
      elm.appendChild(div);
      resetRanks.call(div);
    }
  })

function setWounds() {
  const span = this
  const siblings = [].slice.call(span.parentNode.children)
  const i = siblings.indexOf(span)
  if (span.classList.contains("wound-level-max")) {
    span.classList.remove("wound-level-max")
    span.classList.remove("i-wound-filled")
    span.classList.add("i-wound")
    const prev = siblings[i - 1]
    prev && prev.classList.add("wound-level-max");
  } else {
    siblings.forEach(function(elm) { elm.classList.remove("wound-level-max") })
    span.classList.add("wound-level-max");
    span.classList.add("i-wound-filled");
    for (const div of siblings.slice(0, i + 1)) {
      div.classList.add("i-wound-filled")
    }
    for (const div of siblings.slice(i + 1)) {
      div.classList.remove("i-wound-filled")
    }
  }
}

function makeSpan() {
  const span = document.createElement("span")
  span.classList.add("i-wound")
  span.addEventListener("click", setWounds)
  return span
}

function fillWithSpans(elm, num) {
  elm.innerHTML = ""
  for (let i = 0; i < num; i++) {
    elm.appendChild(makeSpan())
  }
}
fillWithSpans(document.querySelector('#light div'), 10)
fillWithSpans(document.querySelector('#heavy div'), 5)
fillWithSpans(document.querySelector('#critical div'), 3)
fillWithSpans(document.querySelector('#dead div'), 1)


// choose

// name
// description
// image
// archetypes
// -- add together karma, attribute penalty, weapons, special abilities, skills etc



//


// Saving and loading
let saved_ids = ["name", "body", "agility", "spirit", "station", "knowledge", "empathy", "senses", "notes", "concept",
  "description", "archetypes", "soul", "vitality",
];

function saveCharacterToLocal() {
  'use strict';
  console.log("Saving.");
  let characterObject = {};
  for (let i = 0, len = saved_ids.length; i < len; i++) {
    characterObject[saved_ids[i]] = document.getElementById(saved_ids[i]).value;
  }
  characterObject.skills = {};
  for (let rank in ranks) {
    characterObject.skills[rank] = ranks[rank];
  }
  let json_char = JSON.stringify(characterObject);
  localStorage.setItem("saved-tenra-character", json_char);
}

function loadCharacterFromLocal() {
  console.log("Loading.");
  let characterString = localStorage.getItem("saved-tenra-character");
  if (characterString) {
    console.log(characterString);
    let characterObject = JSON.parse(characterString);
    console.log(characterObject);
    let attr, skill;
    for (skill in characterObject.skills) {
      if (characterObject.skills.hasOwnProperty(skill)) {
        ranks[skill] = characterObject.skills[skill];
      }
    }
    for (attr in characterObject) {
      if (characterObject.hasOwnProperty(attr)) {
        let elem = document.getElementById(attr);
        if (elem) {
          elem.value = characterObject[attr];
          if (characterObject[attr]) elem.classList.remove("unfilled");
        }
      }
    }
  }
  console.log("Loading complete. Updating.");
  document.querySelectorAll('.ranks div').forEach(function(elm) {
    resetRanks.call(elm)
  })
}

function calcSecondaryAttributes() {
  let body = document.getElementById("body").value;
  let spirit = document.getElementById("spirit").value;
  let knowledge = document.getElementById("knowledge").value;
  if (body && spirit) {
    let vitality = parseInt(body) + parseInt(spirit);
    document.getElementById("vitality").value = vitality;
  }
  if (knowledge && spirit) {
    let soul = (parseInt(spirit) + parseInt(knowledge)) * 2;
    document.getElementById("soul").value = soul;
  }
  if (body) {
    let rounddiv = function(val, div) { return Math.max(Math.ceil(parseInt(body) / div, 10), 1); }
    document.getElementById("light-wounds").value = rounddiv(body, 1);
    document.getElementById("heavy-wounds").value = rounddiv(body, 2);
    document.getElementById("critical-wounds").value = rounddiv(body, 4);
    document.getElementById("dead-wounds").value = 1;
  }
}

console.log("Binding save/load handlers.");
document.getElementById('save').addEventListener("click", saveCharacterToLocal);
document.getElementById('load').addEventListener("click", loadCharacterFromLocal);
document.getElementById('calc').addEventListener("click", calcSecondaryAttributes);

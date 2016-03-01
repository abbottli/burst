var g, canvas; // canvas stuff
var visual, addmore; // intervals
var pills, words; // shape storage
var DRAWRATE = 16;
var color = [ // pretty colors
  '#69D2E7',
  '#1B676B',
  '#BEF202',
  '#EBE54D',
  '#00CDAC',
  '#1693A5',
  '#F9D423',
  '#FF4E50',
  '#E7204E',
  '#0CCABA',
  '#FF006F'
];
var AMP, SPEED, SPIN, SIZE, SCALE, GROW, NUM, DELAY, DIRECTION, TYPE, BOUNCE; // init var 
// AMP is amplitude of cos, determines how much shapes move side to side, the spread
// GROW is show as growing lines or just the shapes
var mouseX, mouseY;
var idx; // for words array

window.onload = function init() {
  document.getElementById('width').value = window.innerWidth;
  document.getElementById('height').value = window.innerHeight;
  start();
}

document.getElementById('shape').addEventListener('change', function () {
    document.getElementById('wordsOptions').style.display =
      this.value == "Words" ? 'block' : 'none';
});

function start() {
  stop();
  getCond();

  var pill;
  pills = [];

  canvas = document.getElementById('canvas')
  canvas.width = toNum(document.getElementById('width').value, window.innerWidth);
  canvas.height = toNum(document.getElementById('height').value, window.innerHeight);
  g = canvas.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0);

  if (TYPE == 'word') {
    words = document.getElementById('words').value != "" ?
            document.getElementById('words').value.split(" ") : ["butts"];
    idx = 0;
  }

  visual = window.setTimeout(draw, DRAWRATE);

  if (document.getElementById('mouse').checked) {
    document.addEventListener('mousemove', mouseMove, false);
    document.addEventListener('mousedown', mouseDown, false);
  } else {
    var st = DIRECTION == -1 ? canvas.height : 0;
    for (i = 0; i < NUM; i++) {
      pill = new Shape(round3(rand(0, canvas.width)), st);
      pills.push(pill);
    }
    addmore = window.setTimeout(moreP, DELAY * 1000);
  }
}

function stop() {
  window.clearTimeout(visual);
  window.clearTimeout(addmore);
  document.removeEventListener('mousemove', mouseMove, false);
  document.removeEventListener('mousedown', mouseDown, false);
}

function options() {
  document.getElementById("options").style.display =
    document.getElementById("options").style.display == 'none' ? 'block' : 'none';
}

function defCond() {
  document.getElementById('amp').value = 250;
  document.getElementById('speedMin').value = .2;
  document.getElementById('speedMax').value = 1;
  document.getElementById('spinMin').value = .001;
  document.getElementById('spinMax').value = .005;
  document.getElementById('sizeMin').value = .5;
  document.getElementById('sizeMax').value = 2;
  document.getElementById('scaleMin').value = 1;
  document.getElementById('scaleMax').value = 4;
  document.getElementById('grow').checked = false;
  document.getElementById('mouse').checked = false;
  document.getElementById('numShapes').value = 10;
  document.getElementById('delay').value = 1;
  document.getElementById('direction').value = "Up";
  document.getElementById('shape').value = "Pill";
  document.getElementById('wordsOptions') = "";
  document.getElementById('bounce').checked = false;

  document.getElementById('width').value = window.innerWidth;
  document.getElementById('height').value = window.innerHeight;
}

function mouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

function mouseDown(e) {
  for (i = 0; i < NUM; i++) {
    pill = new Shape(mouseX, mouseY);
    pills.push(pill);
  }
}

function getCond() {
  TYPE = document.getElementById('shape').value == "Words" ? 'word' : 'pill';
  AMP = toNum(document.getElementById('amp').value, 250);
  SPEED = {
    MIN: toNum(document.getElementById('speedMin').value, .2),
    MAX: toNum(document.getElementById('speedMax').value, 1)
  };
  SPIN = {
    MIN: toNum(document.getElementById('spinMin').value, .001),
    MAX: toNum(document.getElementById('spinMax').value, .005)
  };
  SIZE = {
    MIN: toNum(document.getElementById('sizeMin').value, .5),
    MAX: toNum(document.getElementById('sizeMax').value, 2)
  };
  SCALE = {
    MIN: toNum(document.getElementById('scaleMin').value, 1),
    MAX: toNum(document.getElementById('scaleMax').value, 4)
  };
  GROW = document.getElementById('grow').checked;
  NUM = toNum(document.getElementById('numShapes').value, 10);
  DELAY = toNum(document.getElementById('delay').value, 1);
  DIRECTION = document.getElementById('direction').value == "Up" ? -1 : 1;
  BOUNCE = document.getElementById('bounce').checked;
}

function toNum(s, def) {
  return !isNaN(parseFloat(s)) ? parseFloat(s) : def;
}

function moreP() {
  var pill;
  var st = DIRECTION == -1 ? canvas.height : 0;
  for (var i = 0; i < NUM; i++) {
    pill = new Shape(round3(rand(0, canvas.width)), st);
    pills.push(pill);
  }
  addmore = window.setTimeout(moreP, DELAY * 1000);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function round3(n) {
  return Math.round(n * 1000) / 1000;
}

function Shape(x, y) {
  this.x = x;
  this.y = y;
  this.scale = Math.floor(rand(SCALE.MIN, SCALE.MAX));
  this.speed = round3(rand(SPEED.MIN, SPEED.MAX));
  this.color = color[Math.floor(Math.random() * color.length)];
  this.size = round3(rand(SIZE.MIN, SIZE.MAX));
  this.spin = round3(rand(SPIN.MIN, SPIN.MAX));
  if (TYPE == 'word') {
    this.idx = idx++%words.length;
  }
  if (Math.random() < 0.5) {
    this.spin *= -1;
  }
  this.rotation = round3(rand(0, 2 * Math.PI));
  this.direction = DIRECTION;

  this.move = function() {
    this.rotation += this.spin;
    this.y += round3(this.speed * this.scale * this.direction);
  }

  this.draw = function() {
    g.save();
    g.beginPath();
    g.translate(this.x + Math.cos(this.rotation * this.speed) * AMP, this.y);
    g.rotate(this.rotation);
    g.scale(this.scale, this.scale);
    if (TYPE == 'pill') {
      g.moveTo(this.size, 0);
      g.lineTo(this.size * -1, 0);
      g.lineWidth = "5";
      g.lineCap = 'round';
      g.strokeStyle = this.color;
      g.stroke();
    } else if (TYPE == 'word') {
      g.font = '20pt Arial';
      g.fillStyle = this.color;
      g.fillText(words[this.idx], 0, 0);
    }
    g.restore();
  }
}

function clear() {
  g.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  var p;
  if (!GROW)
    clear();
  for (var i = 0; i < pills.length; i++) {
    p = pills[i];
    if (p.y < 0 || p.y > canvas.height) {
      //pills.splice(i,1); // causes flickering
      if (BOUNCE) { 
        p.direction *= -1; 
      }
    } 

    if (p.y >= 0 || p.y <= canvas.height || BOUNCE) {
      p.move();
      p.draw();
    }
  }
  visual = window.setTimeout(draw, DRAWRATE);
}
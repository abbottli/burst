var g, canvas; // canvas stuff
var visual, addmore; // intervals
var pills; // shape storage
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
var AMP, SPEED, SPIN, SIZE, SCALE, GROW, NUM, DELAY; // init var for pills
// AMP is amplitude of cos, determines how much pills move side to side, the spread
// GROW is show as growing lines or just the pills
var mouseX, mouseY;

function start() {
  stop();
  getCond();

  var pill;
  pills = [];

  canvas = document.getElementById('canvas')
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  g = canvas.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0,0);

  visual = setInterval(draw, 6);
  
  if (document.getElementById('mouse').checked) {
    document.addEventListener('mousemove', mouseMove, false);               
    document.addEventListener('mousedown', mouseDown, false);
  } else {
    for (i = 0; i < NUM; i++) {
      pill = new Line(rand(0, canvas.width), canvas.height);
      pills.push(pill);
    }
    addmore = setInterval(moreP, DELAY * 1000);
  }
}

function stop() {
  clearInterval(visual);
  clearInterval(addmore);
  document.removeEventListener('mousemove', mouseMove, false);               
  document.removeEventListener('mousedown', mouseDown, false);
}

function options() {
  document.getElementById("options").style.display =
    document.getElementById("options").style.display == 'none' ? 'block' : 'none';
}

function mouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

function mouseDown(e) {
  for (i = 0; i < NUM; i++) {
    pill = new Line(mouseX, mouseY);
    pills.push(pill);
  }
}

function getCond() {
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
  DELAY = toNum(document.getElementById("delay").value, 1)
}

function toNum(s, def) {
  return !isNaN(parseFloat(s)) ? parseFloat(s) : def;
}

function moreP() {
	var pill;
	for (var i = 0; i < NUM; i++) {
    pill = new Line(rand(0, canvas.width), canvas.height);
    pills.push(pill);
  }
}

function rand(min, max) {
	return Math.random() * (max - min) + min;
}

function Line(x, y) {
  this.x = x;
  this.y = y;
  this.scale = Math.floor(rand(SCALE.MIN, SCALE.MAX));
  this.speed = rand(SPEED.MIN, SPEED.MAX);
  this.color = color[Math.floor(Math.random() * color.length)];
  this.size = rand(SIZE.MIN, SIZE.MAX);
  this.spin = rand(SPIN.MAX, SPIN.MAX);
  if (Math.random() < 0.5) {
    this.spin *= -1;
  }
  this.rotation = rand(0, 2 * Math.PI);
  
  this.move = function() {
    this.rotation += this.spin;
    this.y -= this.speed * this.scale;
  }

  this.draw = function() {
    g.save();
    g.beginPath();
    g.translate(this.x + Math.cos(this.rotation * this.speed) * AMP, this.y);
    g.rotate(this.rotation);
    g.scale(this.scale, this.scale);
    g.moveTo(this.size , 0);
    g.lineTo(this.size * -1, 0);
    g.lineWidth = "5";
    g.lineCap = 'round';
    g.strokeStyle = this.color;
    g.stroke();
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
    if (p.y == 0) {
      p.x = rand(0, canvas.width);
      p.y =p.size * p.scale * s.scale;
    }
    p.move();
    p.draw();
  }
}
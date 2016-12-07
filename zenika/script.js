
var pointerEl = document.getElementById("pointer");
var videoEl = document.getElementById("canvas");
var titleEl = document.getElementById("title");
var fieldEl = document.getElementById("field");

var duration = 0;
var canvas = setCanvas();

function setCanvas() {
  var canvas = {
      width: videoEl.getBoundingClientRect().right - videoEl.getBoundingClientRect().left,
      height: videoEl.getBoundingClientRect().bottom - videoEl.getBoundingClientRect().top,
      top: videoEl.getBoundingClientRect().top,
      left: videoEl.getBoundingClientRect().left
  };
  canvas.center = [canvas.left + canvas.width / 2, canvas.top + canvas.height / 2];
  canvas.radius = canvas.width / 2;
  canvas.perimeter = 2* Math.PI * canvas.radius;
  return canvas;
}

videoEl.addEventListener('loadedmetadata', function() {
  duration = videoEl.duration;
}, false);

window.onresize = function(event) {
  canvas = setCanvas();
};

window.onmousemove = function(e) {
    duration = duration || videoEl.duration;

    var mouseX = e.x || e.clientX;
    var mouseY = e.y || e.clientY;

    var pointerPos = limit(mouseX, mouseY, canvas.radius);
    pointer.style.display = 'block';
    pointer.style.left = pointerPos.x + "px";
    pointer.style.top = pointerPos.y + "px";

    var pointerDist = getPointerDistance(pointerPos.x, pointerPos.y);
    videoEl.currentTime = pointerDistanceToTime(pointerDist);
    videoEl.pause();

    var radians = getRadiansPoint(pointerPos.x, pointerPos.y);
    changeField(radians);

    var posField = limit(mouseX, mouseY, 150);
    var paddingField = computeFieldPadding(posField.x, posField.y, fieldEl.offsetHeight, fieldEl.offsetWidth);
    fieldEl.style.display = 'flex';
    fieldEl.style.left = posField.x + paddingField.x + "px";
    fieldEl.style.top = posField.y + paddingField.y + "px";
}

function changeField(radians) {
  var deg = 360 * radians / Math.PI;
  if (deg > 0 && deg <= 90) {
    titleEl.innerHTML = introTitle;
    fieldEl.innerHTML = intro;
    $('body').css('background', '#159F5C no-repeat center center fixed');
  } else if (deg > 90 && deg <= 180) {
    titleEl.innerHTML = gdgTitle;
    fieldEl.innerHTML = gdg;
    $('body').css('background', '#733861 no-repeat center center fixed');
  } else if (deg >= -180 && deg < -90) {
    titleEl.innerHTML = expTitle;
    fieldEl.innerHTML = exp;
    $('body').css('background', '#4A86EE no-repeat center center fixed');
  } else {
    titleEl.innerHTML = zenikaTitle;
    fieldEl.innerHTML = zenika;
    $('body').css('background', '#dd4c40 no-repeat center center fixed');
  }
}

function computeFieldPadding(x, y, height, width) {
  var valueX = 0;
  var valueY = 0;
  if (x <= canvas.center[0]) {
    valueX = - width;
  }
  if (y <= canvas.center[1]) {
    valueY = - height;
  }
  return { x : valueX, y : valueY };
}

function limit(x, y, radius) {
    x = x - canvas.center[0];
    y = y - canvas.center[1];
    var radians = Math.atan2(y, x)
    return {
       x: Math.cos(radians) * radius + canvas.center[0],
       y: Math.sin(radians) * radius + canvas.center[1]
    }
}

function distance(dot1, dot2) {
    var x1 = dot1[0],
        y1 = dot1[1],
        x2 = dot2[0],
        y2 = dot2[1];
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function getRadiansPoint(x, y) {
  var startPosition = {
      x : canvas.left + canvas.radius,
      y : canvas.top
  }
  return Math.atan((y - startPosition.y) / (x - startPosition.x));
}

function getPointerDistance(x, y) {
    var radians = getRadiansPoint(x, y)
    var distance = radians * canvas.radius;

    if (isNaN(distance)) {
        return 0;
    } else if (distance < 0) {
        return (canvas.perimeter / 2) + distance;
    }
    return distance;
}

function pointerDistanceToTime(distance) {
    var ratio = duration / (canvas.perimeter / 2);
    return distance * ratio;
}

function initPointAt() {
    $('#field').pointat({
        target: "#pointer",
        defaultDirection: "down",
        xCorrection: -20,
        yCorrection: -20
    });
}
var introTitle = "<h1><span>Benjamin</span> Petetot</h1>";
var intro = "<img src='./img/avatar.jpeg' height='150px' width='100%' />"
            + "<div><p>Je suis semi-fullstack developpeur, c'est à dire que je fais du front en JS, ES6, Angular, React..."
            + " mais côté back pas de JS :P, je suis plutôt Java (Restlet, Spring, AMQ...).</p>"
            + "<p><a href='https://twitter.com/bpetetot' target='_NEW'>@bpetetot</a></p></div>";

var gdgTitle = "<h1>GDG & DevFest <span>Nantes</span></h1>";
var gdg = "<img src='./img/gdgnantes.png' height='150px' width='100%'  />"
          + "<div><p>Je suis co-fondateur du GDG Nantes et organisateur du DevFest Nantes. J'y ai la casquette de 'designer', "
          + "je fais le siteweb, les affiches, les t-shirts, les goodies...</p>"
          + "<p>D'ailleurs le CFP du DevFest Nantes 2016 ouvre très bientôt (sûrement cette semaine), n'hésitez pas à proposer des talks ;)</p>"
          + "<p><a href='http://gdgnantes.com' target='_NEW'>GDG Nantes</a> - <a href='https://devfest.gdgnantes.com' target='_NEW'>Devfest Nantes</a> - <a href='https://twitter.com/devfestnantes' target='_NEW'>@devfestnantes</a></p></div>";

var expTitle = "<h1>Où j'étais avant ?</h1>";
var exp = "<div><p>Après avoir vadrouillé dans quelques SSII de la région, j'ai été plusieurs années à Lorient en tant qu'interne chez DCNS (ceux qui font les sous-marins), j'y étais Architecte SI.</p><img src='./img/sm.png' /></div>";

var zenikaTitle = "<h1><img src='./img/zenika-logo.png' width='50%' /></h1>";
var zenika = "<div><h2>Zenika !</h2><p>Aujourd'hui je suis très fier de rejoindre Zenika à l'agence de Nantes et "
             + "j'espère vous rencontrer très bientôt pour déguster une bière (une autre de mes passions :).</p></div>"
             + "<img src='./img/moi-zen.png' height='150px' width='100%'  />";

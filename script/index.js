/**
 * LOGO Interpeter
 * @author AnuragHazra <hazru.anurag@gmail.com>
 */

let cw = window.innerWidth;
let ch = window.innerHeight - 150;


// sorry i did not use p5dom (i just love vanilajs)
let inputCommand = document.getElementById('commands');
let historyConsole = document.getElementById('history');
let executeBtn = document.getElementById('exeBtn');

executeBtn.onclick = function () {
  historyConsole.scrollTop += 100;
  turtle.move(inputCommand.value);
  historyConsole.innerHTML += '<p>' + inputCommand.value + '</p>';
  inputCommand.value = '';
  inputCommand.select();
}


window.addEventListener('keydown', function (e) {
  historyConsole.scrollTop += 100;
  if (e.keyCode === 13) {
    turtle.move(inputCommand.value);
    historyConsole.innerHTML += '<p>' + inputCommand.value + '</p>';
    inputCommand.value = '';
    inputCommand.select();
  }
});

historyConsole.addEventListener('click', function (e) {
  if (e.target.tagName === 'P') {
    inputCommand.value = e.target.innerHTML;
    inputCommand.select();
  }
});

let turtle;
function setup() {
  createCanvas(cw, ch);
  turtle = new Turtle();
}

function draw() {
  background(255);

  turtle.render();

}
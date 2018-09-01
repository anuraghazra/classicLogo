/**
 * MSW LOGO Interpeter
 * @author AnuragHazra <hazru.anurag@gmail.com>
 */

window.onload = function () {

  let canvas = document.getElementById('c');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 150;
  const c = new Candy(canvas);
  c.smooth('high')

  let w = CANVAS_WIDTH;
  let h = CANVAS_HEIGHT;

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
      console.log(e.target)
      inputCommand.value = e.target.innerHTML;
      inputCommand.select();
    }
  })

  const turtle = new Turtle();

  function animate() {
    c.clear();

    turtle.render();

    c.loop();
  }

}
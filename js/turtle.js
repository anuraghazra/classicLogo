/**
 * @class Turtle
 * @param {*} x 
 * @param {*} y 
 * @author AnuragHazra<hazru.anurag@gmail.com>
 */

/**
 * FUN COMMANDS
 * repeat 6 [fd 100 rt 360/6]
 * repeat 50 [fd 150 rt 6/2 lt 180/2 fd 5 bk 1]
 * repeat 150 [rt 45 fd 200 rt 1 lt 515151/2 fd 500 bk 1]
 * repeat 150 [rt 25 fd 200 rt 1 lt 9000/2]
 * repeat 50 [fd 150 rt 1 lt 180/2 fd 5 bk 1]
 * repeat 150 [rt 15 fd repcount*2 rt 1 lt 9000/2]
 */
function Turtle(x, y) {
  this.pos = new Vector(cw / 2, ch / 2);

  this.angle = Vector.fromAngle(radians(-90));

  this.hideTurtle = false;
  this.pencolor = [0, 0, 0];
  this.pensize = [1, 1];

  this.pendown = true;


  this.lines = [];

  //regEx
  this.matchCase = [
    /(setpencolor|setpensize|pendown|penup).*/ig,
    /\w{0,}$/ig,
    /\w.*?\s\d{1,}$/ig,
    /(repeat)\s\d{1,}\s\[(.*?)\]$/ig
  ];


  // alternate commands
  this.alterCommands = {
    'FD': 'FORWARD',
    'BK': 'BACK',
    'RT': 'RIGHT',
    'LT': 'LEFT',
    'CS': 'CLEARSCREEN',
    'HT': 'HIDETURTLE',
    'ST': 'SHOWTURTLE',
    'PU': 'PENUP',
    'PD': 'PENDOWN',
    'SETPENSIZE': 'SETPENSIZE',
    'SETPENCOLOR': 'SETPENCOLOR',
  }

  
  this.functions = {
    'sin': function (value) {
      return Math.sin(value)
    },
    'random': function (value) {
      return Math.random() * value
    }
  }

  let self = this;

  // RULES
  this.rules = {
    'RT': function (value) {
      self.angle.rotate(radians(value));
    },

    'LT': function (value) {
      self.angle.rotate(radians(-value));
    },

    'FD': function (value) {
      let old = self.pos.copy();
      self.angle.setMag(parseFloat(value));
      self.pos.add(self.angle);

      let color = Array.prototype.slice.call(self.pencolor, 0);
      let size = Array.prototype.slice.call(self.pensize, 0);
      if (self.pendown) {
        self.lines.push([
          old, self.pos.copy(), color, size
        ]);
      }
    },

    'BK': function (value) {
      let old = self.pos.copy();
      self.angle.setMag(parseFloat(value));
      self.pos.sub(self.angle);

      let color = Array.prototype.slice.call(self.pencolor, 0);
      let size = Array.prototype.slice.call(self.pensize, 0);
      if (self.pendown) {
        self.lines.push([
          old, self.pos.copy(), color, size
        ]);
      }
    },

    'HT': function () { self.hideTurtle = true },
    'ST': function () { self.hideTurtle = false },

    'PU': function () { self.pendown = false },
    'PD': function () { self.pendown = true },

    'SETPENCOLOR': function (value, data) {
      let tmpC = [];
      console.log(value)
      for (let i = 0; i < data.length; i++) {
        let d = self._parseArray(data[i]);
        if (!isNaN(d)) {
          tmpC.push(Number(d));
        }
      }
      self.pencolor = Array.prototype.slice.call(tmpC, 0);
    },
    'SETPENSIZE': function (value, data) {
      let tmpS = [];
      for (let i = 0; i < data.length; i++) {
        let d = self._parseArray(data[i]);
        if (!isNaN(d)) {
          tmpS.push(Number(d));
        }
      }
      self.pensize = Array.prototype.slice.call(tmpS, 0);
    },

    'HOME': function () {
      self.pos = new Vector(cw / 2, ch / 2);
      self.angle = Vector.fromAngle(radians(-90));
      self.hideTurtle = false;
      self.pencolor = [0, 0, 0];
      self.pensize = [1, 1];
    },
    'CS': function () {
      this.HOME();
      self.lines = [];
    }
  }
}


// avoid this
Turtle.prototype._parseArray = function (value) {
  let v = value.replace('[', '')
  v = v.replace('[ ', '');
  v = v.replace(']', '')
  v = v.replace(' ]', '');
  return v
}


/**
 * @method _executeMove()
 * @param {array} data 
 */
Turtle.prototype._executeMove = function (data) {
  // check alternate commands
  for (const i in this.alterCommands) {
    let string = data[0].toUpperCase();
    if (string === i || string === this.alterCommands[i]) {
      data[0] = i;
    }
  }

  // check if rules are valid
  for (j in this.rules) {
    if (data[0].toUpperCase() === j) {
      if (data[1] && isNaN(data[1])) {
        for (f in this.functions) {
          if (f === data[1]) {
            this.rules[j](this.functions[f](data[2]), data);
            break;
          }
        }
      } else {
        this.rules[j](data[1], data);
        break;
      }
    }
  }
}


/**
 * @method _executeRepeat
 * The repeat commands
 * * sorry, when i wrote this code only me and god knows how it works
 * * now only god knows how it works
 */
Turtle.prototype._executeRepeat = function (match) {
  // parse variables
  let data = match.split('[') || match.split('[ ');
  let times = parseInt(data[0].replace('repeat ', ''));
  let commands = this._parseArray(data[1]);
  commands = commands.split(' ').filter(Boolean);

  let repcount = 1;
  for (let i = 0; i < times; i++) {

    // make optional commands (FD === FORWARD)
    for (const alter in this.alterCommands) {
      for (let k = 0; k < commands.length; k += 2) {
        let string = commands[k].toUpperCase();
        if (string === alter || string === this.alterCommands[alter]) {
          commands[k] = alter;
        }
      }
    }

    // execute commands
    for (func in this.rules) {
      for (let k = 0; k < commands.length; k += 2) {
        if (commands[k].toUpperCase() === func) {
          // repcount
          if (commands[k + 1] === 'repcount') {
            // debugger;
            // console.log(func, repcount)
            this.rules[func](eval(repcount));
            break;
          } else {
            // TODO : function in repeat
            // console.log('>', func, commands[k + 1])
            this.rules[func](eval(commands[k + 1]));
            break;
          }
        }
      }
    }
    repcount++;
  }

}


/**
 * Moves 
 * @param {string} text 
 */
Turtle.prototype.move = function (text) {
  for (let m = 0; m < this.matchCase.length; m++) {
    let match = text.match(this.matchCase[m]);
    if (match) {
      let data = match[0].split(' ');
      console.log(this.matchCase[m],data)
      this._executeMove(data);
      
      if (data[0] == 'repeat') {
        console.log({data});
        this._executeRepeat(match[0]);
      }
    }
  }
}


/**
 * Render Turtle
 */
Turtle.prototype.render = function () {
  // console.log(this.pencolor)
  if (!this.hideTurtle) {
    let size = 15;
    stroke(0);
    strokeWeight(1);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle.heading());
    line(size,0,0,-size)
    line(0,size,size,0);
    pop();
  }
  // draw lines
  for (let i = 0; i < this.lines.length; i++) {
    // console.log(this.lines[i][2])
    stroke(this.lines[i][2]);
    strokeWeight(this.lines[i][3][1]);
    line(this.lines[i][0].x, this.lines[i][0].y,this.lines[i][1].x, this.lines[i][1].y)
  }
}
// setpencolor [255,0,0]
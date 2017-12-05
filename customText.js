module.exports = class customText {
  constructor(letter,nonLetter) {
    this.nonLetter = nonLetter;
    this.letter = letter;
  }

  set nonLetter(nonLetter_) {
    if (typeof nonLetter_ !== 'string') {
      this.nonLetterPriv = " ";
    } else {
      this.nonLetterPriv = nonLetter_;
    }
  }

  set letter(letter_) {
    if (typeof letter_ !== 'string') {
      this.letterPriv = "A";
    } else {
      this.letterPriv = letter_;
    }
  }

  render(text) {
    let l = this.letterPriv.replace(/:/g, "");
    let o = this.nonLetterPriv.replace(/:/g, "");
    let nl = "\n";
    let msg = "";
    let html = "";
    for (let row = 0; row < 5; row++) {
      for (let letter = 0; letter < text.length; letter++) {
        let arr = this.getLetterData(text.substr(letter,1));
        for (let col = 0; col < 5; col++) {
          let b = arr[row][col];
          if (b == 0) {
            msg += this.nonLetterPriv;
            html += "<div class=\"" + o + " nonLetter\"></div>";
          } else {
            msg += this.letterPriv;
            html += "<div class=\"" + l + " letter\"></div>";
          }
        }
        if (letter !== text.length-1) {
          msg += this.nonLetterPriv;
          html += "<div class=\"" + o + " nonLetter\"></div>";
        }
      }
      msg += nl;
      html += "<br>";
    }
    console.log("Character count: " + msg.length)
    return msg;
  }

  render1(text) {
    let l = this.letterPriv.replace(/:/g, "");
    let o = this.nonLetterPriv.replace(/:/g, "");
    let nl = "\n";
    let msg = "";
    let html = "";
    for (let row = 0; row < 6; row++) {
      for (let letter = 0; letter < text.length; letter++) {
        let b = this.getLetterData1(text.substr(letter,1));
        msg += b[row];
        if (letter !== text.length-1) {
          //msg += this.nonLetterPriv;
        }
      }
      msg += nl;
      html += "<br>";
    }
    console.log("Character count: " + msg.length)
    return msg;
  }

  getLetterData(letter) {
    let l = this.letterPriv;
    let o = this.nonLetterPriv;
    let nl = "\n";
    switch(letter.toUpperCase()) {
      case 'A':
        return [[1,1,1,1,1],
                [1,0,0,0,1],
                [1,1,1,1,1],
                [1,0,0,0,1],
                [1,0,0,0,1]];
      break;
      case 'B':
        return [[1,1,1,1,0],
                [1,0,0,0,1],
                [1,1,1,1,1],
                [1,0,0,0,1],
                [1,1,1,1,0]];
      break;
      case 'C':
        return [[1,1,1,1,1],
                [1,0,0,0,0],
                [1,0,0,0,0],
                [1,0,0,0,0],
                [1,1,1,1,1]];
      break;
      case 'D':
        return [[1,1,1,1,0],
                [1,0,0,0,1],
                [1,0,0,0,1],
                [1,0,0,0,1],
                [1,1,1,1,0]];
      break;
      case 'E':
        return [[1,1,1,1,1],
                [1,0,0,0,0],
                [1,1,1,0,0],
                [1,0,0,0,0],
                [1,1,1,1,1]];
      break;
      case 'F':
        return [[1,1,1,1,1],
                [1,0,0,0,0],
                [1,1,1,0,0],
                [1,0,0,0,0],
                [1,0,0,0,0]];
      break;
      case 'G':
        return [[1,1,1,1,1],
                [1,0,0,0,0],
                [1,0,1,1,1],
                [1,0,0,0,1],
                [1,1,1,1,1]];
      break;
      case 'H':
        return [[1,0,0,0,1],
                [1,0,0,0,1],
                [1,1,1,1,1],
                [1,0,0,0,1],
                [1,0,0,0,1]];
      break;
      case 'I':
        return [[1,1,1,1,1],
                [0,0,1,0,0],
                [0,0,1,0,0],
                [0,0,1,0,0],
                [1,1,1,1,1]];
      break;
      case 'J':
        return [[0,0,0,0,1],
                [0,0,0,0,1],
                [0,0,0,0,1],
                [1,0,0,0,1],
                [1,1,1,1,1]];
      break;
      case 'K':
        return [[1,0,0,0,1],
                [1,0,0,1,0],
                [1,1,1,0,0],
                [1,0,0,1,0],
                [1,0,0,0,1]];
      break;
      case 'L':
        return [[1,0,0,0,0],
                [1,0,0,0,0],
                [1,0,0,0,0],
                [1,0,0,0,0],
                [1,1,1,1,1]];
      break;
      case 'M':
        return [[1,0,0,0,1],
                [1,1,0,1,1],
                [1,0,1,0,1],
                [1,0,0,0,1],
                [1,0,0,0,1]];
      break;
      case 'N':
        return [[1,0,0,0,1],
                [1,1,0,0,1],
                [1,0,1,0,1],
                [1,0,0,1,1],
                [1,0,0,0,1]];
      break;
      case 'O':
        return [[1,1,1,1,1],
                [1,0,0,0,1],
                [1,0,0,0,1],
                [1,0,0,0,1],
                [1,1,1,1,1]];
      break;
      case 'P':
        return [[1,1,1,1,0],
                [1,0,0,0,1],
                [1,1,1,1,1],
                [1,0,0,0,0],
                [1,0,0,0,0]];
      break;
      case 'Q':
        return [[1,1,1,1,1],
                [1,0,0,0,1],
                [1,0,0,0,1],
                [1,0,1,0,1],
                [1,1,1,1,1]];
      break;
      case 'R':
        return [[1,1,1,1,0],
                [1,0,0,0,1],
                [1,1,1,1,1],
                [1,0,0,1,0],
                [1,0,0,0,1]];
      break;
      case 'S':
        return [[1,1,1,1,1],
                [1,0,0,0,0],
                [1,1,1,1,1],
                [0,0,0,0,1],
                [1,1,1,1,1]];
      break;
      case 'T':
        return [[1,1,1,1,1],
                [0,0,1,0,0],
                [0,0,1,0,0],
                [0,0,1,0,0],
                [0,0,1,0,0]];
      break;
      case 'U':
        return [[1,0,0,0,1],
                [1,0,0,0,1],
                [1,0,0,0,1],
                [1,0,0,0,1],
                [1,1,1,1,1]];
      break;
      case 'V':
        return [[1,0,0,0,1],
                [1,0,0,0,1],
                [1,0,0,0,1],
                [0,1,0,1,0],
                [0,0,1,0,0]];
      break;
      case 'W':
        return [[1,0,0,0,1],
                [1,0,0,0,1],
                [1,0,1,0,1],
                [1,1,0,1,1],
                [1,0,0,0,1]];
      break;
      case 'X':
        return [[1,0,0,0,1],
                [0,1,0,1,0],
                [0,0,1,0,0],
                [0,1,0,1,0],
                [1,0,0,0,1]];
      break;
      case 'Y':
        return [[1,0,0,0,1],
                [1,0,0,0,1],
                [1,1,1,1,1],
                [0,0,1,0,0],
                [0,0,1,0,0]];
      break;
      case 'Z':
        return [[1,1,1,1,1],
                [0,0,0,1,0],
                [0,0,1,0,0],
                [0,1,1,0,0],
                [1,1,1,1,1]];
      break;
      case 'Å':
        return [[0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0]];
      break;
      case 'Ä':
        return [[0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0]];
      break;
      case 'Ö':
        return [[0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0]];
      break;
      default:
      return [[0,0,0,0,0],
              [0,0,0,0,0],
              [0,0,0,0,0],
              [0,0,0,0,0],
              [0,0,0,0,0]];
    }
  }

  getLetterData1(txtU) {
    let txt = txtU.toLowerCase();
    let original_alphabet_set = "abcdefghijklmnopqrstuvwxyz 0123456789";
    let converting_dict = [];
  	converting_dict['a'] = ['┏━━━┓', '┃┏━┓┃', '┃┃︱┃┃', '┃┗━┛┃', '┃┏━┓┃', '┗┛︱┗┛'];
  	converting_dict['b'] = ['┏━━┓︱', '┃┏┓┃︱', '┃┗┛┗┓', '┃┏━┓┃', '┃┗━┛┃', '┗━━━┛'];
  	converting_dict['c'] = ['┏━━━┓', '┃┏━┓┃', '┃┃︱┗┛', '┃┃︱┏┓', '┃┗━┛┃', '┗━━━┛'];
  	converting_dict['d'] = ['┏━━━┓', '┗┓┏┓┃', '︱┃┃┃┃', '︱┃┃┃┃', '┏┛┗┛┃', '┗━━━┛'];
  	converting_dict['e'] = ['┏━━━┓', '┃┏━━┛', '┃┗━━┓', '┃┏━━┛', '┃┗━━┓', '┗━━━┛'];
  	converting_dict['f'] = ['┏━━━┓', '┃┏━━┛', '┃┗━━┓', '┃┏━━┛', '┃┃︱︱︱', '┗┛︱︱︱'];
  	converting_dict['g'] = ['┏━━━┓', '┃┏━┓┃', '┃┃︱┗┛', '┃┃┏━┓', '┃┗┻━┃', '┗━━━┛'];
  	converting_dict['h'] = ['┏┓︱┏┓', '┃┃︱┃┃', '┃┗━┛┃', '┃┏━┓┃', '┃┃︱┃┃', '┗┛︱┗┛'];
  	converting_dict['i'] = ['┏━━┓', '┗┫┣┛', '︱┃┃︱', '︱┃┃︱', '┏┫┣┓', '┗━━┛'];
  	converting_dict['j'] = ['︱︱┏┓', '︱︱┃┃', '︱︱┃┃', '┏┓┃┃', '┃┗┛┃', '┗━━┛'];
  	converting_dict['k'] = ['┏┓┏━┓', '┃┃┃┏┛', '┃┗┛┛︱', '┃┏┓┃︱', '┃┃┃┗┓', '┗┛┗━┛'];
  	converting_dict['l'] = ['┏┓︱︱︱', '┃┃︱︱︱', '┃┃︱︱︱', '┃┃︱┏┓', '┃┗━┛┃', '┗━━━┛'];
  	converting_dict['m'] = ['┏━┓┏━┓', '┃┃┗┛┃┃', '┃┏┓┏┓┃', '┃┃┃┃┃┃', '┃┃┃┃┃┃', '┗┛┗┛┗┛'];
  	converting_dict['n'] = ['┏━┓︱┏┓', '┃┃┗┓┃┃', '┃┏┓┗┛┃', '┃┃┗┓┃┃', '┃┃︱┃┃┃', '┗┛︱┗━┛'];
  	converting_dict['o'] = ['┏━━━┓', '┃┏━┓┃', '┃┃︱┃┃', '┃┃︱┃┃', '┃┗━┛┃', '┗━━━┛'];
  	converting_dict['p'] = ['┏━━━┓', '┃┏━┓┃', '┃┗━┛┃', '┃┏━━┛', '┃┃︱︱︱', '┗┛︱︱︱'];
  	converting_dict['q'] = ['┏━━━┓', '┃┏━┓┃', '┃┃︱┃┃', '┃┗━┛┃', '┗━━┓┃', '︱︱︱┗┛'];
  	converting_dict['r'] = ['┏━━━┓', '┃┏━┓┃', '┃┗━┛┃', '┃┏┓┏┛', '┃┃┃┗┓', '┗┛┗━┛'];
  	converting_dict['s'] = ['┏━━━┓', '┃┏━┓┃', '┃┗━━┓', '┗━━┓┃', '┃┗━┛┃', '┗━━━┛'];
  	converting_dict['t'] = ['┏━━━━┓', '┃┏┓┏┓┃', '┗┛┃┃┗┛', '︱︱┃┃︱︱', '︱︱┃┃︱︱', '︱︱┗┛︱︱'];
  	converting_dict['u'] = ['┏┓︱┏┓', '┃┃︱┃┃', '┃┃︱┃┃', '┃┃︱┃┃', '┃┗━┛┃', '┗━━━┛'];
  	converting_dict['v'] = ['┏┓︱︱┏┓', '┃┗┓┏┛┃', '┗┓┃┃┏┛', '︱┃┗┛┃︱', '︱┗┓┏┛︱', '︱︱┗┛︱︱'];
  	converting_dict['w'] = ['︱︱︱︱︱︱', '︱︱︱︱︱︱', '┏┓┏┓┏┓', '┃┗┛┗┛┃', '┗┓┏┓┏┛', '︱┗┛┗┛︱'];
  	converting_dict['x'] = ['┏━┓┏━┓', '┗┓┗┛┏┛', '︱┗┓┏┛︱', '︱┏┛┗┓︱', '┏┛┏┓┗┓', '┗━┛┗━┛'];
  	converting_dict['y'] = ['┏┓︱︱┏┓', '┃┗┓┏┛┃', '┗┓┗┛┏┛', '︱┗┓┏┛︱', '︱︱┃┃︱︱', '︱︱┗┛︱︱'];
  	converting_dict['z'] = ['┏━━━━┓', '┗━━┓━┃', '︱︱┏┛┏┛', '︱┏┛┏┛︱', '┏┛━┗━┓', '┗━━━━┛'];
  	converting_dict[' '] = [' ', ' ', ' ', ' ', ' ', ' '];
  	converting_dict['0'] = ['┏━━━┓', '┃┏━┓┃', '┃┃┃┃┃', '┃┃┃┃┃', '┃┗━┛┃', '┗━━━┛'];
  	converting_dict['1'] = ['︱┏┓︱', '┏┛┃︱', '┗┓┃︱', '︱┃┃︱', '┏┛┗┓', '┗━━┛'];
  	converting_dict['2'] = ['┏━━━┓', '┃┏━┓┃', '┗┛┏┛┃', '┏━┛┏┛', '┃┃┗━┓', '┗━━━┛'];
  	converting_dict['3'] = ['┏━━━┓', '┃┏━┓┃', '┗┛┏┛┃', '┏┓┗┓┃', '┃┗━┛┃', '┗━━━┛'];
  	converting_dict['4'] = ['┏┓︱┏┓', '┃┃︱┃┃', '┃┗━┛┃', '┗━━┓┃', '︱︱︱┃┃', '︱︱︱┗┛'];
  	converting_dict['5'] = ['┏━━━┓', '┃┏━━┛', '┃┗━━┓', '┗━━┓┃', '┏━━┛┃', '┗━━━┛'];
  	converting_dict['6'] = ['┏━━━┓', '┃┏━━┛', '┃┗━━┓', '┃┏━┓┃', '┃┗━┛┃', '┗━━━┛'];
  	converting_dict['7'] = ['┏━━━┓', '┃┏━┓┃', '┗┛┏┛┃', '︱︱┃┏┛', '︱︱┃┃︱', '︱︱┗┛︱'];
  	converting_dict['8'] = ['┏━━━┓', '┃┏━┓┃', '┃┗━┛┃', '┃┏━┓┃', '┃┗━┛┃', '┗━━━┛'];
  	converting_dict['9'] = ['┏━━━┓', '┃┏━┓┃', '┃┗━┛┃', '┗━━┓┃', '┏━━┛┃', '┗━━━┛'];

    console.log(txt);
    console.log(converting_dict[txt]);
    return converting_dict[txt];
  }
}

import { getRandomNumber } from '../modules/helpers'

/**
 * @classdesc Represents the main graphical rendering of what users are typing.
 * Take DOMElements parameters in order to update them at each key pressed 
 */
class TypingMain {

/**
 * @constructor
 * @param {Element} elm_text_to_type - block containing a piece of the text supposed to be typed soon
 * @param {Element} elm_cursor - block containing the current key to be typed
 * @param {Element} elm_typing_container - block containing both cursor and text-to-type
 * @param {Object} CURSOR_COLOR - object containing the two colors to be applied (true: correct / false: error)
 */
  constructor(elm_text_to_type, elm_cursor, elm_typing_container, CURSOR_COLOR) {
    this.elm_text_to_type = elm_text_to_type;
    this.elm_cursor = elm_cursor;
    this.elm_typing_container = elm_typing_container;
    this.CURSOR_COLOR = CURSOR_COLOR;
    this.first_success = true;
    // x / y position for starting sprites animations
    this.redefineAnimationPosition();
    window.onresize = () => { this.redefineAnimationPosition(); };
  }



  /**
   * Update position of sprites animations start 
   */
  redefineAnimationPosition() {
    this.animation_position = { x: this.elm_cursor.getBoundingClientRect().left,
                                y: this.elm_cursor.getBoundingClientRect().top + this.elm_cursor.offsetHeight / 2};
  }

  /**
   * Creates a div representing a fragment of Letter being pulverized at much speed
   * @private
   * @returns {void}
   */
  createSprite() {
    this.elm_sprite = document.createElement('div');
    const nb = Math.round(getRandomNumber(1,3));
    if (nb === 1) {
      this.elm_sprite.classList.add('success-fade-out');
    } else if (nb === 2) {
      this.elm_sprite.classList.add('success-fade-out-slow');
    } else {
      this.elm_sprite.classList.add('success-fade-out-quick');
    }
    this.elm_sprite.style.width = getRandomNumber(4, 16) + 'px';
    this.elm_sprite.style.height = getRandomNumber(4, 16) + 'px';
    this.elm_sprite.style.borderRadius = getRandomNumber(4, 12) + 'px';
    this.elm_sprite.style.background = 'var(--color-main)';
    this.elm_sprite.style.position = 'absolute';
    this.elm_sprite.style.zIndex = '51';
    const spread = getRandomNumber(4, 17) + 'px';
    this.elm_sprite.style.boxShadow = `0px 0px 30px ${spread} var(--color-main)`;
    this.elm_sprite.style.top = (this.animation_position.y) + 'px';
    this.elm_sprite.style.left = (this.animation_position.x) + 'px';
    document.body.appendChild(this.elm_sprite);
    this.animate_sprite(this.elm_sprite, 150, getRandomNumber(0, 1.4), getRandomNumber(0.1, 0.35));
  }

  /**
   * Provides the pulverization animation of the given element (sprite)
   * @private
   * @returns {void}
   * @param {Element} elm - Element to animate
   * @param {number} max_cycles - Number of movements operated on the element
   * @param {number} x_increase - Number of pixels on x-axis substracted at each cycle to element position
   * @param {number} y_increase - Number of pixels on y-axis added at each cycle to element position
   */
  animate_sprite(elm, max_cycles, x_increase, y_increase) {
    let cycles = 0;
    let x = 0;
    let y = 0;
    const y_direction = Math.random() >= 0.5 ? '-' : '';
    const interval = setInterval( ()=>{
      elm.style.transform = `translate(-${x}px, ${y_direction}${y}px)`;
      x += x_increase;
      y += y_increase;
      cycles++;
      if (cycles >= max_cycles) {
        clearInterval(interval);
        elm.parentNode.removeChild(elm);
      }
    }, 2);
  }


/**
 * Set Graphical rendering for next character to type after a correct key pressed.
 * @return {Void}
 * @param {string} text - First character of this variable is put in cursor element, rest of characters are put in text-to-type element
 */
  typingSuccess(text) {
    if (this.first_success) {
      this.first_success = false;
    } else {
      for (let index = 0; index < getRandomNumber(1, 3); index++) {
        this.createSprite();
      }
    }
    let char_to_type = text.substring(0,1); 
    this.elm_cursor.style.background = this.CURSOR_COLOR.true;
    this.elm_typing_container.style.border = "4px solid var(--color-main)";
    this.elm_text_to_type.style.color = "var(--color-main)";
    // Security, we don't want to block mechanism in case of unexpected character
    if (isNaN(char_to_type.charCodeAt(0)) || char_to_type.charCodeAt(0) === 160 ) {
      // console.warn('nan encountered');
      char_to_type = ' ';
    }
    // Need to keep the right dimension of div cursor. Let's fill it with an invisible char
    if (char_to_type === ' ') {
      this.elm_cursor.style.color = this.CURSOR_COLOR.true
      this.elm_cursor.innerText = '~';
    }
    else {
      this.elm_cursor.style.color= "white";
      this.elm_cursor.innerText = char_to_type;
    }
    this.elm_text_to_type.innerHTML = text.substring(1, text.length);
  }

/**
 * Set Graphical rendering after an incorrect key pressed.
 * @return {void}
 * @param {string} char_to_type - The character supposed to by typed. Need to know if it's a space, to correctly color the character in cursor
 */
  typingError(char_to_type) {
    this.elm_cursor.style.background = this.CURSOR_COLOR.false;
    this.elm_typing_container.style.border = "4px solid var(--color-error)";
    this.elm_text_to_type.style.color = "var(--color-error)";
    // Need to render our fake character (~) invisible again (because background color changed)
    if (char_to_type === ' ') {
      this.elm_cursor.style.color = this.CURSOR_COLOR.false;
    }
  }

}

export default TypingMain;
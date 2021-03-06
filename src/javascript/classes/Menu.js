import '../../css/menu.css';
import { removeClass, addClass } from '../modules/helpers';
import { saveAndChangeColorTheme } from '../modules/colorManager';
import color_themes from '../../../config/color-themes.json'


/**
 * @classdesc Create a DOM element Menu in order for example
 * to change the color theme or back to the home page.
 */
class Menu {
  
  /**
   * Create the DOM elements of the menu. Append the menu to the given root element
   * @returns {void}
   * @param {Element} elm_root - the given DOM element the menu will be appended
   * @param {boolean} append_home_icon - if true, a button linked to the homepage will be appended to the menu.
   */
  constructor(elm_root, append_home_icon) {
    this.elm_root = elm_root;
    this.append_home_icon = append_home_icon;
    this.CURRENT_ICON_COLOR_OPACITY = 0.25;
    this.HOME_HREF = './index.html';
    // DOM variables
    this.div_form = document.createElement('div');
    this.div_form_1 = document.createElement('div');
    this.div_form_2 = document.createElement('div');
    this.div_colors_container = document.createElement('div');
    this.div_colors = document.createElement('div');
    this.div_form_and_colors = document.createElement('div');
    this.div = document.createElement('div');
    this.a_home = document.createElement('a');
    this.a_colorchange = document.createElement('a');
    this.appendMenu();
  }


  /**
   * Returns the DOM element containing all the color-theme selection buttons
   * @returns {Element}
   */
  getDivColors() {
    return this.div_colors;
  }

  /**
   * Returns the DOM element represents the button deploying all color themes available
   * @returns {Element}
   */
  getBtnColorChange() {
    return this.a_colorchange;
  }

  /**
   * Change the color theme by calling the colorManager
   * @private
   * @returns {void}
   * @param {string} color_name
   */
  clickOnIconColor(color_name) {
    saveAndChangeColorTheme(this, color_name);
  }

  /**
   * Replies the DOM element containing all the color-theme selection buttons
   * @private
   * @returns {void}
   */
  replyColorSelectionMenu() {
    this.div_form_and_colors.classList.remove('menu__colors-deploy');
    this.div_form_and_colors.classList.add('menu__colors-deploy-reverse');
    removeClass(this.a_colorchange, 'menu__item-selected'); 
  }

  /**
   * Build the menu (DOM) and append it to the given root element. Provides the color-theme selection sub-menu
   * @private
   * @returns {void}
   */
  appendMenu() {
    if (!this.elm_root) {
      return;
    }  
    // Creating triangle form (2 forms for simulating border)
    this.div_form.classList.add('menu__form');
    this.div_form_1.classList.add('menu__form1');
    this.div_form_2.classList.add('menu__form2');
    this.div_form.appendChild(this.div_form_1);
    this.div_form.appendChild(this.div_form_2);
    // Creating colors selection panel
    this.div_colors_container.classList.add('menu__colorscontainer');
    this.div_colors_container.appendChild(this.div_colors);
    this.div_colors.classList.add('menu__colors');
    color_themes.list.forEach( (obj) => {
      const div = document.createElement('div');
      div.classList.add('menu__iconcolor');
      div.dataset.color = obj.color;
      div.style.background = obj.main;
      this.div_colors.appendChild(div);
      // CLICK on icon color selection
      div.addEventListener('click', (e) => {
        this.clickOnIconColor(obj.color);
      });
    });
    this.div_form_and_colors.classList.add('menu__formsandcolor');
    this.div_form_and_colors.appendChild(this.div_form);
    this.div_form_and_colors.appendChild(this.div_colors_container);
    this.div_form_and_colors.addEventListener('click', function(e) {
      // prevent the event body click closing colors picker
      e.stopPropagation();
    });
  
    // Creating main menu buttons (svg icons)
    this.div.classList.add('menu__items');
    this.a_home.classList.add('menu__item');
    this.a_home.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="41" height="32" viewBox="0 0 40.932 27.566"><g transform="translate(-7164.068 51.821)"><rect width="39" height="4" rx="1" transform="translate(7166 -40)" fill="#fff"/><rect width="19.3" height="4.331" rx="1" transform="translate(7164.068 -38.174) rotate(-45)" fill="#fff"/><rect width="19.3" height="4.331" rx="1" transform="translate(7167.479 -40.965) rotate(45)" fill="#fff"/></g></svg>';
    this.a_home.href = this.HOME_HREF;
    this.a_colorchange.classList.add('menu__item');
    this.a_colorchange.innerHTML = '<svg class="color-change" xmlns="http://www.w3.org/2000/svg" width="41" height="32" viewBox="0 0 31 32"><g class="color-change" transform="translate(-7229 51)"><g class="color-change" transform="translate(7229 -46)" fill="none" stroke="#fff" stroke-width="3"><circle class="color-change" cx="13.5" cy="13.5" r="13.5" stroke="none"/><circle class="color-change" cx="13.5" cy="13.5" r="12" fill="none"/></g><g class="circle color-change" transform="translate(7243 -51)" fill="#0abdd2" stroke="#fff" stroke-width="3"><circle class="color-change" cx="8.5" cy="8.5" r="8.5" stroke="none"/><circle class="color-change" cx="8.5" cy="8.5" r="7" fill="none"/></g></g></svg>';
  
    // Appending everything to original DOM node passed
    if (this.append_home_icon) { this.div.appendChild(this.a_home); }
    this.div.appendChild(this.a_colorchange);
    this.elm_root.appendChild(this.div);
    this.elm_root.appendChild(this.div_form_and_colors);
    // CLICK on button opening colors selection panel
    this.a_colorchange.addEventListener('click', (e) => {
      // prevent the body event click - closing colors selection panel
      e.stopPropagation();
      if (!this.div_form_and_colors.classList.contains('menu__colors-deploy')) {
        addClass(this.a_colorchange, 'menu__item-selected'); 
        removeClass(this.div_form_and_colors, 'menu__colors-deploy-reverse');
        this.div_colors.style.display = 'flex';
        this.div_form_1.style.display = 'inline-block';
        this.div_form_2.style.display = 'inline-block';
        this.div_form_and_colors.classList.add('menu__colors-deploy');
      } else {
        this.replyColorSelectionMenu();
      }
    });
    document.body.addEventListener('click', (e) => {
      this.replyColorSelectionMenu();
    });
  }
  
}

export default Menu;
  
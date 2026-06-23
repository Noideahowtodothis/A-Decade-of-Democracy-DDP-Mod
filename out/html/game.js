(function() {
  var game;
  var ui;

  var DateOptions = {hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric' };

  var migratePacifismQuality = function(state) {
    if (state && state.qualities) {
      var qualities = state.qualities;
      if (qualities.pacifism === undefined && qualities.spd_pacifism !== undefined) {
        qualities.pacifism = Math.max(0, Math.min(100, 50 + qualities.spd_pacifism));
      }
      if (qualities.spd_pacifism !== undefined) {
        delete qualities.spd_pacifism;
      }
    }
    return state;
  };

  // Represents elite/business confidence in the government and constitutional system.
  window.eliteSupportRegistry = {
    elite_support: {
      default: 50,
      min: 0,
      max: 100,
      description: "Represents elite/business confidence in the government and constitutional system.",
      helpers: ['increaseEliteSupport', 'decreaseEliteSupport', 'modifyEliteSupport', 'hasEliteSupportAtLeast', 'hasEliteSupportAtMost']
    },
    capital_strike_progress: {
      default: 0,
      deprecated: true,
      replacement: 'elite_support'
    }
  };

  window.clampEliteSupport = function(qualities) {
    if (!qualities) {
      return 50;
    }
    if (qualities.elite_support === undefined || qualities.elite_support === null || isNaN(qualities.elite_support)) {
      qualities.elite_support = 50;
    }
    qualities.elite_support = Math.max(0, Math.min(100, qualities.elite_support));
    return qualities.elite_support;
  };

  window.modifyEliteSupport = function(qualities, amount) {
    if (!qualities) {
      return 50;
    }
    qualities.elite_support = (qualities.elite_support === undefined || qualities.elite_support === null || isNaN(qualities.elite_support) ? 50 : qualities.elite_support) + amount;
    return window.clampEliteSupport(qualities);
  };

  window.increaseEliteSupport = function(qualities, amount) {
    return window.modifyEliteSupport(qualities, Math.abs(amount));
  };

  window.decreaseEliteSupport = function(qualities, amount) {
    return window.modifyEliteSupport(qualities, -Math.abs(amount));
  };

  window.hasEliteSupportAtLeast = function(qualities, threshold) {
    return window.clampEliteSupport(qualities) >= threshold;
  };

  window.hasEliteSupportAtMost = function(qualities, threshold) {
    return window.clampEliteSupport(qualities) <= threshold;
  };

  window.ensureEliteSupportState = function() {
    if (!window.dendryUI || !window.dendryUI.dendryEngine || !window.dendryUI.dendryEngine.state) {
      return;
    }
    var qualities = window.dendryUI.dendryEngine.state.qualities;
    window.clampEliteSupport(qualities);
    if (!qualities.gameplay_variable_registry) {
      qualities.gameplay_variable_registry = {};
    }
    qualities.gameplay_variable_registry.elite_support = window.eliteSupportRegistry.elite_support;
    qualities.gameplay_variable_registry.capital_strike_progress = window.eliteSupportRegistry.capital_strike_progress;
    qualities.gameplay_variables = Object.keys(qualities.gameplay_variable_registry);
  };

  var main = function(dendryUI) {
    ui = dendryUI;
    game = ui.game;

    migratePacifismQuality(ui.dendryEngine.state);
    var originalSetState = ui.dendryEngine.setState;
    ui.dendryEngine.setState = function(state) {
      return originalSetState.call(this, migratePacifismQuality(state));
    };
    window.ensureEliteSupportState();
  };

  // Represents presidential hostility toward parliamentary governance and the current coalition.
  window.clampPresidentialAnger = function(value) {
    value = Number(value) || 0;
    return Math.max(0, Math.min(100, value));
  };

  window.setPresidentialAnger = function(value) {
    var qualities = window.dendryUI.dendryEngine.state.qualities;
    qualities.presidential_anger = window.clampPresidentialAnger(value);
    return qualities.presidential_anger;
  };

  window.increasePresidentialAnger = function(amount) {
    var qualities = window.dendryUI.dendryEngine.state.qualities;
    amount = Number(amount) || 0;
    return window.setPresidentialAnger((qualities.presidential_anger || 0) + amount);
  };

  window.decreasePresidentialAnger = function(amount) {
    var qualities = window.dendryUI.dendryEngine.state.qualities;
    amount = Number(amount) || 0;
    return window.setPresidentialAnger((qualities.presidential_anger || 0) - amount);
  };

  var TITLE = "Social Democracy: An Alternate History" + '_' + "Autumn Chen";

  // the url is a link to game.json
  // test url: https://aucchen.github.io/social_democracy_mods/v0.1.json
  // TODO; 
  window.loadMod = function(url) {
      ui.loadGame(url);
  };

  window.showStats = function() {
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('library')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('library');
    }
  };

  window.showMods = function() {
    window.hideOptions();
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('mod_loader')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('mod_loader');
    }
  };
  
  window.showOptions = function() {
      var save_element = document.getElementById('options');
      window.populateOptions();
      save_element.style.display = "block";
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('options');
              if (target == save_element) {
                  window.hideOptions();
              }
          };
      }
  };

  window.hideOptions = function() {
      var save_element = document.getElementById('options');
      save_element.style.display = "none";
  };

  window.disableBg = function() {
      window.dendryUI.disable_bg = true;
      document.body.style.backgroundImage = 'none';
      window.dendryUI.saveSettings();
  };

  window.enableBg = function() {
      window.dendryUI.disable_bg = false;
      window.dendryUI.setBg(window.dendryUI.dendryEngine.state.bg);
      window.dendryUI.saveSettings();
  };

  window.disableAnimate = function() {
      window.dendryUI.animate = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimate = function() {
      window.dendryUI.animate = true;
      window.dendryUI.saveSettings();
  };

  window.disableAnimateBg = function() {
      window.dendryUI.animate_bg = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimateBg = function() {
      window.dendryUI.animate_bg = true;
      window.dendryUI.saveSettings();
  };

  window.disableAudio = function() {
      window.dendryUI.toggle_audio(false);
      window.dendryUI.saveSettings();
  };

  window.enableAudio = function() {
      window.dendryUI.toggle_audio(true);
      window.dendryUI.saveSettings();
  };

  window.enableImages = function() {
      window.dendryUI.show_portraits = true;
      window.dendryUI.saveSettings();
  };

  window.disableImages = function() {
      window.dendryUI.show_portraits = false;
      window.dendryUI.saveSettings();
  };

  window.enableLightMode = function() {
      window.dendryUI.dark_mode = false;
      document.body.classList.remove('dark-mode');
      window.dendryUI.saveSettings();
  };
  window.enableDarkMode = function() {
      window.dendryUI.dark_mode = true;
      document.body.classList.add('dark-mode');
      window.dendryUI.saveSettings();
  };

  // populates the checkboxes in the options view
  window.populateOptions = function() {
    var disable_bg = window.dendryUI.disable_bg;
    var animate = window.dendryUI.animate;
    var disable_audio = window.dendryUI.disable_audio;
    var show_portraits = window.dendryUI.show_portraits;
    if (disable_bg) {
        $('#backgrounds_no')[0].checked = true;
    } else {
        $('#backgrounds_yes')[0].checked = true;
    }
    if (animate) {
        $('#animate_yes')[0].checked = true;
    } else {
        $('#animate_no')[0].checked = true;
    }
    if (disable_audio) {
        $('#audio_no')[0].checked = true;
    } else {
        $('#audio_yes')[0].checked = true;
    }
    if (show_portraits) {
        $('#images_yes')[0].checked = true;
    } else {
        $('#images_no')[0].checked = true;
    }
    if (window.dendryUI.dark_mode) {
        $('#dark_mode')[0].checked = true;
    } else {
        $('#light_mode')[0].checked = true;
    }
  };

  
  // This function allows you to modify the text before it's displayed.
  // E.g. wrapping chat-like messages in spans.
  window.displayText = function(text) {
      return text;
  };

  // This function allows you to do something in response to signals.
  window.handleSignal = function(signal, event, scene_id) {
  };
  
  // This function runs on a new page. Right now, this auto-saves.
  window.onNewPage = function() {
    window.ensureEliteSupportState();
    var scene = window.dendryUI.dendryEngine.state.sceneId;
    if (scene != 'root' && !window.justLoaded) {
        window.dendryUI.autosave();
    }
    if (window.justLoaded) {
        window.justLoaded = false;
    }
  };

  // TODO: have some code for tabbed sidebar browsing.
  window.updateSidebar = function() {
      window.ensureEliteSupportState();
      $('#qualities').empty();
      var scene = dendryUI.game.scenes[window.statusTab];
      dendryUI.dendryEngine._runActions(scene.onArrival);
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      $('#qualities').append(dendryUI.contentToHTML.convert(displayContent));
  };

  window.setRadioChannel = function(channel) {
      if (!window.dendryUI || !window.dendryUI.dendryEngine) {
          return;
      }
      window.dendryUI.dendryEngine.state.qualities.radio_channel = channel;
      window.updateRadioTopbar();
  };

  window.updateRadioTopbar = function() {
      var radioTopbar = document.getElementById('radio_topbar');
      if (!radioTopbar || !window.dendryUI || !window.dendryUI.dendryEngine) {
          return;
      }
      var radioChannels = {
          0: 'Off',
          1: 'Radio Frankfurt',
          2: 'Radio Berlin',
          3: 'Radio Weimar'
      };
      var radioControls = [
          { label: 'Frankfurt', channel: 1 },
          { label: 'Berlin', channel: 2 },
          { label: 'Weimar', channel: 3 },
          { label: 'Off', channel: 0 }
      ];
      var currentChannel = window.dendryUI.dendryEngine.state.qualities.radio_channel || 0;
      radioTopbar.innerHTML = '';
      radioTopbar.appendChild(document.createTextNode('Radio: ' + (radioChannels[currentChannel] || 'Off') + ' '));
      radioControls.forEach(function(control) {
          var button = document.createElement('button');
          button.type = 'button';
          button.textContent = control.label;
          button.onclick = function() {
              window.setRadioChannel(control.channel);
          };
          radioTopbar.appendChild(button);
      });
  };

  window.changeTab = function(newTab, tabId) {
      if (tabId == 'poll_tab' && dendryUI.dendryEngine.state.qualities.historical_mode) {
          window.alert('Polls are not available in historical mode.');
          return;
      }
      var tabButton = document.getElementById(tabId);
      var tabButtons = document.getElementsByClassName('tab_button');
      for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(' active', '');
      }
      tabButton.className += ' active';
      window.statusTab = newTab;
      window.updateSidebar();
  };

  window.renderDdpCongressDelegateChart = function() {
      var chart = document.getElementById('ddp_congress_delegate_chart');
      if (!chart || typeof renderSeatDots !== 'function' || !window.dendryUI || !window.dendryUI.dendryEngine) {
          return;
      }
      var q = window.dendryUI.dendryEngine.state.qualities;
      renderSeatDots(chart, [
          { label: 'Left Bourgeois', seats: Number(q.ddp_left_bourgeois_delegate_share) || 0, color: '#8C6D31' },
          { label: 'Left Liberals', seats: Number(q.ddp_left_liberal_delegate_share) || 0, color: '#DCCA4A' },
          { label: 'Regionalists', seats: Number(q.ddp_regionalist_delegate_share) || 0, color: '#69A2BE' },
          { label: 'Laborists', seats: Number(q.ddp_laborist_delegate_share) || 0, color: '#E3000F' },
          { label: 'Left Progressives', seats: Number(q.ddp_left_progressive_delegate_share) || 0, color: '#7B68EE' }
      ]);
  };

  window.onDisplayContent = function() {
      window.updateSidebar();
      window.updateRadioTopbar();
      window.renderDdpCongressDelegateChart();
  };

  /*
   * This function copied from the code for Infinite Space Battle Simulator
   *
   * quality - a number between max and min
   * qualityName - the name of the quality
   * max and min - numbers
   * colors - if true/1, will use some color scheme - green to yellow to red for high to low
   * */
  window.generateBar = function(quality, qualityName, max, min, colors) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      var value = document.createElement('div');
      value.className = 'barValue';
      var width = (quality - min)/(max - min);
      if (width > 1) {
          width = 1;
      } else if (width < 0) {
          width = 0;
      }
      value.style.width = Math.round(width*100) + '%';
      if (colors) {
          value.style.backgroundColor = window.probToColor(width*100);
      }
      bar.textContent = qualityName + ': ' + quality;
      if (colors) {
          bar.textContent += '/' + max;
      }
      bar.appendChild(value);
      return bar;
  };


  window.justLoaded = true;
  window.statusTab = "status";
  window.dendryModifyUI = main;
  console.log("Modifying stats: see dendryUI.dendryEngine.state.qualities");

  window.onload = function() {
    window.dendryUI.loadSettings({show_portraits: false});
    if (window.dendryUI.dark_mode) {
        document.body.classList.add('dark-mode');
    }
    window.pinnedCardsDescription = "Advisor cards - actions are only usable once per 6 months.";
  };

}());

/**
 * Copyright 2014 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



var autoplayAllowed = false;
var autoplayRequiresMute = false;
var player;
var wrapperDiv;

function checkUnmutedAutoplaySupport() {
  canAutoplay
    .video({timeout: 100, muted: false})
    .then(({result, error}) => {
        if(result === false) {
          // Unmuted autoplay is not allowed.
          checkMutedAutoplaySupport();
        } else {
          // Unmuted autoplay is allowed.
          autoplayAllowed = true;
          autoplayRequiresMute = false;
          initPlayer();
        }
    })
}

function checkMutedAutoplaySupport() {
  canAutoplay
    .video({timeout: 100, muted: true})
    .then(({result, error}) => {
        if(result === false) {
          // Muted autoplay is not allowed.
          autoplayAllowed = false;
          autoplayRequiresMute = false;
        } else {
          // Muted autoplay is allowed.
          autoplayAllowed = true;
          autoplayRequiresMute = true;
        }
        initPlayer();
    })
}

function initPlayer() {
  var vjsOptions = {
    autoplay: autoplayAllowed,
    muted: autoplayRequiresMute,
    debug: true
  }
  player = videojs('content_video', vjsOptions);

  var imaOptions = {
    id: 'content_video',
    adTagUrl: 'https://adn.pilotx.tv/op?pid=2'

  };
  player.ima(imaOptions);

  if (!autoplayAllowed) {
    if (navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/Android/i)) {
      startEvent = 'touchend';
    }

    wrapperDiv = document.getElementById('content_video');
    wrapperDiv.addEventListener(startEvent, initAdDisplayContainer);
  }
}

function initAdDisplayContainer() {
    player.ima.initializeAdDisplayContainer();
    wrapperDiv.removeEventListener(startEvent, initAdDisplayContainer);
}

var startEvent = 'click';
checkUnmutedAutoplaySupport();

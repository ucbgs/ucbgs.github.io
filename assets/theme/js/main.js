/**
 * Copyright 2022
 *
 * @author codelug
 * @version 1.0
 */
(function ($) {
  "use strict";
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
      trigger: "hover",
    });
  });
  // language
  var __ = function (msgid) {
    return window.i18n[msgid] || msgid;
  };
  // more & less
  var showChar = 300;
  var ellipsestext = "...";
  var moretext = __("more");
  var lesstext = __("less");

  $('[data-more=""]').each(function () {
    var content = $(this).html();

    if (content.length > showChar) {
      var c = content.substr(0, showChar);
      var h = content.substr(showChar, content.length - showChar);

      var html =
        c +
        '<span class="more-content">' +
        ellipsestext +
        '</span><span class="morecontent"><span>' +
        h +
        '</span><div class="more">' +
        moretext +
        "</div></span>";

      $(this).html(html);
    }
  });
  // earn xp
  if ($('input[name="game_id"]').length) {
    setTimeout(function () {
      var game_id = $('input[name="game_id"]').val();
      $.ajax({
        url: Base + "/ajax/earnxp",
        type: "post",
        data: {
          game_id: game_id,
        },
      });
    }, 5000);
  }
  // cookie modal
  $("body").on("click", ".close-register", function (e) {
    localStorage.setItem("modal_cookie", 1);
    $registerModal.addClass("d-none");
  });

  // cookie
  var $registerModal = $(".modal-register");
  var $registerCookies = localStorage.getItem("modal_cookie");
  if (!$registerCookies) {
    $registerModal.removeClass("d-none");
  } else {
    $registerModal.addClass("d-none");
  }

  // Cover Select
  $(document).on("click", ".btn-upload", function () {
    var id = $(this).attr("data-id");
    $("#file-" + id).click();
    return false;
  });

  $(document).on("click", ".btn-clear", function () {
    var id = $(this).attr("data-id");
    $("." + id).val("");
    $(".ratio-preview").removeClass("d-none");
    $("." + id).css("background-image", "");
    $(".btn-clear").addClass("d-none");
    return false;
  });
  $(document).on("change", ".ratio-input", function () {
    var id = $(this).attr("data-preview");
    $(".btn-clear").removeClass("d-none");
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("." + id).css("background-image", "url(" + e.target.result + ")");
        $(".ratio-preview").addClass("d-none");
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  // show more
  $(document).on("click", ".more", function () {
    if ($(this).hasClass("less")) {
      $(this).removeClass("less");
      $(this).html(moretext);
    } else {
      $(this).addClass("less");
      $(this).html(lesstext);
    }
    $(this).parent().prev().toggle();
    $(this).prev().toggle();
    return false;
  });
  $(document).on("change", ".category-input", function () {
    $('form[name="filter"]').submit();
  });
  // rating
  $(".rating input:radio").attr("checked", false);

  $(".rating input").click(function () {
    $(".rating span").removeClass("checked");
    $(this).parent().addClass("checked");
  });
  $(document).on("lazybeforeunveil lazyloaded", function (e) {
    $(e.target).closest("picture").addClass("lazyloaded");
  });
  // game iframe
  if ($("iframe.game-iframe").length) {
    let iframe = $("iframe.game-iframe");
    let size = {
      width: Number(iframe.attr("width")),
      height: Number(iframe.attr("height")),
    };
    let ratio = (size.height / size.width) * 100;
    let win_ratio = (window.innerHeight / window.innerWidth) * 100;
    if (win_ratio <= 110) {
      if (ratio > 80) {
        ratio = 80;
      }
    } else if (win_ratio >= 130) {
      if (ratio < 100) {
        ratio = 100;
      }
    }
    $(".game-ratio").css("--bs-aspect-ratio", ratio + "%");
  }
  // fullscreen btn
  $(document).on("click", ".btn-fullscreen", function () {
    var iframe = document.querySelector("iframe.game-iframe");

    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    } else if (iframe.mozRequestFullScreen) {
      iframe.mozRequestFullScreen();
    } else if (iframe.msRequestFullscreen) {
      iframe.msRequestFullscreen();
    } else if (iframe.webkitEnterFullscreen) {
      // For iOS Safari
      iframe.webkitEnterFullscreen();
    }
  });

  // Bootstrap remote modal
  $(document).on("click", '[data-bs-toggle="modal"]', function () {
    $($(this).data("bs-target") + " .modal-dialog").load($(this).data("remote"), function () {});
  });
  $(".modal").on("hide.bs.modal", function (e) {
    $(".modal-dialog").html("");
  });

  // share click
  $("body").on(
    {
      click: function () {
        var $this = $(this),
          dataType = $this.attr("data-type"),
          dataTitle = $this.attr("data-title"),
          dataMedia = $this.attr("data-media"),
          dataSef = $this.attr("data-sef");

        switch (dataType) {
          case "facebook":
            shareWindow("https://www.facebook.com/sharer/sharer.php?u=" + dataSef);
            break;

          case "twitter":
            shareWindow("https://twitter.com/intent/tweet?text=" + encodeURIComponent(dataTitle) + " " + encodeURIComponent(dataSef));
            break;

          case "whatsapp":
            shareWindow("whatsapp://send?text=" + encodeURIComponent(dataTitle) + " " + encodeURIComponent(dataSef));
            break;
          case "telegram":
            shareWindow("https://t.me/share/url?url=" + encodeURIComponent(dataSef) + "&text=" + encodeURIComponent(dataTitle) + " 🎮 ");
            break;
        }

        function shareWindow(url) {
          window.open(url, "_blank");
        }
      },
    },
    ".btn-share"
  );
})(jQuery);

function createCookie(name, value, days) {
  var expires;

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toGMTString();
  } else {
    expires = "";
  }
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = encodeURIComponent(name) + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, "", -1);
}

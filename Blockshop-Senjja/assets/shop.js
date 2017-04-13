var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

$(document).foundation();

jQuery(function($) {
  var DOC, FullscreenSlider, HEADER, PAGE, VideoModal, WINDOW, addToCart, addToCartFail, addToCartPass, cart_dropdown_timer, current_window, fadeOutCartDropdown, first_article_img, getLowInStockAmount, getLowInStockMessage, imgZoom, instagramFeed, isFirefox, isProductZoomEnabled, log, mainMenu, matchImageHeights, mediaQueries, mobileMenu, mq_large, mq_medium, mq_small, openMobileModal, page_content, photos, pinterest_button, popup, positions, productModal, productSlider, promoBar, recentCartItemPopUp, refreshSizeChart, reloadProductSection, searchAndAccount, showSizeChart, slideDownCartDropdown, smallPromos, startTimer, stickyFooter, stopResetTimer, thumbs, toggleCartDropdown, touchevents_exist, transparentMenuIsEnabled, updateActiveImg, updateLowInStock, validateSize;
  PAGE = $('body');
  DOC = $(document);
  WINDOW = $(window);
  HEADER = $('.main-header');
  touchevents_exist = Modernizr.touchevents;
  mq_small = 768;
  mq_medium = 1280;
  mq_large = 1440;
  log = function(value) {
    if (typeof console !== "undefined") {
      return console.log(value);
    }
  };
  transparentMenuIsEnabled = function() {
    return PAGE.find("[data-has-transparent-menu=true]").length > 0;
  };
  stickyFooter = function() {
    var total_content_height;
    total_content_height = $('.main-header').outerHeight() + $('.main-content').outerHeight() + $('.main-footer').outerHeight();
    if (WINDOW.outerHeight() > total_content_height) {
      return $('.main-content').css({
        'min-height': WINDOW.outerHeight() - $('.main-header').outerHeight() - $('.main-footer').outerHeight()
      });
    }
  };
  stickyFooter();
  WINDOW.resize(function() {
    return stickyFooter();
  });
  if (general_external_links_enabled) {
    $('a[href^="http"]').not('a[href^="' + shop_url + '"]').attr('target', '_blank');
  }
  if (popup_config.enabled) {
    $.preloadImages = function() {
      var i;
      i = 0;
      while (i < arguments.length) {
        $('<img />').attr('src', arguments[i]);
        i++;
      }
    };
    $.preloadImages(theme.preload_image);
  }
  popup = function(clazz) {
    var checkContentOverflow, closeDialog, eventListeners, fillPopupDialog, fillSizeChartDialog, getCustomClasses, getImage, getNewsletter, getPageContent, getSocialIcons, getWrapper, hideMask, ieCenter, isExpired, mask, maskIsActive, modal, modal_clazz, openDialog, passesExpiration, resetExpiration, showMask, storeExpiration;
    modal = null;
    modal_clazz = clazz;
    mask = $('.popup-modal-mask');
    storeExpiration = function() {
      var date, e, error, expires, object, seconds_from_now;
      date = new Date();
      seconds_from_now = 1000 * 60 * 60 * 24 * popup_config.days_until;
      expires = date.setTime(date.getTime() + seconds_from_now);
      object = {
        expires: expires
      };
      try {
        return localStorage[popup_config.storage_key] = JSON.stringify(object);
      } catch (error) {
        e = error;
        return false;
      }
    };
    resetExpiration = function() {
      localStorage.removeItem(popup_config.storage_key);
      return storeExpiration();
    };
    isExpired = function() {
      var expires, now, object;
      object = JSON.parse(localStorage[popup_config.storage_key]);
      expires = object.expires;
      now = new Date().getTime();
      if (parseFloat(expires - now) <= 0) {
        resetExpiration();
        return true;
      }
      return false;
    };
    passesExpiration = function() {
      var passed;
      passed = false;
      if (Storage === "undefined" || popup_config.days_until === "test_mode") {
        passed = true;
      } else if (typeof localStorage[popup_config.storage_key] === "undefined") {
        passed = true;
        storeExpiration();
      } else {
        passed = isExpired();
      }
      return passed;
    };
    maskIsActive = function() {
      return $('.popup-modal').is(':visible') || $('.modal-mask').length > 0 && $('.modal-mask').is(':visible');
    };
    showMask = function() {
      mask.show();
      return PAGE.addClass("modal-on");
    };
    hideMask = function() {
      mask.hide();
      return PAGE.removeClass("modal-on");
    };
    getImage = function() {
      if (popup_config.show_image_enabled === false) {
        return "";
      }
      if (popup_config.image_link.length > 0) {
        return $('<div class="popup-image"> <a href="' + popup_config.image_link + '">' + popup_config.show_image_url + '</a> </div>');
      } else {
        return $('<div class="popup-image">').append(popup_config.show_image_url);
      }
    };
    getNewsletter = function() {
      var subscribe_module;
      if (popup_config.newsletter_enabled === false) {
        return "";
      }
      subscribe_module = $("<div id='subscribe_module'></div>").append($("#mailing-list-module > p").clone()).append($("#mailing-list-module #contact_form").clone()).append($("#mc-embedded-subscribe-form").clone());
      return subscribe_module;
    };
    getSocialIcons = function() {
      if (popup_config.social_icons_enabled === false) {
        return "";
      }
      return $(".social-follow").clone();
    };
    getCustomClasses = function() {
      var class_list;
      class_list = "";
      class_list += popup_config.show_image_enabled === true ? " has-image" : " has-no-image";
      class_list += popup_config.page_content.length > 0 ? " has-page-content" : " has-no-page-content";
      class_list += popup_config.newsletter_enabled ? " has-newsletter" : " has-no-newsletter";
      class_list += popup_config.social_icons_enabled ? " has-social-icons" : " has-no-social-icons";
      return class_list;
    };
    getWrapper = function() {
      return '<dialog class="' + modal_clazz + ' popup-modal' + getCustomClasses() + '" />';
    };
    getPageContent = function() {
      var page_content;
      page_content = null;
      if (popup_config.page_content.length < 1) {
        return "";
      }
      $.getJSON('/pages/' + popup_config.page_content + '.json', function(data, textStatus) {
        return page_content = "<div class='page-contents'>" + data.page.body_html + "</div>";
      });
      return page_content;
    };
    fillSizeChartDialog = function() {
      var dialog;
      if ($('.popup-modal.size-chart').length < 1) {
        dialog = {
          wrapper: getWrapper()
        };
        PAGE.append($(dialog.wrapper).append($('.size-chart')));
      }
      return openDialog();
    };
    fillPopupDialog = function() {
      var dialog, getInnerContent, render;
      dialog = {
        wrapper: getWrapper(),
        newsletter: getNewsletter(),
        social_icons: getSocialIcons(),
        image: getImage()
      };
      getInnerContent = function() {
        if (popup_config.page_content.length < 1 && popup_config.newsletter_enabled === false && popup_config.social_icons_enabled === false) {
          return "";
        }
        return $("<div class='inner' />").append(dialog.body, dialog.newsletter, dialog.social_icons);
      };
      render = function() {
        PAGE.append($(dialog.wrapper).append(dialog.image, getInnerContent()));
        return openDialog();
      };
      if (popup_config.page_content.length > 0) {
        return $.getJSON('/pages/' + popup_config.page_content + '.json', function(data, textStatus) {
          dialog['body'] = "<div class='page-contents'>" + data.page.body_html + "</div>";
          return render();
        });
      } else {
        return render();
      }
    };
    checkContentOverflow = function() {
      return setTimeout((function() {
        if (modal.length > 0 && $('.popup-modal-mask').is(':visible')) {
          return modal.imagesLoaded(function() {
            var dialog_height;
            dialog_height = $('dialog[class*="' + modal_clazz + '"]:last-of-type').outerHeight();
            if (dialog_height >= WINDOW.height()) {
              return PAGE.addClass('modal-unfix');
            } else {
              return PAGE.removeClass('modal-unfix');
            }
          });
        }
      }), 0);
    };
    ieCenter = function() {
      return modal.css({
        marginTop: -(modal.outerHeight() * 0.5) + "px",
        marginLeft: -(modal.outerWidth() * 0.5) + "px"
      });
    };
    openDialog = function() {
      modal = $('dialog[class*="' + modal_clazz + '"]');
      if ($("html").hasClass("ie9")) {
        ieCenter();
      }
      eventListeners();
      modal.addClass("opened").removeClass("closed");
      checkContentOverflow();
      return showMask();
    };
    eventListeners = function() {
      var removeAnimation;
      removeAnimation = function(event) {
        if (event.originalEvent.animationName === 'modal-close') {
          if (modal_clazz === 'popup') {
            return modal.remove();
          } else {
            return modal.removeClass('closed, completed');
          }
        } else {
          return modal.addClass('completed').removeClass('opened');
        }
      };
      DOC.on('click', '.popup-modal', function(e) {
        e.stopPropagation();
        if (e.target === this) {
          return closeDialog();
        }
      });
      $('.popup-modal-close').click(closeDialog);
      mask.click(closeDialog);
      modal.on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', removeAnimation);
      WINDOW.resize(checkContentOverflow);
      DOC.keydown(function(e) {
        if (modal.hasClass('completed') && e.keyCode === 27) {
          return closeDialog();
        }
      });
      return $('dialog.popup-modal #contact_form').on('submit', function(event) {
        var form;
        form = this;
        modal = $(this).closest('.popup-modal');
        modal.find('.error, .success').remove();
        event.preventDefault();
        if (modal.find('input[type="email"]').val().length === 0) {
          modal.find('.inner').prepend('<p class="error">' + theme.translation.newsletter_email_blank + '</p>');
          return false;
        } else {
          modal.find('.inner > *').hide();
          modal.find('.inner').prepend('<p class="success">' + theme.translation.newsletter_success_message + '</p>').show();
          setTimeout(function() {
            return form.submit();
          }, 500);
        }
        return false;
      });
    };
    closeDialog = function() {
      modal.addClass('closed').removeClass('completed').removeClass('opened');
      return hideMask();
    };
    if (modal_clazz !== 'popup') {
      return fillSizeChartDialog();
    } else {
      if (popup_config.enabled && passesExpiration() && (popup_config.page_content.length > 0 || popup_config.newsletter_enabled || popup_config.show_image_enabled || popup_config.social_icons_enabled)) {
        return setTimeout((function() {
          if (!(maskIsActive() === true || $('.popup-modal-mask').length < 1)) {
            return fillPopupDialog();
          }
        }), popup_config.seconds_until * 1000);
      }
    }
  };
  popup('popup');
  DOC.on('click', '.size-chart-trigger', function(e) {
    e.preventDefault();
    return popup('size-chart-container');
  });
  searchAndAccount = function() {
    $('.searchbar-open').click(function() {
      $(this).closest('.menu').fadeOut(100, function() {
        $('.main-header .searchbar-container').fadeIn(200);
        return $('.main-header .searchbar-container .search-box').focus();
      });
      return false;
    });
    $('.searchbar-close').click(function() {
      $('.main-header .searchbar-container').fadeOut(100, function() {
        return $('.search-account .menu').fadeIn(200);
      });
      return false;
    });
   /* $('.account-open').click(function() {
      $(this).closest('.menu').fadeOut(100, function() {
        return $('.account-container').fadeIn(200);
      });
      return false;
    });*/
    return $('.account-close').click(function() {
      $('.account-container').fadeOut(100, function() {
        return $('.search-account .menu').fadeIn(200);
      });
      return false;
    });
  };
  searchAndAccount();
  mainMenu = function() {
    var container, dropdown_panel, links, main_header, main_menu_dropdown_timer, slideUpPanel, startTimer, stopResetTimer;
    dropdown_panel = $(".main-menu-dropdown-panel .row");
    HEADER = $('.main-header');
    main_header = $(".template-index .main-header");
    container = $('.main-header .menu-container');
    links = container.find('.nav-item').has('.sub-nav').addClass('dropdown').find('> a');
    links.append('<svg class="fw--icon fw--icon--expand-more"><use xlink:href="#fw--icon--expand-more" /></svg>');
    container.find('.nav-item').has('.sub-nav ul').find('.columns').addClass('large-3');
    container.find('.nav-item').has('.sub-nav ul').find('.columns > a > span').wrap('<h3 class="title"></div>');
    HEADER.find(".main-menu .widescreen .dropdown > a").click(function() {
      var autoHeight, curHeight, dropdown, sub_nav;
      dropdown = $(this).parent();
      sub_nav = dropdown.find(".sub-nav .columns");
      if (PAGE.hasClass('template-index') && transparentMenuIsEnabled() && touchevents_exist) {
        if ($('.main-header').hasClass('dropdown-open')) {
          if (dropdown.hasClass("active")) {
            startTimer();
          }
        } else {
          $('.main-header .bg').fadeIn();
        }
      }
      if (dropdown.hasClass("active")) {
        slideUpPanel();
      } else if ($('.main-header').hasClass('dropdown-open')) {
        dropdown_panel.find(".columns").animate({
          opacity: 0
        }, 200);
        dropdown_panel.find('.columns').remove();
        HEADER.find(".main-menu .dropdown").removeClass('active');
        dropdown.addClass("active");
        sub_nav.clone().appendTo(".main-menu-dropdown-panel .row");
        dropdown_panel.find(".columns").delay(200).animate({
          opacity: 1
        }, 200);
        curHeight = dropdown_panel.height();
        autoHeight = dropdown_panel.css('height', 'auto').outerHeight();
        dropdown_panel.height(curHeight).animate({
          height: autoHeight
        }, 400);
      } else {
        dropdown_panel.find('.columns').remove();
        $('.main-header').addClass('dropdown-open');
        dropdown.addClass("active");
        sub_nav.clone().appendTo(".main-menu-dropdown-panel .row");
        dropdown_panel.slideDown(400, function() {
          return dropdown_panel.css("height", dropdown_panel.outerHeight());
        });
        dropdown_panel.find(".columns").delay(200).animate({
          opacity: 1
        }, 200);
      }
      return false;
    });
    slideUpPanel = function() {
      $('.main-header').removeClass('dropdown-open');
      dropdown_panel.find(".columns").animate({
        opacity: 0
      }, 200);
      return dropdown_panel.delay(200).slideUp(function() {
        HEADER.find(".main-menu .dropdown").removeClass('active');
        dropdown_panel.find('.columns').remove();
        return dropdown_panel.css('height', 'auto');
      });
    };
    main_menu_dropdown_timer = '';
    if (!touchevents_exist) {
      HEADER.mouseenter(function() {
        if (PAGE.hasClass('template-index') && transparentMenuIsEnabled()) {
          $('.main-header .bg').fadeIn();
        }
        return stopResetTimer();
      }).mouseleave(function() {
        if ($('.main-header').hasClass('dropdown-open')) {
          return startTimer();
        } else {
          if (PAGE.hasClass('template-index') && main_header.css("position") === "absolute") {
            return $('.main-header .bg').stop(true, true).fadeOut();
          }
        }
      });
    }
    startTimer = function() {
      return main_menu_dropdown_timer = setTimeout((function() {
        slideUpPanel();
        if (PAGE.hasClass('template-index') && transparentMenuIsEnabled()) {
          return $('.main-header .bg').delay(300).fadeOut();
        }
      }), 500);
    };
    return stopResetTimer = function() {
      return clearTimeout(main_menu_dropdown_timer);
    };
  };
  mainMenu();
  mobileMenu = function() {
    var dropdown_links, mobile_menu, mobile_menu_link;
    mobile_menu_link = $('.mobile-tools .menu');
    mobile_menu = $('.mobile-menu');
    mobile_menu.find('.nav-item').has('.sub-nav').find('> .nav-item-link').addClass('dropdown-link');
    mobile_menu.find('.nav-item').has('.sub-nav').find('> .nav-item-link').append('<svg class="fw--icon fw--icon--plus"><use xlink:href="#fw--icon--plus" /></svg><svg class="fw--icon fw--icon--minus"><use xlink:href="#fw--icon--minus" /></svg>');
    mobile_menu.find('.nav-item').has('.sub-nav ul').find('.columns > a > span').css('text-transform', 'uppercase');
    dropdown_links = mobile_menu.find("a.dropdown-link");
    mobile_menu_link.click(function() {
      mobile_menu.toggle();
      return false;
    });
    return dropdown_links.click(function() {
      var sub_menu;
      sub_menu = $(this).closest('li').find('.sub-nav:eq(0)');
      sub_menu.slideToggle();
      $(this).find('.fw--icon--plus').toggle();
      $(this).find('.fw--icon--minus').toggle();
      return false;
    });
  };
  mobileMenu();
  instagramFeed = function() {
    var access_token, getImages, items_to_load;
    access_token = $('.instagram-widget').data('instagramAccessToken') || "";
    if (access_token.length < 1 || $('.instagram-widget').length < 1) {
      return false;
    }
    items_to_load = 6;
    if (!$('.twitter-widget').length && !$('.blog-widget').length) {
      items_to_load += 6;
      $('.instagram-widget .items').addClass('wide');
    }
    getImages = function() {
      return $.ajax({
        dataType: "jsonp",
        url: 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + access_token + '&count=' + items_to_load,
        success: function(response) {
          var data, i, img_src, j, ref, results;
          if (response.meta.code === 200) {
            data = response.data;
            results = [];
            for (i = j = 0, ref = items_to_load - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
              if (data[i]) {
                img_src = data[i].images.low_resolution.url;
                img_src = img_src.replace("http:", "https:");
                results.push($('.instagram-widget .items').append('<a class="item" target="_blank" href="' + data[i].link + '"><img src="' + img_src + '" /></a>'));
              } else {
                results.push(void 0);
              }
            }
            return results;
          } else {
            return $('.instagram-widget .items').append('<p class="error">' + response.meta.error_message + '</p><p class="colored-links">Check the <strong>Homepage - social feeds</strong> section in your <a target="_blank" href="/admin/themes">theme settings</a>.</p>');
          }
        },
        error: function(jqXHR, textStatus) {
          console.log(jqXHR);
          return console.log(textStatus);
        }
      });
    };
    return getImages();
  };
  VideoModal = (function() {
    function VideoModal(video) {
      this.createIframe = bind(this.createIframe, this);
      this.extractVideoId = bind(this.extractVideoId, this);
      this.extractVideoType = bind(this.extractVideoType, this);
      this.eventListeners = bind(this.eventListeners, this);
      this.centerPosition = bind(this.centerPosition, this);
      this.close = bind(this.close, this);
      this.open = bind(this.open, this);
      this.opened = false;
      this.video = video;
      this.modal = $('.video.modal');
      this.player_button = video.find('.player-button');
      this.src_url = video.find('.play-button').attr('href');
      this.type = this.extractVideoType();
      this.id = this.extractVideoId();
      this.iframe = this.createIframe();
      this.caption = video.find('.caption');
    }

    VideoModal.prototype.open = function() {
      this.opened = true;
      this.modal.find(".flex-video").append(this.iframe);
      if (this.caption.length > 0) {
        this.modal.find(".caption").append(this.caption.html());
        this.modal.addClass("wide");
      } else {
        this.modal.find(".player").removeClass('large-8');
        this.modal.find('.caption').hide();
        this.modal.removeClass("wide");
      }
      this.player_button.hide();
      $('.modal-mask').show();
      this.modal.find('.close').show();
      this.modal.fadeIn();
      this.centerPosition();
      $(".modal").fadeIn(0);
      return this.eventListeners();
    };

    VideoModal.prototype.close = function() {
      this.opened = false;
      this.modal.find(".flex-video").empty();
      this.modal.find(".caption").empty();
      this.modal.hide();
      $('.modal-mask').fadeOut();
      if (this.caption.length === 0) {
        this.modal.find(".player").addClass('large-8');
        return this.modal.find('.caption').show();
      }
    };

    VideoModal.prototype.centerPosition = function() {
      if (WINDOW.height() < this.modal.outerHeight()) {
        return this.modal.css({
          'position': 'absolute',
          'top': '30px',
          'margin-top': 0,
          'margin-left': -(this.modal.outerWidth() / 2)
        });
      } else {
        return this.modal.css({
          'position': 'fixed',
          'top': '50%',
          'margin-top': -(this.modal.outerHeight() / 2),
          'margin-left': -(this.modal.outerWidth() / 2)
        });
      }
    };

    VideoModal.prototype.eventListeners = function() {
      var modal;
      modal = this;
      this.modal.find('.close').on('click', function() {
        return modal.close();
      });
      WINDOW.resize(function() {
        return modal.centerPosition();
      });
      DOC.keydown(function(e) {
        if (modal.opened) {
          if (e.keyCode === 27) {
            return modal.close();
          }
        }
      });
      $('.modal-mask').on('click', function() {
        return modal.close();
      });
      return this.player_button.on('click', function() {
        return false;
      });
    };

    VideoModal.prototype.extractVideoType = function() {
      var matches, re;
      re = /\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9_\-]+)/i;
      matches = re.exec(this.src_url);
      if (matches) {
        return 'youtube';
      } else {
        re = /^.*(vimeo)\.com\/(?:watch\?v=)?(.*?)(?:\z|$|&)/;
        matches = re.exec(this.src_url);
        if (matches) {
          return 'vimeo';
        }
      }
      return false;
    };

    VideoModal.prototype.extractVideoId = function() {
      var match, regExp;
      if (this.type === 'youtube') {
        regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        match = this.src_url.match(regExp);
        if (match && match[2].length === 11) {
          return match[2];
        }
      } else if (this.type === "vimeo") {
        regExp = /^.*(vimeo)\.com\/(?:watch\?v=)?(.*?)(?:\z|$|&)/;
        match = this.src_url.match(regExp);
        if (match) {
          return match[2];
        }
      }
    };

    VideoModal.prototype.createIframe = function() {
      if (this.type === "youtube") {
        return '<iframe  src="//www.youtube.com/embed/' + this.id + '?autoplay=1&rel=0" frameborder="0" allowfullscreen></iframe>';
      } else if (this.type === "vimeo") {
        return '<iframe src="//player.vimeo.com/video/' + this.id + '?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff&amp;autoplay=1?" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
      }
    };

    return VideoModal;

  })();
  productModal = function() {
    var changeModal, closeModal, modal, modal_controls, modal_init, modal_length, modal_open, openModal, resizeModal;
    modal = $('.modal');
    if ($('.modal').length && $('.section-product-template').data('productModalEnabled')) {
      modal_length = $("article .photos .photo").length;
      modal_init = false;
      modal_open = false;
      modal.find('.loading').spin('small');
      if (modal_length > 1) {
        modal.addClass("with-nav");
        modal_controls = modal.find('.control, .popup-modal-close');
      } else {
        modal_controls = modal.find('.popup-modal-close');
      }
      resizeModal = function() {
        var active_photo, height_ratio, image_height, image_width, width_ratio, window_height, window_width;
        active_photo = modal.find('.photo.active');
        image_width = active_photo.naturalWidth();
        image_height = active_photo.naturalHeight();
        window_width = WINDOW.width();
        window_height = WINDOW.height();
        width_ratio = image_width / window_width;
        height_ratio = image_height / window_height;
        if (width_ratio > height_ratio && width_ratio > .90) {
          image_width = image_width * .90 / width_ratio;
          image_height = image_height * .90 / width_ratio;
        } else if (width_ratio < height_ratio && height_ratio > .90) {
          image_width = image_width * .90 / height_ratio;
          image_height = image_height * .90 / height_ratio;
        }
        modal.css({
          'width': image_width,
          'height': image_height,
          'margin-top': -(image_height / 2),
          'margin-left': -(image_width / 2)
        });
        return active_photo.css({
          'height': image_height
        });
      };
      openModal = function(index) {
        var active_photo;
        modal_open = true;
        if (!modal_init) {
          $("article .photos .photo").each(function() {
            return modal.find(".slides").append($('<img />').attr('src', $(this).attr('href')).addClass('photo'));
          });
          modal_init = true;
        }
        $('.modal-mask').show();
        modal.fadeIn();
        active_photo = $(".modal img").eq(index);
        active_photo.addClass('active');
        return modal.find(".photo.active").imagesLoaded(function() {
          modal.find(".loading").hide();
          modal_controls.show();
          modal.find(".slides").show();
          return resizeModal();
        });
      };
      $('.photos .container').on('click', function() {
        var index;
        if (current_window === 'small') {
          return false;
        }
        index = $(this).find('.photo.active').index();
        return openModal(index);
      });
      closeModal = function() {
        modal_open = false;
        modal.find(".photo.active").removeClass("active");
        modal.css('display', 'none');
        return $('.modal-mask').fadeOut();
      };
      modal.find('.popup-modal-close').on('click', function() {
        return closeModal();
      });
      $('.modal-mask').on('click', function() {
        return closeModal();
      });
      changeModal = function(direction) {
        var active_index, active_photo, new_index, photo_length;
        active_photo = modal.find('.photo.active');
        active_index = modal.find('.photo.active').index();
        photo_length = modal.find('.photo').length;
        if (direction === 'prev') {
          if (active_index === 0) {
            new_index = photo_length - 1;
          } else {
            new_index = active_index - 1;
          }
        }
        if (direction === 'next') {
          if (active_index === photo_length - 1) {
            new_index = 0;
          } else {
            new_index = active_index + 1;
          }
        }
        active_photo.removeClass('active');
        modal_controls.hide();
        modal.find(".loading").delay(50).fadeIn(0);
        return modal.find('.photo').eq(new_index).imagesLoaded(function() {
          modal.find(".loading").stop(true, true).fadeOut(0);
          modal_controls.show();
          modal.find('.photo').eq(new_index).addClass('active');
          return resizeModal();
        });
      };
      modal.find('.prev').on('click', function() {
        return changeModal('prev');
      });
      modal.find('.next').on('click', function() {
        return changeModal('next');
      });
      modal.find('.slides').on('click', function() {
        return changeModal('next');
      });
      DOC.keydown(function(e) {
        if (modal_open) {
          if (e.keyCode === 37 && modal_length > 1) {
            changeModal('prev');
          }
          if (e.keyCode === 39 && modal_length > 1) {
            changeModal('next');
          }
          if (e.keyCode === 27) {
            return closeModal();
          }
        }
      });
      if (modal_init) {
        return WINDOW.resize(function() {
          return resizeModal();
        });
      }
    }
  };
  $('.accordion.headings').each(function() {
    return $(this).add($(this).next('.accordion.content')).wrapAll("<div class='accordion-wrapper'/>");
  });
  $('.accordion.headings li').wrapInner('<div class="trigger"></div>');
  $('.accordion.headings li .trigger').append('<div class="bg"></div>');
  $('.accordion-wrapper').each(function() {
    var accordion_content, accordion_heading;
    accordion_heading = $(this).find('.accordion.headings > li');
    accordion_content = $(this).find('.accordion.content > li');
    accordion_heading.first().addClass('active');
    accordion_content.each(function(index) {
      var content;
      content = $('<div class="content">' + $(this).html() + '</div>');
      return content.appendTo(accordion_heading.eq(index));
    });
    accordion_content.remove();
    $(this).find('.content').first().show();
    return $(this).find('.trigger').on("click", function() {
      var panels, this_panel;
      panels = $(this).closest(".accordion").find('.content');
      this_panel = $(this).closest("li").find(".content");
      panels.not(this_panel).slideUp(200);
      this_panel.slideDown(200, function() {
        if (general_scroll_to_active_item) {
          return $('html, body').animate({
            scrollTop: this_panel.offset().top - 100
          });
        }
      });
      $(this).closest(".accordion").find("li").removeClass("active");
      return $(this).closest("li").addClass("active");
    });
  });
  $('.tabs-horizontal.headings').each(function() {
    return $(this).add($(this).next('.tabs.content')).wrapAll("<div class='tabs-wrapper horizontal'/>");
  });
  $('.tabs-horizontal.headings li').wrapInner('<div class="trigger"></div>');
  $('.tabs-horizontal.headings li .trigger').append('<div class="bg"></div>');
  $('.tabs-wrapper.horizontal').each(function() {
    var tab_content, tab_headings;
    tab_headings = $(this).find('.headings > li');
    tab_content = $(this).find('.tabs.content > li');
    tab_content.first().addClass('active');
    tab_headings.first().addClass('active');
    return tab_headings.on('click', function() {
      tab_headings.removeClass('active');
      tab_content.removeClass('active');
      $(this).addClass('active');
      return tab_content.eq($(this).index()).addClass('active');
    });
  });
  $('.tabs-vertical.headings').each(function() {
    return $(this).add($(this).next('.tabs.content')).wrapAll("<div class='tabs-wrapper vertical'/>");
  });
  $('.tabs-vertical.headings li').wrapInner('<div class="trigger"></div>');
  $('.tabs-vertical.headings li .trigger').append('<div class="bg"></div>');
  $('.tabs-wrapper.vertical').each(function() {
    var tab_content, tab_headings, tab_wrapper;
    tab_wrapper = $(this);
    tab_headings = $(this).find('.headings > li');
    tab_content = $(this).find('.tabs.content > li');
    tab_content.first().addClass('active');
    tab_headings.first().addClass('active');
    return tab_headings.on('click', function() {
      tab_headings.removeClass('active');
      tab_content.removeClass('active');
      $(this).addClass('active');
      tab_content.eq($(this).index()).addClass('active');
      if (general_scroll_to_active_item) {
        if (matchMedia('only screen and (min-width: ' + mq_small + 'px)').matches || $("html").hasClass("lt-ie9")) {
          return $('html, body').animate({
            scrollTop: tab_wrapper.offset().top - 50
          }, 'slow');
        } else {
          return $('html, body').animate({
            scrollTop: tab_wrapper.offset().top + tab_wrapper.find('.headings').outerHeight() - 50
          }, 'slow');
        }
      }
    });
  });
  $('.cart-form').submit(function() {
    addToCart($(this));
    return false;
  });
  $('.recently-added.mobile .close').on('click', function() {
    return fadeOutCartDropdown();
  });
  $('.recently-added-mask').on('click', function() {
    return fadeOutCartDropdown();
  });
  cart_dropdown_timer = '';
  toggleCartDropdown = function() {
    return $('.main-header .recently-added').slideToggle('fast');
  };
  slideDownCartDropdown = function() {
    $('.main-header .recently-added').slideDown('fast');
    return $("html, body").animate({
      scrollTop: 0
    });
  };
  openMobileModal = function() {
    $('.main-header .recently-added.mobile').fadeIn();
    return $('.main-header .recently-added-mask').removeClass('hide');
  };
  fadeOutCartDropdown = function() {
    clearTimeout(cart_dropdown_timer);
    $('.main-header .recently-added').fadeOut('fast');
    return $('.main-header .recently-added-mask').addClass('hide');
  };
  $('.main-header .recently-added').mouseenter(function() {
    return stopResetTimer();
  });
  $('.main-header .recently-added').mouseleave(function() {
    return startTimer();
  });
  startTimer = function() {
    return cart_dropdown_timer = setTimeout((function() {
      return fadeOutCartDropdown();
    }), 4000);
  };
  stopResetTimer = function() {
    return clearTimeout(cart_dropdown_timer);
  };
  validateSize = function(cart_form) {
    if (cart_form.find('select option:selected').is(':disabled')) {
      cart_form.find('.dropdown').effect('shake', {
        'times': 2,
        'distance': 5
      }, 400);
      return false;
    }
    return true;
  };
  addToCart = function(cart_form) {
    return $.ajax({
      type: "POST",
      url: "/cart/add.js",
      dataType: "json",
      data: cart_form.serialize(),
      success: addToCartPass,
      error: addToCartFail
    });
  };
  addToCartPass = function(product) {
    return recentCartItemPopUp();
  };
  addToCartFail = function(obj, status) {
    $('.recently-added .error').show();
    $('.recently-added table').hide();
    $('.recently-added div.row').hide();
    slideDownCartDropdown();
    return startTimer();
  };
  recentCartItemPopUp = function() {
    var cart_item, cart_total;
    cart_item = {};
    cart_total = {};
    if (currency_switcher_enabled) {
      Shopify.money_format = Currency.moneyFormats[theme.shop_currency].money_format;
    }
    return $.getJSON("/cart.js", function(cart, textStatus) {
      var new_cart_row, new_mobile_item;
      cart_item.image_url = Shopify.resizeImage(cart.items[0].image, "compact");
      cart_item.url = cart.items[0].url;
      cart_item.title = cart.items[0].title;
      cart_item.price = Shopify.formatMoney(cart.items[0].price, Shopify.money_with_currency_format);
      cart_total.price = Shopify.formatMoney(cart.total_price, Shopify.money_with_currency_format);
      cart_total.quantity = cart.item_count;
      $('.cart-link .number').html(cart_total.quantity);
      $('.cart-link .number-wrapper').removeClass('hide');
      new_cart_row = '<tr>';
      new_cart_row += '<td class="cart-item">';
      new_cart_row += '<a href="' + cart_item.url + '">';
      new_cart_row += '<img src="' + cart_item.image_url + '" alt="' + cart_item.title + '">';
      new_cart_row += '</a>';
      new_cart_row += '</td>';
      new_cart_row += '<td class="cart-detail">';
      new_cart_row += '<h2><a href="' + cart_item.url + '">' + cart_item.title + '</a></h2>';
      new_cart_row += '</td>';
      new_cart_row += '<td class="cart-price"><span class="money">' + cart_item.price + '</span></td>';
      new_cart_row += '</tr>';
      new_mobile_item = '<a href="' + cart_item.url + '">';
      new_mobile_item += '<img src="' + cart_item.image_url + '" alt="' + cart_item.title + '">';
      new_mobile_item += '</a>';
      $('.recently-added tbody').html(new_cart_row);
      $('.recently-added .mobile-item').html(new_mobile_item);
      $('.recently-added .items-count .number').html(cart_total.quantity);
      $('.recently-added .total-price').html(cart_total.price);
      if (currency_switcher_enabled) {
        $.each($('.recently-added .total-price').get(0).attributes, function(i, attrib) {
          if (attrib.name.match("^data-currency")) {
            return $('.recently-added .total-price').attr(attrib.name, "");
          }
        });
        Currency.convertAll(shopCurrency, jQuery('[name=currencies]').val());
      }
      $('.recently-added .error').hide();
      $('.recently-added table, .recently-added div.row').show();
      if ($('.main-header .mobile-tools').is(":hidden")) {
        slideDownCartDropdown();
      } else {
        openMobileModal();
      }
      return startTimer();
    });
  };
  matchImageHeights = function() {
    var greatest_height, grid_items, product_grid, row_items, setRowHeights;
    product_grid = $('.product-grid');
    grid_items = product_grid.find('.product-item, .clearfix');
    row_items = [];
    greatest_height = 0;
    if (product_grid.closest('.product-slider').length) {
      return false;
    }
    setRowHeights = function(product_items) {
      $.each(product_items, function() {
        return $(this).find('.image-wrapper').height(greatest_height);
      });
      return greatest_height = 0;
    };
    return product_grid.imagesLoaded(function() {
      return grid_items.each(function(index) {
        var image;
        image = $(this).find('.image-wrapper img:first');
        if (image.height() > greatest_height) {
          greatest_height = image.height();
        }
        if ($(this).hasClass('clearfix')) {
          if (row_items.length > 1) {
            setRowHeights(row_items);
          }
          return row_items = [];
        } else if (index === grid_items.length - 1) {
          row_items.push($(this));
          return setRowHeights(row_items);
        } else {
          return row_items.push($(this));
        }
      });
    });
  };
  promoBar = function() {
    var $promo_bar, close;
    $promo_bar = $('.promo-bar');
    close = function() {
      if ((typeof Storage !== "undefined" && Storage !== null) && !sessionStorage['promo-bar-closed']) {
        sessionStorage['promo-bar-closed'] = true;
      }
      return $promo_bar.addClass('closed');
    };
    if ((typeof Storage !== "undefined" && Storage !== null) && sessionStorage['promo-bar-closed']) {
      return $promo_bar.hide();
    } else {
      $promo_bar.show();
      return $('.promo-bar button').click(close);
    }
  };
  promoBar();
  if (PAGE.hasClass('template-page')) {
    page_content = $('.page-content .rte-content');
    if (page_content.find('.left-side-column').length || page_content.find('.right-side-column').length) {
      if (page_content.find('.left-side-column').length && page_content.find('.right-side-column').length) {
        page_content.wrapInner("<div class='main-column with-2-sidebars'></div>");
        $('.left-side-column').addClass('with-2-sidebars');
        $('.right-side-column').addClass('with-2-sidebars');
      } else {
        page_content.wrapInner("<div class='main-column'></div>");
      }
      $('.left-side-column').prependTo(page_content);
      $('.right-side-column').appendTo(page_content);
    }
  }
  if (PAGE.hasClass('template-index')) {
    FullscreenSlider = (function() {
      function FullscreenSlider(slider_element) {
        this.eventListeners = bind(this.eventListeners, this);
        this.alignPlayButton = bind(this.alignPlayButton, this);
        this.alignCaption = bind(this.alignCaption, this);
        this.getActiveIndex = bind(this.getActiveIndex, this);
        this.autoplay = bind(this.autoplay, this);
        this.createSlider = bind(this.createSlider, this);
        var slide_parent;
        this.el = slider_element;
        slide_parent = this.el.closest('.slider');
        this.autoplay_enabled = slide_parent.data('autoplay');
        if (slide_parent.find('.slide').length < 2) {
          this.autoplay_enabled = false;
        }
        this.autoplay_frequency = slide_parent.data('rotateFrequency');
        this.transition_style = slide_parent.data('transitionStyle');
        this.createSlider();
        this.owl = $(".owl-carousel").data('owlCarousel');
      }

      FullscreenSlider.prototype.createSlider = function() {
        var slider, slider_options;
        slider = this;
        slider_options = {
          singleItem: true,
          navigation: false,
          paginationNumbers: false,
          scrollPerPageNav: true,
          slideSpeed: 800,
          pagination: true,
          autoHeight: true,
          autoPlay: slider.autoplay(),
          afterInit: function() {
            return slider.eventListeners();
          },
          afterAction: function() {
            slider.alignCaption();
            return slider.alignPlayButton();
          }
        };
        if (this.transition_style !== 'default') {
          slider_options['transitionStyle'] = this.transition_style;
        }
        return slider.el.owlCarousel(slider_options);
      };

      FullscreenSlider.prototype.autoplay = function() {
        if (this.autoplay_enabled) {
          return this.autoplay_frequency;
        }
        return false;
      };

      FullscreenSlider.prototype.getActiveIndex = function() {
        return this.el.find('.owl-pagination .owl-page.active').index();
      };

      FullscreenSlider.prototype.alignCaption = function() {
        var caption, caption_height, caption_width, slide, slide_padding, top_offset;
        slide = this.el.find('.owl-item').eq(this.getActiveIndex());
        caption = slide.find('.caption');
        caption.css('visibility', 'hidden');
        caption_height = caption.outerHeight();
        caption_width = caption.outerWidth();
        slide_padding = 30;
        if (transparentMenuIsEnabled()) {
          top_offset = $('.main-header').outerHeight();
        } else {
          top_offset = 0;
        }
        return slide.find('img').first().imagesLoaded(function() {
          var left_offset, middle_top, slide_height, slide_width;
          slide_height = slide.outerHeight();
          slide_width = slide.outerWidth();
          if (caption.hasClass('top')) {
            caption.css('top', top_offset + slide_padding);
          } else if (caption.hasClass('middle')) {
            middle_top = top_offset + (slide_height - top_offset - caption_height) / 2;
            caption.css('top', middle_top);
          }
          if (caption.hasClass('center')) {
            left_offset = (slide_width - caption_width) / 2;
            caption.css('left', left_offset);
          }
          return caption.css('visibility', 'visible');
        });
      };

      FullscreenSlider.prototype.alignPlayButton = function() {
        var play_button, slide;
        slide = this.el.find('.owl-item').eq(this.getActiveIndex());
        play_button = slide.find('.play-button');
        play_button.css('visibility', 'hidden');
        if (transparentMenuIsEnabled() && $('.main-header').css('position') === 'absolute') {
          slide.find('img').first().imagesLoaded(function() {
            var play_button_height, slide_height, video_offset;
            slide_height = slide.outerHeight();
            play_button_height = play_button.outerHeight();
            video_offset = (slide_height - play_button_height) / 2;
            return play_button.css({
              'margin-top': 0,
              'top': video_offset
            });
          });
        } else {
          play_button.css({
            'margin-top': '-40px',
            'top': '50%'
          });
        }
        return play_button.css('visibility', 'visible');
      };

      FullscreenSlider.prototype.eventListeners = function() {
        var slider;
        slider = this;
        this.el.find(".play-button").on('click', function() {
          var video_modal;
          video_modal = new VideoModal($(this).closest('.video'));
          video_modal.open();
          slider.owl.stop();
          return false;
        });
        return this.el.find('.owl-pagination .owl-page').on('click', function() {
          return slider.owl.stop();
        });
      };

      return FullscreenSlider;

    })();
    new FullscreenSlider($('.slider .slides'));
    productSlider = function() {
      return $('.product-slider').each(function() {
        $(this).find('.product-grid').owlCarousel({
          items: 4,
          navigation: true,
          scrollPerPage: true,
          slideSpeed: 800,
          lazyLoad: true,
          pagination: false,
          navigationText: false
        });
        return $(this).find('.product-item').show();
      });
    };
    productSlider();
    WINDOW.on('resize', productSlider);
    smallPromos = function() {
      var promo_images;
      promo_images = '.small-promos .image-text-widget';
      return DOC.on('mouseenter', promo_images, function() {
        $(this).find('.caption').fadeIn(300);
      }).on('mouseleave', promo_images, function() {
        $(this).find('.caption').stop(true, true).fadeOut(300);
      });
    };
    smallPromos();
    instagramFeed();
  }
  if (PAGE.hasClass('template-collection')) {
    DOC.on('change', '.tags-listbox', function() {
      var collFilters, newTags, query;
      newTags = [];
      collFilters = $(this);
      collFilters.each(function(index, element) {
        if ($(this).val()) {
          return newTags.push($(this).val());
        }
      });
      if (newTags.length) {
        query = newTags.join('+');
        return window.location.href = $(theme.collection.tag).attr('href').replace('tag', query);
      } else {
        if (theme.collection.handle) {
          return window.location.href = '/collections/' + theme.collection.handle;
        } else if (theme.collection.products.first_type === theme.collection.title) {
          return window.location.href = theme.collection.url_for_type;
        } else if (theme.collection.products.first_vendor === theme.collection.title) {
          return window.location.href = theme.collection.url_for_vendor;
        }
      }
    });
  }
  if (PAGE.hasClass('template-list-collections')) {
    $('.collection-item').mouseenter(function() {
      return $(this).find('.caption').fadeIn(300);
    }).mouseleave(function() {
      return $(this).find('.caption').stop(true, true).fadeOut(300);
    });
  }
  if (PAGE.hasClass('template-product')) {
    reloadProductSection = function() {
      mediaQueries();
      updateActiveImg(0);
      productModal();
      return refreshSizeChart();
    };
    refreshSizeChart = function() {
      var isSizeChartEnabled, len;
      len = $(".single-option-selector").length;
      isSizeChartEnabled = function() {
        return $(".section-product-template").data("productSizeChartEnabled") === true;
      };
      if (len > 0) {
        return;
      }
      if (len < 1 && isSizeChartEnabled()) {
        return DOC.trigger('set-option-selectors');
      }
    };
    positions = function() {
      var insertPosition;
      insertPosition = function(position_target) {
        var positions_src, target;
        positions_src = $('.positions.active');
        target = position_target;
        positions_src.find('[data-position]').each(function() {
          var elem_src, elem_target, position;
          position = $(this).attr('data-position');
          if (position.length) {
            elem_src = positions_src.find('[data-position="' + position + '"]');
            elem_target = target.find('[data-position="' + position + '"]');
            return elem_src.children().appendTo(elem_target);
          }
        });
        positions_src.removeClass('active');
        return position_target.addClass('active');
      };
      DOC.on("smallWindow", function() {
        return insertPosition($('.positions.show-for-small'));
      });
      DOC.on("mediumWindow", function() {
        return insertPosition($('.positions.show-for-medium-only'));
      });
      DOC.on("largeWindow", function() {
        return insertPosition($('.positions.show-for-large-up'));
      });
    };
    positions();
    photos = $('article .photos');
    thumbs = $('article .thumbs');
    photos.on('click', function() {
      return false;
    });
    isProductZoomEnabled = function() {
      return $('.section-product-template').data('productZoomEnabled');
    };
    imgZoom = function(index) {
      if (!touchevents_exist && isProductZoomEnabled()) {
        return photos.find('.container').zoom({
          url: photos.find('.photo').eq(index).attr('data-zoom')
        });
      }
    };
    if (!touchevents_exist && isProductZoomEnabled()) {
      photos.find('.container').on("mouseover", function() {
        $(this).css('outline-width', 1);
        return photos.find('.zoomImg').css({
          opacity: 1
        });
      }).on("mouseleave", function() {
        return $(this).css('outline-width', 0);
      });
    }
    updateActiveImg = function(index) {
      var transition_time;
      photos = $('article .photos');
      thumbs = $('article .thumbs');
      if (photos.find('.photo').eq(index).find('img').length < 1) {
        return;
      }
      if (photos.find('.photo.active').index() === index) {
        return;
      }
      thumbs.find('.thumb').removeClass('active');
      thumbs.find('.thumb').eq(index).addClass('active');
      photos.find('.zoomImg').remove();
      transition_time = 0;
      if (photos.find('.photo.active').length) {
        transition_time = 300;
        photos.find('.photo.active').fadeOut(transition_time).removeClass('active');
      }
      photos.find('.photo').eq(index).delay(transition_time).imagesLoaded(function() {
        var container_width, height, width;
        imgZoom(index);
        height = photos.find('.photo').eq(index).find('img').naturalHeight();
        width = photos.find('.photo').eq(index).find('img').naturalWidth();
        container_width = photos.outerWidth();
        if (container_width < width) {
          height = container_width / width * height;
          width = container_width;
        }
        photos.find('.container').animate({
          "height": height,
          "width": width
        }, transition_time, function() {
          return photos.find('.container').css({
            'height': 'auto',
            'width': 'auto'
          });
        });
        return photos.find('.photo').eq(index).addClass('active').fadeIn(transition_time);
      });
    };
    getLowInStockMessage = function(quantity) {
      var message;
      message = quantity === 1 ? theme.products.low_in_stock.one : theme.products.low_in_stock.other;
      if (quantity > 1) {
        message = message.replace(/\d+/, quantity);
      }
      return message;
    };
    getLowInStockAmount = function() {
      return $('.section-product-template').data('productLowInStockAmount');
    };
    updateLowInStock = function(variant) {
      var quantity, threshold;
      quantity = variant.inventory_quantity;
      threshold = getLowInStockAmount();
      if (quantity > 0 && quantity <= threshold) {
        $('.product-low-in-stock').html('<p>' + getLowInStockMessage(quantity) + '</p>').show();
      } else {
        $('.product-low-in-stock').hide();
      }
      return DOC.on('.shopify-section section--products shopify:section:select', function() {
        return updateLowInStock(variant);
      });
    };
    thumbs.find('.thumb').click(function() {
      return updateActiveImg($(this).index());
    });
    showSizeChart = function(selector) {
      var product_options;
      if ($('.size-chart').length > 0) {
        $('.size-chart-trigger').remove();
        product_options = selector.product.options;
        $('.cart-form').addClass('size-chart-enabled');
        return $('.selector-wrapper').each(function(index, element) {
          var product_size_chart_option;
          product_size_chart_option = $('.section-product-template').data('productSizeChartOption').toLowerCase();
          if (product_options[index].toLowerCase() === product_size_chart_option) {
            return $(element).append('<a class="size-chart-trigger" href="#">' + theme.products.size_chart.label + '</a>');
          }
        });
      }
    };
    theme.variantSelected = function(variant, selector) {
      var actual_price, compare_price, product_options, show_low_in_stock, variant_image_index;
      product_options = null;
      $(".compare-price").html("");
      $('.product-unavailable [type="submit"]').prop("disabled", true);
      if (variant && variant.available) {
        $(".quanity-cart-row").show();
        $('.product-unavailable').hide();
      } else {
        $(".quanity-cart-row").hide();
        $('.product-unavailable').show();
        $('.product-low-in-stock').hide();
        $('.product-unavailable [type="submit"]').prop("disabled", false);
        if (product_variant_size > 1 && variant) {
          $('.product-unavailable form .email-body').attr('value', 'Please notify me when this is back in stock: ' + product_title + ' - ' + variant.title);
        }
      }
      if (variant) {
        actual_price = Shopify.formatMoney(variant.price, shop_money_format);
        $(".actual-price").replaceWith('<span class="actual-price money" itemprop="price">' + actual_price + '</span>');
        if (variant.compare_at_price > variant.price) {
          compare_price = Shopify.formatMoney(variant.compare_at_price, shop_money_format);
          $(".compare-price").html(product_language_was + ' <span class="money">' + compare_price + '</span>');
        }
        if (currency_switcher_enabled) {
          Currency.convertAll(shopCurrency, jQuery('[name=currencies]').val());
        }
        if (variant.featured_image) {
          variant_image_index = $('article .photos .photo[data-image-id="' + variant.featured_image.id + '"]').index();
          updateActiveImg(variant_image_index);
        } else {
          updateActiveImg(0);
        }
        showSizeChart(selector);
        show_low_in_stock = getLowInStockAmount() === false ? false : true;
        if (show_low_in_stock === true && variant.inventory_management === "shopify") {
          updateLowInStock(variant);
        }
      }
    };
    // end of selectCallback;
    $("article .custom.dropdown").hide();
    if (product_options_size === 1 && product_options_first !== "Title") {
      $(".selector-wrapper:eq(0)").prepend("<label>" + product_options_first + "</label>");
    }
    $(".selector-wrapper .single-option-selector").each(Foundation.libs.forms.append_custom_select);
    $("select.single-option-selector").change(function() {
      Foundation.libs.forms.refresh_custom_select($(this), true);
    });
    productModal();
  }
  if (PAGE.hasClass('template-article')) {
    pinterest_button = $('.social-share .pinterest');
    first_article_img = $('.article img').first().attr('src');
    pinterest_button.attr('href', pinterest_button.attr('href') + '&media=' + first_article_img);
  }
  if ($('.section--password').length > 0) {
    DOC.on('click', '.login-link', function() {
      $(this).css('visibility', 'hidden');
      $(".wrapper").hide();
      $('.login-form').css('visibility', 'visible').find($('[name=password]').focus());
      return false;
    });
    DOC.on('click', '.login-form .cancel', function() {
      $(".login-link").css('visibility', 'visible');
      $(".wrapper").fadeIn();
      $('.login-form').css('visibility', 'hidden');
      return false;
    });
    if ($('.login-form .errors').size()) {
      $('.login-link').click();
    }
  }
  isFirefox = typeof InstallTrigger !== "undefined";
  if (isFirefox) {
    $('img').addClass('image-scale-hack');
  }
  if (touchevents_exist) {
    $("form.custom .hidden-field").removeClass('hidden-field');
  }
  current_window = '';
  mediaQueries = function() {
    if ($("html").hasClass("lt-ie9")) {
      $.event.trigger("mediumWindow");
      return current_window = 'medium';
    } else if (window.matchMedia('only screen and (min-width: ' + mq_medium + 'px)').matches) {
      if (current_window !== 'large') {
        $.event.trigger("largeWindow");
        return current_window = 'large';
      }
    } else if (window.matchMedia('only screen and (min-width: ' + mq_small + 'px)').matches) {
      if (current_window !== 'medium') {
        $.event.trigger("mediumWindow");
        return current_window = 'medium';
      }
    } else {
      if (current_window !== 'small') {
        $.event.trigger("smallWindow");
        return current_window = 'small';
      }
    }
  };
  mediaQueries();
  WINDOW.resize(function() {
    mediaQueries();
    return matchImageHeights();
  });
  $('.hide-until-js').show();
  matchImageHeights();
  window.twttr = (function(d, s, id) {
    var fjs, js, t;
    js = void 0;
    fjs = d.getElementsByTagName(s)[0];
    t = window.twttr || {};
    if (d.getElementById(id)) {
      return t;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://platform.twitter.com/widgets.js';
    fjs.parentNode.insertBefore(js, fjs);
    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };
    return t;
  })(document, 'script', 'twitter-wjs');
  DOC.on('shopify:section:load', function(e) {
    var section_wrapper;
    section_wrapper = $(e.target).closest('.shopify-section');
    section_wrapper.css('min-height', '2000px');
    if (section_wrapper.hasClass('section--slideshow')) {
      new FullscreenSlider($(e.target).find('.slides'));
    } else if (section_wrapper.hasClass('section--featured-collection')) {
      productSlider();
    } else if (section_wrapper.hasClass('social-feeds')) {
      instagramFeed();
      twttr.widgets.load();
    } else if (section_wrapper.hasClass('section--header')) {
      mainMenu();
      mobileMenu();
      promoBar();
    } else if (section_wrapper.hasClass('section--products')) {
      DOC.trigger('set-option-selectors');
    }
    return section_wrapper.css('min-height', 'auto');
  });
  DOC.on('shopify:section:unload', function(e) {
    var mask, section_wrapper;
    section_wrapper = $(e.target).closest('.shopify-section');
    if (section_wrapper.hasClass('section--featured-collection')) {
      return setTimeout((function() {
        if ($('.section--featured-collection').length === 0) {
          return WINDOW.off("resize", productSlider);
        }
      }), 0);
    } else if (section_wrapper.hasClass('section--products')) {
      mask = $(".popup-modal-mask");
      $(".size-chart").remove();
      if (mask.is(":visible")) {
        return mask.trigger("click");
      }
    }
  });
  DOC.on('shopify:section:select', function(e) {
    var section_wrapper;
    section_wrapper = $(e.target).closest('.shopify-section');
    if (section_wrapper.hasClass('section--products')) {
      current_window = '';
      return reloadProductSection();
    }
  });
  DOC.on('shopify:block:select', function(e) {
    var section_wrapper, slide_selected;
    section_wrapper = $(e.target).closest('.shopify-section');
    if (section_wrapper.hasClass('section--slideshow')) {
      slide_selected = section_wrapper.find('.slide').index(e.target);
      return $(e.target).closest('.owl-carousel').trigger('owl.jumpTo', slide_selected).trigger('owl.stop');
    }
  });
  DOC.on('shopify:section:deselect', function(e) {
    var section_wrapper, should_autoplay, slider;
    section_wrapper = $(e.target).closest('.shopify-section');
    if (section_wrapper.hasClass('section--slideshow')) {
      should_autoplay = section_wrapper.find('.slider').data('autoplay');
      if (should_autoplay === true) {
        slider = section_wrapper.find('.slides');
        return slider.trigger('owl.play', section_wrapper.find('.slider').data('rotateFrequency'));
      }
    }
  });
  return false;
});

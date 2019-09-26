$(function() {

  function timer() {
    var nowDate = new Date();
    var achiveDate = new Date(2019, 8, nowDate.getDate() + 1,0,0,0); //Задаем дату, к которой будет осуществляться обратный отсчет
    var result = (achiveDate - nowDate)+1000;
    var seconds = Math.floor((result/1000)%60);
    var minutes = Math.floor((result/1000/60)%60);
    var hours = Math.floor((result/1000/60/60)%24);
    var days = Math.floor(result/1000/60/60/24);
    if (result < 0) {
      $('[data-hour]').html('-');
      $('[data-minute]').html('-');
      $('[data-second]').html('-');
      
      return undefined;
    }
    if (seconds < 10) seconds = '0' + seconds;
    if (minutes < 10) minutes = '0' + minutes;
    if (hours < 10) hours = '0' + hours;
    $('[data-hour]').html(hours);
    $('[data-minute]').html(minutes);
    $('[data-second]').html(seconds);
    setTimeout(timer, 1000);
  }
  
  window.onload = function() {
    timer();

    if(localStorage.getItem('offerCount') !== null) {
      $('[data-offer-counter]').html($('[data-offer-counter]').html().replace(0, localStorage.getItem('offerCount')));
    }

    $('[data-modal]').html($('[data-modal-source]').html());
  }

  $(document).on('keyup', 'input', function() {
    var empty = false;

    if($(this).parents('.offer')) {
      $('.modal input[name="' + $(this).attr('name') + '"]').val($(this).val());
    }

    $('.offer input').each(function() {
      if($(this).val().length < 1) {
        empty = true;
      }
    });

    if(!empty) {
      $('[data-set-call]').each(function() {
        $(this).removeAttr('disabled');
      });
    }
  });

  $(document).on('keyup', '.modal input', function() {
    $('.offer input[name="' + $(this).attr('name') + '"]').val($(this).val());
  });

  $(document).on('click', '[data-set-call]', function(e) {
    e.preventDefault();

    var $counter = $('[data-offer-counter]');
    if(localStorage.getItem('offerCount') !== null) {
      var currentCount = Number(localStorage.getItem('offerCount'));

      localStorage.setItem('offerCount', currentCount + 1);
      $counter.html($counter.html().replace(/\d+/g, currentCount + 1));
    } else {
      localStorage.setItem('offerCount', 1);
      $counter.html($counter.html().replace(/\d+/g, currentCount + 1));
    }

    $('form')[0].reset();
    $('form')[1].reset();
  });

  $.get('tooltips.json').done(function(tooltips) {
    var $tooltips = $('<div />', {
      'class': 'tooltips'
    }).appendTo($('body'));
  
    function runTooltip() {     
      function hideToolTip() {
        $(document).find('.tooltip').removeClass('is-active');
        setTimeout(function() {
          $(document).find('.tooltip').remove();
        }, 400);
      };
      
      var showTooltip = setTimeout(function() {

        var currentTooltipID = tooltips[Math.floor(Math.random() * Math.floor(3))];
        var $tooltip = $('<figure />', {
          'class': 'tooltip'
        });
        var $icon = $('<img />', {
          'class': 'tooltip__icon',
          'src': currentTooltipID.icon_url
        }).prependTo($tooltip);
        var $caption = $('<figcaption />', {
          'class': 'tooltip__caption',
          'html': currentTooltipID.text
        }).appendTo($tooltip);
        var $cross = $('<a />', {
          'class': 'tooltip__cross'
        }).appendTo($tooltip);

        $('.tooltips').html($tooltip.prop('outerHTML'));
        setTimeout(() => {
          $(document).find('.tooltip').addClass('is-active');
        }, 100);
      }, 5000); 

      var hideTooltip = setTimeout(function(){
        hideToolTip();
        runTooltip();
      }, 15000);

      $(document).on('click', '.tooltip__cross', function() {
        hideToolTip();
        clearTimeout(hideTooltip);
        runTooltip();
      });
    };

    runTooltip();
  });
})
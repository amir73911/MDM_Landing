$(document).load(function(){
    'use strict';

    $('#fullpage').fullpage({
        anchors: ['main', 'services', 'cards', 'news', 'contacts'],
        navigation: true,
        scrollOverflow: true,
        navigationPosition: 'left',
        navigationTooltips: ['Главная', 'Сервисы', 'Карты', 'События', 'Контакты'],
        afterLoad: function( anchorLink, index){
            if(anchorLink == 'services'){
                if (!$('.services-page .jumbo-h1').hasClass('showed')) {
                    $('.services-page .jumbo-h1, .services-page .jumbo-caption').addClass('showed');
                    $('.mega-buttons li').eq(0).delay(300).queue(function(){
                        $(this).addClass('showed').dequeue();
                    });
                    $('.mega-buttons li').eq(1).delay(600).queue(function(){
                        $(this).addClass('showed').dequeue();
                    });
                    $('.mega-buttons li').eq(2).delay(900).queue(function(){
                        $(this).addClass('showed').dequeue();
                    });
                }
            }
            if(anchorLink == 'cards'){
                $('.hand').addClass('rotate');
            }
        },
        onLeave: function(index, nextIndex, direction){
            if(index == 3){
                $('.hand').removeClass('rotate');
            }
        }
    });

    $('.news-container').owlCarousel({
        loop:false,
        margin:0,
        nav:true,
        items: 1,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        mouseDrag: false
    });

    //$('select').styler();

    rightContent();
    showMap();
    showNews();

}());

function loading() {

    $('body').addClass('loaded');
}

function rightContent() {
    var body = $('body'),
        header = $('header'),
        footer = $('footer'),
        r_content = $('.right-content'),
        rc_button = $('.right-content-btn'),
        rc_overlay = $('.right-content-overlay'),
        section = $('.section'),
        animation_time = 1000;

    rc_button.click(function(e){
        e.preventDefault();

        body.addClass('rightContentOpened');

        header.removeClass('moveRightAnimate');
        footer.removeClass('moveRightAnimate');
        section.removeClass('moveRightAnimate');

        header.addClass('moveLeftAnimate');
        footer.addClass('moveLeftAnimate');
        section.addClass('moveLeftAnimate');

        rc_overlay.addClass('show');

        right_content_load($(this).data('content-id'));

        r_content.addClass('showed').dequeue();

        $.fn.fullpage.setAllowScrolling(false);
    });

    rc_overlay.click(function(e){
        e.preventDefault();

        body.removeClass('rightContentOpened');

        header.removeClass('moveLeftAnimate');
        footer.removeClass('moveLeftAnimate');
        section.removeClass('moveLeftAnimate');

        header.addClass('moveRightAnimate');
        footer.addClass('moveRightAnimate');
        section.addClass('moveRightAnimate');

        r_content.removeClass('showed');

        rc_overlay.removeClass('show');
        $.fn.fullpage.setAllowScrolling(true);
    });
}

function right_content_load(id) {
    var content = $('#'+id),
        r_content = $('.right-content');

    r_content.empty();
    content.clone().appendTo(r_content);

}

function showMap() {
    var map_btn = $('.map-btn'),
        popup_map = $('.popup-map');

    map_btn.click(function(e){

        mapCoords();

        e.preventDefault();
        if (popup_map.hasClass('showed')) {
            popup_map.removeClass('showed');
            $.fn.fullpage.setAllowScrolling(true);
        } else {
            popup_map.addClass('showed');
            $.fn.fullpage.setAllowScrolling(false);
        }
    });
}

function mapCoords() {
    var originalCoords = [
            // left, top, name, text first (true/false)
            [742, 880, 'Иркутск'],
            [672, 791, 'Красноярск'],
            [722, 737, 'Новокузнецк'],
            [692, 737, 'Кемерово'],
            [700, 713, 'Новосибирск', true],
            [672, 730, 'Томск', true],
            [682, 530, 'Омск'],
            [596, 448, 'Тюмень'],
            [636, 400, 'Челябинск'],
            [606, 399, 'Екатеринбург', true],
            [631, 95, 'РостовНа-Дону'],
            [378, 199, 'Санкт-Петербург'],
            [492, 193, 'Москва']
        ],
        originalCoordsLenght = originalCoords.length,
        map = $('.map'),
        originalHeight = 829,
        ratio = $('.map-image').height()/originalHeight,
        leftOffset = (map.width()-$('.map-image').width())/ 2,
        leftSideClass = 'left-side',
        buff = '',
        left = '',
        top = '',
        name = '';

    for (var i=0; i<originalCoordsLenght; i++) {

        buff = (originalCoords[i][3]) ? leftSideClass : '' ;
        left = Math.round(originalCoords[i][1]*ratio) + leftOffset;
        top = Math.round(originalCoords[i][0]*ratio);
        name = originalCoords[i][2];

        var item = $('<div class="marker '+buff+'" style="top: '+top+'px; left: '+left+'px;">'+name+'</div>');

        map.append(item);

        if (originalCoords[i][3]) {
            item.css('left', parseInt(item.css('left'))-(item.width()-14));
        }
    }
}

function showNews() {
    var news_btn = $('.news-btn'),
        items = news_btn.parents('.news-item'),
        body = $('body'),
        back = $('.news-list-content-close'),
        target = $('.news-list-content');

    news_btn.click(function(e){

        e.preventDefault();

        target.empty();

        body.addClass('news-showed');
        target.removeClass('animated fadeOutDown');
        target.addClass('animated fadeInUp');

        $(this).parents('.news-item').addClass('selected');

        $.fn.fullpage.setAllowScrolling(false);

        items.each(function(){
            var content = $(this).clone();

            content.find('.news-btn').remove();
            content.find('.news-title').append('<a href="#" class="btn btn-transparent btn-with-ico-only"><span class="icon icons-arrows-down"></span></a>');

            target.prepend(content);
        });
    });

    back.click(function(){
        $('.news-item').removeClass('selected');
        body.removeClass('news-showed');
        target.removeClass('fadeInUp');
        target.addClass('fadeOutDown');
        $.fn.fullpage.setAllowScrolling(true);
    });


    setInterval(function() {
        $('.news-list-content .news-item').scrollTop();
    }, 500);

}

function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

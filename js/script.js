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
        loop:true,
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
    newsScroll();
    addButtons();

    // IE placeholder display:none bug fix
    $('body').on('focus', 'textarea', function(){
        var placeholder = $(this).attr('placeholder'),
            val = $(this).val();
        if (val == placeholder) {
            $(this).val('');
        }
    });

    $('.services-page .btn-mega').click(function(e){
        e.preventDefault();
    });

}());

function loading() {

    $('body').addClass('loaded');
}

function rightContent() {
    var body = $('body'),
        header = $('header'),
        footer = $('footer'),
        map = $('.popup-map'),
        r_content = $('.right-content'),
        rc_button = $('.right-content-btn'),
        rc_overlay = $('.right-content-overlay'),
        section = $('.section'),
        animation_time = 1000;

    rc_button.click(function(e){
        e.preventDefault();

        right_content_load($(this).data('content-id'));
        r_content.find('textarea').focus().blur(); // FF placeholder with display:none bug fix

        body.addClass('rightContentOpened');

        header.removeClass('moveRightAnimate');
        footer.removeClass('moveRightAnimate');
        section.removeClass('moveRightAnimate');

        header.addClass('moveLeftAnimate');
        footer.addClass('moveLeftAnimate');
        section.addClass('moveLeftAnimate');

        if (body.hasClass('mapShowed')) {
            map.addClass('moveLeftAnimate');
        }

        rc_overlay.addClass('show');

        r_content.delay(animation_time).queue(function(){
            $(this).addClass('showed').dequeue();
        });

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

        map.removeClass('moveLeftAnimate');

        rc_overlay.removeClass('show');

        if (!body.hasClass('mapShowed')) {
            $.fn.fullpage.setAllowScrolling(true);
        }
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
        e.preventDefault();

        mapCoords();

        if (popup_map.hasClass('showed')) {
            popup_map.removeClass('showed');
            $('body').removeClass('mapShowed');
            $.fn.fullpage.setAllowScrolling(true);
        } else {
            popup_map.addClass('showed');
            $('body').addClass('mapShowed');
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
        items = news_btn.parents('.owl-item').not('.cloned').find('.news-item'),
        body = $('body'),
        back = $('.news-list-content-close'),
        target = $('.news-list-content'),
        news_wrap = $('.news-list-content-wrap');

    news_btn.click(function(e){

        var t_news = $(this).parents('.news-item');

        e.preventDefault();

        body.addClass('news-showed');
        target.removeClass('animated fadeOutDown');
        target.addClass('animated fadeInUp');

        news_wrap.find('.news-item').eq(t_news.data('news')).addClass('selected');

        $.fn.fullpage.setAllowScrolling(false);

        news_wrap.animate({
            scrollTop: news_wrap.find('.news-item.selected')[0].offsetTop
        }, 1, function() {
            isNewsIntoView();
        });

    });

    back.click(function(){
        $('.news-container').trigger('to.owl.carousel', [news_wrap.find('.news-item.selected').index(), 500]);
        $('.news-item').removeClass('selected');
        body.removeClass('news-showed');
        target.removeClass('fadeInUp');
        target.addClass('fadeOutDown');
        $.fn.fullpage.setAllowScrolling(true);
    });

}
function newsScroll() {
    $(document).on('click', '.next-news-btn', function(e){
        e.preventDefault();
        var next_news_item = $(this).parents('.news-item').next('.news-item');
        if (next_news_item.length) {
            $('.news-item').removeClass('selected');
            next_news_item.removeClass('selected');

            $('.news-list-content-wrap').animate({
                scrollTop: next_news_item.offset().top + $('.news-list-content-wrap').scrollTop()
            }, 1000);
        }

    });
}

function isNewsIntoView() {
    var wrap = $('.news-list-content-wrap'),
        news_item = wrap.find('.news-item'),
        offsets = [];

    news_item.each(function(){
        offsets.push(Math.round($(this)[0].offsetTop));
    });

    var o_lenght = offsets.length-1;

    wrap.scroll(function(){
        for (var i = 0; i <= o_lenght; i++) {
            if (i == o_lenght) {
                if (wrap.scrollTop() > offsets[i]) {
                    if (!news_item.eq(i).hasClass('selected')) {
                        news_item.removeClass('selected');
                        news_item.eq(i).addClass('selected');
                    }
                }
            } else {
                if((wrap.scrollTop() > offsets[i]) && (wrap.scrollTop() < offsets[i+1])) {
                    if (!news_item.eq(i).hasClass('selected')) {
                        news_item.removeClass('selected');
                        news_item.eq(i).addClass('selected');
                    }
                }
            }
        }
    });
}

function addButtons() {
    var closeTarget = $('.right-content-overlay, .news-list-content-close.right');
    closeTarget.append('<a href="#" class="btn btn-transparent btn-with-ico-only next-news-btn"><span class="icon icons-close"></span></a>');
    $('.owl-prev').append('<a href="#" class="btn btn-transparent btn-with-ico-only next-news-btn"><span class="icon icons-left"></span></a>');
    $('.owl-next').append('<a href="#" class="btn btn-transparent btn-with-ico-only next-news-btn"><span class="icon icons-right"></span></a>');
}
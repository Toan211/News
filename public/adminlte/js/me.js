//CKEDITOR.replace('content');
//CKEDITOR.replace( 'content' );

//Create slug input
function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ *? /g,"-");
    str = str.trim(); 
    return str;
}

function changeStatus(link)
{

    $.get( link, function( data ) {
        console.log(data);
        var notifyClick = $("a.status-" + data.id)
        
        var btnNow = 'btn-warning';
        var btnAfter = 'btn-success';
        var statusValue = 'active';
        if(data.currentStatus == 'active') {
            btnNow = 'btn-success';
            btnAfter = 'btn-warning';
            statusValue = 'inactive';
        }
        //change link cho nút
        var linkChange = notifyClick.attr("onclick").replace(data.currentStatus, statusValue);
        notifyClick.attr("onclick", linkChange);
        // thông báo ajax
        notifyClick.notify(data.msg, { position:"top", className: 'success', });
        // add vs remove class trực tiếp
        notifyClick.addClass(btnAfter).removeClass(btnNow);
    });

}

//preview upload img
function readURL(input, output) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        $(output).attr('src', e.target.result);
      }
      
      reader.readAsDataURL(input.files[0]); 
    }
  }
  
$(document).ready(function () { //deprecated 
//$(function () {
    var ckbAll = $(".cbAll");
    var fmAdmin = $("#zt-form");

    // CKEDITOR
    if ($('textarea#content').length) {
        CKEDITOR.replace('content');
    } // cái này vô dc
    
      $("#imgInp").on('change',function() {
        readURL(this);
      });

    //call active menu
    activeMenu();

    $('select[name=filter-progress]').on('change',function() {
        var myId = $(this).attr('id');
        var itemValue = $(this).val();
        
        var path = window.location.pathname.split('/');
        
        var linkRedirect = '/' + path[1] + '/' + path[2] + '/change-progress/' + myId + '/' + itemValue;
        
        if(itemValue){
            $.ajax({
                type:'POST',
                url:linkRedirect,
                success:function(data){
                    $('#' + myId).notify(data.msg, { position:"top", className: 'success' });
                }
            }); 
        }
    });

    //check selectbox
    change_form_action("#zt-form .slbAction", "#zt-form","#btn-action");

    //check all
    ckbAll.click(function () {
        $('input:checkbox').not(this).prop('checked', this.checked);
        if ($(this).is(':checked')) {
            $(".ordering").attr("name", "ordering");
        }else{
           
            $(".ordering").removeAttr("name");
        }
        
    });
    // hiden notify
    hiddenNotify(".close-btn");



    $("input[name=cid]").click(function () {
        if ($(this).is(':checked')) {
            $(this).parents("tr").find('.ordering').attr("name", "ordering");
        }else{
            $(this).parents("tr").find('.ordering').removeAttr("name");
        }
    });
    
    // CONFIRM DELETE
    $('a.btn-delete').on('click', () => {
        if (!confirm("Are you sure you want to delete this item?")) return false;
    });

    //active menu function
    function activeMenu() {
        let pathname = window.location.pathname;
        let arrMenu = pathname.split("/");
        let currentMenu = arrMenu[2];
        $('li.nav-item a[data-active="'+currentMenu+'"]').addClass('my-active');
        $('li.nav-item a[data-active="'+currentMenu+'"]').parent().parent().parent().addClass('menu-open');
    }

    //
    // ("#zt-form .slbAction", "#zt-form","#btn-action"
    function change_form_action(slb_selector, form_selector, id_btn_action) {

        var optValue;
        var isDelete = false;
        var pattenCheckDelete = new RegExp("delete", "i");

        $(slb_selector).on("change", function () {
            
            
            optValue = $(this).val();
            
            
            if(optValue !== "") {
                $(id_btn_action).removeAttr('disabled');
            } else {
                $(id_btn_action).attr('disabled', 'disabled');
            }
            $(form_selector).attr("action", optValue);
        });

        $(form_selector + " .btnAction").on("click", function () {
            
            isDelete = pattenCheckDelete.test($(slb_selector).val());
            if(isDelete){
                var confirmDelete = confirm('Are you really want to delete?');
                if(confirmDelete === false){
                    return;
                }
            }

            var numberOfChecked = $(form_selector + ' input[name="cid"]:checked').length;
            if (numberOfChecked == 0) {
                alert("Please choose some items");
                return;
            } else {
                var flag = false;
                var str = $(slb_selector + " option:selected").attr('data-comfirm');
               
                if (str != undefined) {

                    //Kiểm tra giá trị trả về khi user nhấn nút trên popup
                    flag = confirm(str);
                    if (flag == false) {
                        return flag;
                    } else {
                        $(form_selector).submit();
                    }

                } else {
                    if (optValue != undefined) {
                        $(form_selector).submit();
                    }
                }
            }

        });
    }

    // hidden parent (hidden message notify)
    function hiddenNotify(close_btn_selector){
        $(close_btn_selector).on('click', function(){
            $(this).parent().css({'display':'none'});
        })    
    }

    $('select[name="group_id"]').change(function(){
        $('input[name="group_name"]').val($(this).find('option:selected').text()); //TH chọn Choose Group: validate đã kiểm tra
    });

    $('select[name="brand_id"]').change(function(){
        $('input[name="brand_name"]').val($(this).find('option:selected').text()); //TH chọn Choose Group: validate đã kiểm tra
    });

    $('select[name="filter_group"]').change(function(){
        var path = window.location.pathname.split('/');
        var linkRedirect = '/' + path[1] + '/' +  path[2] + '/filter-group/' + $(this).val();
         window.location.pathname = linkRedirect;
    });

    //slug
    $('input#name_slug').keyup(function(){
        $('input[name="slug"]').val(change_alias($(this).val()));
     });

     //slug_category_in_article
    $('select[name="group_id"]').change(function(){
        let groupName = $(this).find('option:selected').text();
        $('input[name="group_slug"]').val(change_alias(groupName));
     });

     //slug_brand_in_article
    $('select[name="brand_id"]').change(function(){
        let brandName = $(this).find('option:selected').text();
        $('input[name="brand_slug"]').val(change_alias(brandName));
     });

    // fill avatar_name when choose group
    $('select[name=avatar]').change(function() {
        $('input[name=image_old]').val($(this).find('option:selected').text());
    });

    $('form[name=form-upload]').submit( function(event) {
        let avatar = $(this).find("input[name=avatar]");
        $(this).find("input[name=avatar]").remove();
        $(this).append(avatar).css({'display': 'none'});
    });

    $("input[name=avatar]").change(function() {
        readURL(this, 'img.preview-avatar');
    });
    
     // show multi image
    let imagesPreview = function(input, placeToInsertImagePreview) {
        if (input.files) {
            let filesAmount = input.files.length;
            for (i = 0; i < filesAmount; i++) {
                let reader = new FileReader();
                reader.onload = function(event) {
                    let imageTag = `<img src="${event.target.result}" alt="${event.target.result}" style="width: 100px;">`;
                    $('<li>' + imageTag + '</li>').appendTo(placeToInsertImagePreview);
                };
                reader.readAsDataURL(input.files[i]);
            }
        };
    };
    $("#input-multi-files").on("change", function() {
        imagesPreview(this, "ul#box-multi-image");
    });

    //tags
    if($('input#tags-input').val() !== '') {    //edit
        // $('input#tags-input[name=size]').tagEditor({ initialTags: $('input#tags-input[name=size]').val().split(',') });
        $('input#tags-input[name=color]').tagEditor({ initialTags: $('input#tags-input[name=color]').val().split(',') });
        $('input#tags-input[name=tags]').tagEditor({ initialTags: $('input#tags-input[name=tags]').val().split(',') });
    } else {    //add
        $('input#tags-input').tagEditor({ initialTags: [''] });
    }


    


});


//-----------------TAGS-----------------

/*
  jQuery tagEditor v1.0.20
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/jQuery-tagEditor
  License: https://www.opensource.org/licenses/mit-license.php
*/

(function($){
    // auto grow input (stackoverflow.com/questions/931207)
    $.fn.tagEditorInput=function(){var t=" ",e=$(this),n=parseInt(e.css("fontSize")),i=$("<span/>").css({position:"absolute",top:-9999,left:-9999,width:"auto",fontSize:e.css("fontSize"),fontFamily:e.css("fontFamily"),fontWeight:e.css("fontWeight"),letterSpacing:e.css("letterSpacing"),whiteSpace:"nowrap"}),s=function(){if(t!==(t=e.val())){i.text(t);var s=i.width()+n;20>s&&(s=20),s!=e.width()&&e.width(s)}};return i.insertAfter(e),e.bind("keyup keydown focus",s)};

    // plugin with val as parameter for public methods
    $.fn.tagEditor = function(options, val, blur){

        // helper
        function escape(tag) {
            return tag.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        }

        // build options dictionary with default values
        var blur_result, o = $.extend({}, $.fn.tagEditor.defaults, options), selector = this;

        // store regex and default delimiter in options for later use
        o.dregex = new RegExp('['+o.delimiter.replace('-', '\-')+']', 'g');

        // public methods
        if (typeof options == 'string') {
            // depending on selector, response may contain tag lists of multiple editor instances
            var response = [];
            selector.each(function(){
                // the editor is the next sibling to the hidden, original field
                var el = $(this), o = el.data('options'), ed = el.next('.tag-editor');
                if (options == 'getTags')
                    response.push({field: el[0], editor: ed, tags: ed.data('tags')});
                else if (options == 'addTag') {
                    if (o.maxTags && ed.data('tags').length >= o.maxTags) return false;
                    // insert new tag
                    $('<li><div class="tag-editor-spacer">&nbsp;'+o.delimiter[0]+'</div><div class="tag-editor-tag"></div><div class="tag-editor-delete"><i></i></div></li>').appendTo(ed).find('.tag-editor-tag')
                        .html('<input type="text" maxlength="'+o.maxLength+'">').addClass('active').find('input').val(val).blur();
                    if (!blur) ed.click();
                    else $('.placeholder', ed).remove();
                } else if (options == 'removeTag') {
                    // trigger delete on matching tag, then click editor to create a new tag
                    $('.tag-editor-tag', ed).filter(function(){return $(this).text()==val;}).closest('li').find('.tag-editor-delete').click();
                    if (!blur) ed.click();
                } else if (options == 'destroy') {
                    el.removeClass('tag-editor-hidden-src').removeData('options').off('focus.tag-editor').next('.tag-editor').remove();
                }
            });
            return options == 'getTags' ? response : this;
        }

        // delete selected tags on backspace, delete, ctrl+x
        if (window.getSelection) $(document).off('keydown.tag-editor').on('keydown.tag-editor', function(e){
            if (e.which == 8 || e.which == 46 || e.ctrlKey && e.which == 88) {
                try {
                    var sel = getSelection(), el = document.activeElement.tagName == 'BODY' ? $(sel.getRangeAt(0).startContainer.parentNode).closest('.tag-editor') : 0;
                } catch(e){ el = 0; }
                if (sel.rangeCount > 0 && el && el.length) {
                    var tags = [], splits = sel.toString().split(el.prev().data('options').dregex);
                    for (i=0; i<splits.length; i++){ var tag = $.trim(splits[i]); if (tag) tags.push(tag); }
                    $('.tag-editor-tag', el).each(function(){
                        if (~$.inArray($(this).text(), tags)) $(this).closest('li').find('.tag-editor-delete').click();
                    });
                    return false;
                }
            }
        });

        return selector.each(function(){
            var el = $(this), tag_list = []; // cache current tags

            // create editor (ed) instance
            var ed = $('<ul '+(o.clickDelete ? 'oncontextmenu="return false;" ' : '')+'class="tag-editor"></ul>').insertAfter(el);
            el.addClass('tag-editor-hidden-src') // hide original field
                .data('options', o) // set data on hidden field
                .on('focus.tag-editor', function(){ ed.click(); }); // simulate tabindex

            // add dummy item for min-height on empty editor
            ed.append('<li style="width:1px">&nbsp;</li>');

            // markup for new tag
            var new_tag = '<li><div class="tag-editor-spacer">&nbsp;'+o.delimiter[0]+'</div><div class="tag-editor-tag"></div><div class="tag-editor-delete"><i></i></div></li>';

            // helper: update global data
            function set_placeholder(){
                if (o.placeholder && !tag_list.length && !$('.deleted, .placeholder, input', ed).length)
                    ed.append('<li class="placeholder"><div>'+o.placeholder+'</div></li>');
            }

            // helper: update global data
            function update_globals(init){
                var old_tags = tag_list.toString();
                tag_list = $('.tag-editor-tag:not(.deleted)', ed).map(function(i, e) {
                    var val = $.trim($(this).hasClass('active') ? $(this).find('input').val() : $(e).text());
                    if (val) return val;
                }).get();
                ed.data('tags', tag_list);
                el.val(tag_list.join(o.delimiter[0]));
                // change callback except for plugin init
                if (!init) if (old_tags != tag_list.toString()) o.onChange(el, ed, tag_list);
                set_placeholder();
            }

            ed.click(function(e, closest_tag){
                var d, dist = 99999, loc;

                // do not create tag when user selects tags by text selection
                if (window.getSelection && getSelection() != '') return;

                if (o.maxTags && ed.data('tags').length >= o.maxTags) { ed.find('input').blur(); return false; }

                blur_result = true
                $('input:focus', ed).blur();
                if (!blur_result) return false;
                blur_result = true

                // always remove placeholder on click
                $('.placeholder', ed).remove();
                if (closest_tag && closest_tag.length)
                    loc = 'before';
                else {
                    // calculate tag closest to click position
                    $('.tag-editor-tag', ed).each(function(){
                        var tag = $(this), to = tag.offset(), tag_x = to.left, tag_y = to.top;
                        if (e.pageY >= tag_y && e.pageY <= tag_y+tag.height()) {
                            if (e.pageX < tag_x) loc = 'before', d = tag_x - e.pageX;
                            else loc = 'after', d = e.pageX - tag_x - tag.width();
                            if (d < dist) dist = d, closest_tag = tag;
                        }
                    });
                }

                if (loc == 'before') {
                    $(new_tag).insertBefore(closest_tag.closest('li')).find('.tag-editor-tag').click();
                } else if (loc == 'after')
                    $(new_tag).insertAfter(closest_tag.closest('li')).find('.tag-editor-tag').click();
                else // empty editor
                    $(new_tag).appendTo(ed).find('.tag-editor-tag').click();
                return false;
            });

            ed.on('click', '.tag-editor-delete', function(e){
                // delete icon is hidden when input is visible; place cursor near invisible delete icon on click
                if ($(this).prev().hasClass('active')) { $(this).closest('li').find('input').caret(-1); return false; }

                var li = $(this).closest('li'), tag = li.find('.tag-editor-tag');
                if (o.beforeTagDelete(el, ed, tag_list, tag.text()) === false) return false;
                tag.addClass('deleted').animate({width: 0}, o.animateDelete, function(){ li.remove(); set_placeholder(); });
                update_globals();
                return false;
            });

            // delete on right mouse click or ctrl+click
            if (o.clickDelete)
                ed.on('mousedown', '.tag-editor-tag', function(e){
                    if (e.ctrlKey || e.which > 1) {
                        var li = $(this).closest('li'), tag = li.find('.tag-editor-tag');
                        if (o.beforeTagDelete(el, ed, tag_list, tag.text()) === false) return false;
                        tag.addClass('deleted').animate({width: 0}, o.animateDelete, function(){ li.remove(); set_placeholder(); });
                        update_globals();
                        return false;
                    }
                });

            ed.on('click', '.tag-editor-tag', function(e){
                // delete on right click or ctrl+click -> exit
                if (o.clickDelete && (e.ctrlKey || e.which > 1)) return false;

                if (!$(this).hasClass('active')) {
                    var tag = $(this).text();
                    // guess cursor position in text input
                    var left_percent = Math.abs(($(this).offset().left - e.pageX)/$(this).width()), caret_pos = parseInt(tag.length*left_percent),
                        input = $(this).html('<input type="text" maxlength="'+o.maxLength+'" value="'+escape(tag)+'">').addClass('active').find('input');
                        input.data('old_tag', tag).tagEditorInput().focus().caret(caret_pos);
                    if (o.autocomplete) {
                        var aco = $.extend({}, o.autocomplete);
                        // extend user provided autocomplete select method
                        var ac_select = 'select'  in aco ? o.autocomplete.select : '';
                        aco.select = function(e, ui){ if (ac_select) ac_select(e, ui); setTimeout(function(){
                            ed.trigger('click', [$('.active', ed).find('input').closest('li').next('li').find('.tag-editor-tag')]);
                        }, 20); };
                        input.autocomplete(aco);
                    }
                }
                return false;
            });

            // helper: split into multiple tags, e.g. after paste
            function split_cleanup(input){
                var li = input.closest('li'), sub_tags = input.val().replace(/ +/, ' ').split(o.dregex),
                    old_tag = input.data('old_tag'), old_tags = tag_list.slice(0), exceeded = false, cb_val; // copy tag_list
                for (var i=0; i<sub_tags.length; i++) {
                    tag = $.trim(sub_tags[i]).slice(0, o.maxLength);
                    if (o.forceLowercase) tag = tag.toLowerCase();
                    cb_val = o.beforeTagSave(el, ed, old_tags, old_tag, tag);
                    tag = cb_val || tag;
                    if (cb_val === false || !tag) continue;
                    // remove duplicates
                    if (o.removeDuplicates && ~$.inArray(tag, old_tags))
                        $('.tag-editor-tag', ed).each(function(){ if ($(this).text() == tag) $(this).closest('li').remove(); });
                    old_tags.push(tag);
                    li.before('<li><div class="tag-editor-spacer">&nbsp;'+o.delimiter[0]+'</div><div class="tag-editor-tag">'+escape(tag)+'</div><div class="tag-editor-delete"><i></i></div></li>');
                    if (o.maxTags && old_tags.length >= o.maxTags) { exceeded = true; break; }
                }
                input.attr('maxlength', o.maxLength).removeData('old_tag').val('')
                if (exceeded) input.blur(); else input.focus();
                update_globals();
            }

            ed.on('blur', 'input', function(e){
                e.stopPropagation();
                var input = $(this), old_tag = input.data('old_tag'), tag = $.trim(input.val().replace(/ +/, ' ').replace(o.dregex, o.delimiter[0]));
                if (!tag) {
                    if (old_tag && o.beforeTagDelete(el, ed, tag_list, old_tag) === false) {
                        input.val(old_tag).focus();
                        blur_result = false;
                        update_globals();
                        return;
                    }
                    try { input.closest('li').remove(); } catch(e){}
                    if (old_tag) update_globals();
                }
                else if (tag.indexOf(o.delimiter[0])>=0) { split_cleanup(input); return; }
                else if (tag != old_tag) {
                    if (o.forceLowercase) tag = tag.toLowerCase();
                    cb_val = o.beforeTagSave(el, ed, tag_list, old_tag, tag);
                    tag = cb_val || tag;
                    if (cb_val === false) {
                        if (old_tag) {
                            input.val(old_tag).focus();
                            blur_result = false;
                            update_globals();
                            return;
                        }
                        try { input.closest('li').remove(); } catch(e){}
                        if (old_tag) update_globals();
                    }
                    // remove duplicates
                    else if (o.removeDuplicates)
                        $('.tag-editor-tag:not(.active)', ed).each(function(){ if ($(this).text() == tag) $(this).closest('li').remove(); });
                }
                input.parent().html(escape(tag)).removeClass('active');
                if (tag != old_tag) update_globals();
                set_placeholder();
            });

            var pasted_content;
            ed.on('paste', 'input', function(e){
                $(this).removeAttr('maxlength');
                pasted_content = $(this);
                setTimeout(function(){ split_cleanup(pasted_content); }, 30);
            });

            // keypress delimiter
            var inp;
            ed.on('keypress', 'input', function(e){
                if (o.delimiter.indexOf(String.fromCharCode(e.which))>=0) {
                    inp = $(this);
                    setTimeout(function(){ split_cleanup(inp); }, 20);
                }
            });

            ed.on('keydown', 'input', function(e){
                var $t = $(this);

                // left/up key + backspace key on empty field
                if ((e.which == 37 || !o.autocomplete && e.which == 38) && !$t.caret() || e.which == 8 && !$t.val()) {
                    var prev_tag = $t.closest('li').prev('li').find('.tag-editor-tag');
                    if (prev_tag.length) prev_tag.click().find('input').caret(-1);
                    else if ($t.val() && !(o.maxTags && ed.data('tags').length >= o.maxTags)) $(new_tag).insertBefore($t.closest('li')).find('.tag-editor-tag').click();
                    return false;
                }
                // right/down key
                else if ((e.which == 39 || !o.autocomplete && e.which == 40) && ($t.caret() == $t.val().length)) {
                    var next_tag = $t.closest('li').next('li').find('.tag-editor-tag');
                    if (next_tag.length) next_tag.click().find('input').caret(0);
                    else if ($t.val()) ed.click();
                    return false;
                }
                // tab key
                else if (e.which == 9) {
                    // shift+tab
                    if (e.shiftKey) {
                        var prev_tag = $t.closest('li').prev('li').find('.tag-editor-tag');
                        if (prev_tag.length) prev_tag.click().find('input').caret(0);
                        else if ($t.val() && !(o.maxTags && ed.data('tags').length >= o.maxTags)) $(new_tag).insertBefore($t.closest('li')).find('.tag-editor-tag').click();
                        // allow tabbing to previous element
                        else {
                            el.attr('disabled', 'disabled');
                            setTimeout(function(){ el.removeAttr('disabled'); }, 30);
                            return;
                        }
                        return false;
                    // tab
                    } else {
                        var next_tag = $t.closest('li').next('li').find('.tag-editor-tag');
                        if (next_tag.length) next_tag.click().find('input').caret(0);
                        else if ($t.val()) ed.click();
                        else return; // allow tabbing to next element
                        return false;
                    }
                }
                // del key
                else if (e.which == 46 && (!$.trim($t.val()) || ($t.caret() == $t.val().length))) {
                    var next_tag = $t.closest('li').next('li').find('.tag-editor-tag');
                    if (next_tag.length) next_tag.click().find('input').caret(0);
                    else if ($t.val()) ed.click();
                    return false;
                }
                // enter key
                else if (e.which == 13) {
                    ed.trigger('click', [$t.closest('li').next('li').find('.tag-editor-tag')]);

                    // trigger blur if maxTags limit is reached
                    if (o.maxTags && ed.data('tags').length >= o.maxTags) ed.find('input').blur();

                    return false;
                }
                // pos1
                else if (e.which == 36 && !$t.caret()) ed.find('.tag-editor-tag').first().click();
                // end
                else if (e.which == 35 && $t.caret() == $t.val().length) ed.find('.tag-editor-tag').last().click();
                // esc
                else if (e.which == 27) {
                    $t.val($t.data('old_tag') ? $t.data('old_tag') : '').blur();
                    return false;
                }
            });

            // create initial tags
            var tags = o.initialTags.length ? o.initialTags : el.val().split(o.dregex);
            for (var i=0; i<tags.length; i++) {
                if (o.maxTags && i >= o.maxTags) break;
                var tag = $.trim(tags[i].replace(/ +/, ' '));
                if (tag) {
                    if (o.forceLowercase) tag = tag.toLowerCase();
                    tag_list.push(tag);
                    ed.append('<li><div class="tag-editor-spacer">&nbsp;'+o.delimiter[0]+'</div><div class="tag-editor-tag">'+escape(tag)+'</div><div class="tag-editor-delete"><i></i></div></li>');
                }
            }
            update_globals(true); // true -> no onChange callback

            // init sortable
            if (o.sortable && $.fn.sortable) ed.sortable({
                distance: 5, cancel: '.tag-editor-spacer, input', helper: 'clone',
                connectWith: '.tag-editor',
                update: function(){ update_globals(); }
            });
        });
    };

    $.fn.tagEditor.defaults = {
        initialTags: [],
        maxTags: 0,
        maxLength: 50,
        delimiter: ',;',
        placeholder: '',
        forceLowercase: true,
        removeDuplicates: true,
        clickDelete: false,
        animateDelete: 175,
        sortable: true, // jQuery UI sortable
        autocomplete: null, // options dict for jQuery UI autocomplete

        // callbacks
        onChange: function(){},
        beforeTagSave: function(){},
        beforeTagDelete: function(){}
    };
}(jQuery));

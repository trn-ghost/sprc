//=require jquery
//=require jquery-migrate
//=require jquery.purr
//=require semantic-ui/dimmer
//=require semantic-ui/transition
//=require semantic-ui/modal
//=require semantic-ui/accordion

var SPRC={}; //global namespace
SPRC.gpath='/admin/'; //relative path to management page
document.onready=function(){
    csrf=document.getElementsByTagName("meta")[1].content;
    $('.ui.accordion').accordion();
    /*$('.mgmt .delete').click(function(){var tmp=this;SPRC.promt(function(){
        SPRC.delItem(tmp);
    })})*/
};

SPRC.showAlert=function(header,msg){var tpl='<div class="ui modal scrolling"><i class="close icon"></i><div class="header">'+header+'</div><div class="content">'+msg+'</div></div><div class="actions"><div class="ui primary button">OK</div></div></div>';
    $(tpl).modal('show')
};
SPRC.promt=function(func){
    var tpl='<div class="ui basic modal"><div class="header">Удалить запись?</div><div class="content"><div class="image"><i class="archive icon"></i></div><div class="description"><p>Эта операция необратима. Вы уверены, что хотите удалить запись?</p></div></div><div class="actions"><div class="two fluid ui inverted buttons"><div class="ui red basic cancel inverted button"><i class="remove icon"></i>Нет</div><div class="ui green ok basic inverted button"><i class="checkmark icon"></i>Да</div></div></div></div>';
    $(tpl).modal('setting', 'closable', false).modal('setting','onApprove', func).modal('show');
};

/**
 * Create notice or transform existing notice
 * @param msg Message to be shown
 * @param cc Optional. CSS class to be used. Available 'error", "success", "info" (default)
 * @param o Optional. jQuery object with notice. If set, this notice will be transformed to error. Otherwise new notice will be created
 * @param header Optional. Header of notice.
 * @returns {*|jQuery}
 */
SPRC.createNotice=function(msg,cc,o,header){
    if (!header){
        switch (cc) {
            case 'error':
                header='Ошибка!';
                break;

            case 'success':
                header='Успешно';
                break;

            default:
                cc='info';
                header='Информацмя';
        }
    }
    if (!o||typeof o=="undefined"){
        var tpl='<div style="width:auto" class="ui icon message '+cc+'"><i class="notched circle loading icon"></i><div style="width:auto" class="content"><div class="header">'+header+'</div><p class="msg">'+msg+'</p></div></div>';
        var notice=$(tpl).purr({isSticky:true});
        return notice
    }
    o.removeClass("info");
    o.find(".header").html(header);

    if (cc=='error' && o.r.responseText) {
        msg+='<br/><a class="all" href="javascript:void(0)">посмотреть ответ сервера</a>';
    }
    o.find(".msg").html(msg);
    o.find("a.all").click(function(){SPRC.showAlert("Ответ сервера", o.r.responseText)});

    o.addClass(cc);
    o.find("i").remove();
};

SPRC.showThemeWindow=function(o){
    var id,theme='',description='',act=typeof o=='undefined'?'Добавить':'Редактировать';
    if(o){
        var p=$(o).parents('.entry');
        id= p.attr('id').substr(2);
        theme=p.find('.title span').html();
        description=p.find('p:first').html().replace(/<br>|<br \/>/,"\n");
    }
    var tpl='<div class="ui small modal" id="theme_window"><i class="close icon"></i><div class="header">'+act+' тему вопросов</div><div class="content"><form class="ui form"><div class="field"><input type="text" name="theme"  placeholder="Введите тему" value="'+theme+'" /></div><div class="field"><textarea name="description" placeholder="Описание">'+description+'</textarea></div></form> </div><div class="actions"><div class="ui negative button">Отмена</div><div class="ui positive right labeled icon button">OK<i class="checkmark icon"></i></div></div></div>';
    var w=$(tpl);
    w[0].eid=id;
    w.modal('setting', 'onApprove', SPRC.checkThemeForm).modal('show');
};

SPRC.checkThemeForm=function(){
    var w=$("#theme_window");
    var data={},input=w.find('input:first');
    if (input.val().length==0) {//empty field
        input.parent().addClass("error");
        return false
    }
    data.theme=input.val();
    data.description=w.find("textarea").val();
    var id=w[0].eid;
    if (id) data.id=id;
    var method=id?'PATCH':'POST';

    var notice=SPRC.createNotice('Подождите...',null,null,id?'Добавление':'Изменение'+'темы');
    $.ajax({
        url: '/admin/themes',
        'data': data,
        'method': method,
        headers:{'X-CSRF-Token':csrf},
        context: notice,
        error:function(r){
            this.r=r;
            SPRC.createNotice('Произошла ошибка '+r.status, 'error', this);
            var tmp=this;
            setTimeout(function(){tmp.find('a[classname=close]').click()},10000)
        },
        success:function(d,s,r){var act;
            if (data.id) {
                act="отредактирована";
                var o=$('#db'+data.id);
                o.find(".title span").html(data.theme);
                o.find('p:first').html(data.description.replace("\n",'<br />'));
            } else {
                var id=r.getResponseHeader('X-Created-Item-Id'), tpl='<div id="db'+id+'" class="theme entry"><div class="title"><i class="dropdown icon"></i><span>'+data.theme+'</span></div><div class="content"><div class="mgmt"><img src="/assets/icons/edit-94cf79ef63820daed3e5d20a4f0e9e996a3d1994887517971d8f10671ff94d40.png" class="edit" title="редактровать" alt="редактировать" onclick="SPRC.showThemeWindow(this)"><img src="/assets/icons/delete-8b6d82f26a77bc833e8c639b14373f4b64b8ef0046a1fe9248a3031ecf9dad8b.png" class="delete" title="удалить" alt="удалить" onclick="SPRC.promt(function(){SPRC.delItem(event)})"></div><p>'+data.description+'</p><p class="inner"></p></div></div>';
                $('.ui.accordion').append(tpl);
            }
            var tmp=this;
            SPRC.createNotice('Тема '+act+' успешно', 'success', this);
            setTimeout(function(){tmp.find('a[classname=close]').click()},3000);
        }
    })
};

SPRC.delItem=function(e){
    var p=$(e.target).parents('.entry');
    var path=p.attr('class').split(' ')[0]; //extract class name without "entry"
    var id=p.attr('id').substr(2);
    var notice=SPRC.createNotice('Подождите...',null,null,'Удаляем элемент');

    $.ajax({
        url: path,
        method: 'DELETE',
        headers: {'X-CSRF-Token':csrf, 'X-item-id':id},
        context:{'notice':notice, 'el':p},
        error: function(r){this.notice.r=r;
            SPRC.createNotice('Произошла ошибка '+r.status, 'error', this.notice);
            var tmp=this.notice;
            setTimeout(function(){tmp.find('a[classname=close]').click()},10000);
            return false
        },

        success: function(){
            SPRC.createNotice('Запись успешно удалена', 'success', this.notice);
            var tmp=this.notice;
            setTimeout(function(){tmp.find('a[classname=close]').click()},10000);
            this.el.remove();
        }
    })
};
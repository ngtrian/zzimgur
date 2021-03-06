/*! 
 * jQuery plugin zzImgUr ver 1.6 by zzbaivong
 * http://devs.forumvi.com/
 */
(function ($) {
    "use strict";
    $.fn.zzImgUr = function (options) {
        var settings = $.extend({
            cliendID: "",
            mode: "file",
            format: "o,",
            css: {
                width: "100%"
            },
            max: 10,
            loading: "./source/images/loading.gif",
            lang: {
                noID: "\u1ee8ng d\u1ee5ng ch\u01b0a \u0111\u0103ng k\u00fd",
                addImage: "Ch\u1ecdn \u1ea3nh",
                addURL: "Th\u00eam URL",
                reset: "L\u00e0m m\u1edbi",
                upload: "T\u1ea3i l\u00ean",
                choose: "\u0110\u00e3 ch\u1ecdn",
                waitConnect: "\u0110ang k\u1ebft n\u1ed1i...",
                waitUpload: "\u0110ang t\u1ea3i l\u00ean...",
                noteURL: "Nh\u1eadp URL \u1ea3nh v\u00e0o \u0111\u00e2y:",
                errContact: '<a href="http://devs.forumvi.com/t131-jq-plugin-jquery-plugin-zzimgur#831" rel="nofollow" target="_blank">Nh\u1ea5n v\u00e0o \u0111\u00e2y</a> \u0111\u1ec3 b\u00e1o l\u1ed7i.',
                errURL: "URL kh\u00f4ng truy c\u1eadp \u0111\u01b0\u1ee3c.",
                errSize: "URL l\u1ed7i ho\u1eb7c k\u00edch th\u01b0\u1edbc qu\u00e1 nh\u1ecf.",
                errRepeat: "URL kh\u00f4ng h\u1ee3p l\u1ec7 ho\u1eb7c \u0111\u00e3 \u0111\u01b0\u1ee3c s\u1eed d\u1ee5ng."
            },
            success: function (firstVal, arrVal) {},
            input: function (arrInput) {
                arrInput.click(function () {
                    this.select();
                });
            },
            remove: function (firstVal, arrVal) {}
        }, options);
        return this.each(function (index, obj) {
            var maxChoose = 'multiple="multiple"',
                maxItem = settings.max;
            if (maxItem === 1) {
                maxChoose = '';
            }
            $(this, obj).html('<div class="imgur_Zzbv"> <div class="imgur_Zzbv-control"> <div class="imgur_Zzbv-mode">' + icon('Image') + '</div> <div class="imgur_Zzbv-status"> <img src="' + settings.loading + '" alt="loading..." /> </div> <div class="imgur_Zzbv-upload-computer imgur_Zzbv-add"> ' + icon('Select') + ' <div class="imgur_Zzbv-textSelect">' + settings.lang.addImage + '</div> <input type="file" class="imgur_Zzbv-choose" ' + maxChoose + ' /> </div> <div class="imgur_Zzbv-upload-URL imgur_Zzbv-add"> <div class="imgur_Zzbv-iconSelect"></div> <div class="imgur_Zzbv-textSelect">' + settings.lang.addURL + '</div> </div> <div class="imgur_Zzbv-length"> <span class="imgur_Zzbv-complete">0</span> / <span class="imgur_Zzbv-selected">0</span> </div> <div class="imgur_Zzbv-button"> <div class="imgur_Zzbv-reset">' + icon('Reset') + settings.lang.reset + '</div> <div class="imgur_Zzbv-upload">' + icon('Upload') + settings.lang.upload + '</div> </div> <a class="imgur_Zzbv-devs-icon" target="_blank" href="http://devs.forumvi.com/"> ' + icon('Devs') + ' </a> </div> <div class="imgur_Zzbv-preview"> <div class="imgur_Zzbv-list"></div> </div> </div>');
            var zzbv = $(".imgur_Zzbv", obj),
                control = $(".imgur_Zzbv-control", obj),
                mode = $(".imgur_Zzbv-mode", obj),
                status = $(".imgur_Zzbv-status", obj),
                computer = $(".imgur_Zzbv-upload-computer", obj),
                url = $(".imgur_Zzbv-upload-URL", obj),
                add = $(".imgur_Zzbv-add", obj),
                length = $(".imgur_Zzbv-length", obj),
                selected = $(".imgur_Zzbv-selected", obj),
                complete = $(".imgur_Zzbv-complete", obj),
                reset = $(".imgur_Zzbv-reset", obj),
                upload = $(".imgur_Zzbv-upload", obj),
                list = $(".imgur_Zzbv-list", obj),
                li_length = (settings.format).split(",").length;
            
            zzbv.css(settings.css);
            mini();
            $(window).resize(function(){
                mini();
            });
            if (!/[a-z0-9]{15}/.test(settings.cliendID)) {
                control.html('<div class="imgur_Zzbv-status" style="display: block;"> ' + icon('Error') + ' </div><div style="text-align: center;">' + settings.lang.noID + ': <span style="color: red;">cliendID</span><a class="imgur_Zzbv-devs-icon" target="_blank" href="http://devs.forumvi.com/"> ' + icon('Devs') + ' </a></div>');
                return false;
            }
            if (settings.mode == "url") {
                mode.addClass("imgur_Zzbv-zzURL");
                add.toggle();
            }
            control.on("change", ".imgur_Zzbv-choose", function (e) {
                var F = this.files;
                if (F && F[0])
                    for (var i = 0; i < F.length; i++) readImage(F[i], obj, settings);
            });
            upload.click(function () {
                if (mode.hasClass("imgur_Zzbv-zzURL")) {
                    $(".imgur_Zzbv-imageURL:not('.imgur_Zzbv-ok')", obj).closest(".imgur_Zzbv-li").remove();
                    selected.text($(".imgur_Zzbv-imageURL", obj).length);
                    if (list.is(":empty")) {
                        length.add(upload).fadeOut();
                        return false;
                    } else {
                        $(".imgur_Zzbv-imageURL", obj).each(function (i) {
                            imgurUpload(i, this.value, 'URL');
                        });
                    }
                } else {
                    $(".imgur_Zzbv-image img", obj).each(function (i) {
                        imgurUpload(i, this.src.replace(/data:image\/.+;base64\,/, ""), 'base64');
                    });
                }
                upload.add(mode).add(add).add(".imgur_Zzbv-remove", obj).fadeOut();
                status.fadeIn();
            });
            reset.click(function () {
                if (mode.hasClass("imgur_Zzbv-zzURL")) {
                    url.show();
                    computer.hide();
                } else {
                    url.hide();
                    computer.show();
                    reChoose();
                }
                list.empty();
                $("span", length).text(0);
                status.html('<img src="' + settings.loading + '" alt="loading..." />');
                reset.add(upload).add(status).add(length).fadeOut();
                mode.fadeIn();
            });
            list.on("click", ".imgur_Zzbv-delete", function (event) {
                event.preventDefault();
                deleteUr($(this).data("delete"), this);
            });
            list.on("click", ".imgur_Zzbv-remove", function (event) {
                event.preventDefault();
                $(this).closest(".imgur_Zzbv-li").remove();
                var progress = $(".imgur_Zzbv-progress", obj).length;
                selected.text(progress);
                if (progress == "0") {
                    reset.click();
                }
                if (mode.hasClass("imgur_Zzbv-zzURL")) {
                    if ($(".imgur_Zzbv-imageURL", obj).length < 10) {
                        url.fadeIn();
                    }
                } else {
                    reChoose();
                }
            });
            url.click(function () {
                list.prepend('<div class="imgur_Zzbv-li"><div class="imgur_Zzbv-image"></div><div class="imgur_Zzbv-info"><a class="imgur_Zzbv-remove" href="#">Delete</a><div class="imgur_Zzbv-tip">' + settings.lang.noteURL + '</div><div class="imgur_Zzbv-wrap-progress"><div class="imgur_Zzbv-progress"></div></div><input class="imgur_Zzbv-imageURL" type="text" /></div></div>');
                li_count();
                up_length();
                selected.text($(".imgur_Zzbv-progress", obj).length);
                if ($(".imgur_Zzbv-imageURL", obj).length >= maxItem) {
                    url.hide();
                }
            });
            list.on("input", ".imgur_Zzbv-imageURL", function () {
                var _val = this.value,
                    _thi = $(this),
                    _note = _thi.prev().prev();
                if (/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([[^\\s]\/]*)*\/?.+\.(jpg|png|gif|jpeg|bmp|apng|tiff|xcf)$/i.test(_val) && !$(".imgur_Zzbv-image img[src='" + _val + "']", obj).length) {
                    _thi.parent().prev().html('<img src="' + _val + '" />');
                    _note.html(icon('Complete') + ' ' + _val.match(/\w+\.(jpg|png|gif|jpeg|bmp|apng|tiff|xcf)/i)[0]);
                    _thi.addClass("imgur_Zzbv-ok");
                    var _img = _thi.parent().prev().find("img");
                    _img.error(function () {
                        _note.html('<span class="imgur_Zzbv-errorURL">' + icon('Error') + ' ' + settings.lang.errURL + '</span>');
                        _thi.removeClass("imgur_Zzbv-ok");
                    });
                    _img.load(function () {
                        if (_img.width() == 1 && _img.height() == 1) {
                            _note.html('<span class="imgur_Zzbv-errorURL">' + icon('Error') + ' ' + settings.lang.errSize + '</span>');
                            _thi.removeClass("imgur_Zzbv-ok");
                        }
                    });
                    up_length(obj);
                } else if (_val === null || _val === "") {
                    _note.html('<span class="imgur_Zzbv-errorURL">' + icon('Error') + ' ' + settings.lang.noteURL + '</span>');
                    _thi.removeClass("imgur_Zzbv-ok");
                    _thi.parent().prev().empty();
                } else {
                    _note.html('<span class="imgur_Zzbv-errorURL">' + icon('Error') + ' ' + settings.lang.errRepeat + '</span>');
                    _thi.removeClass("imgur_Zzbv-ok");
                }
            });
            mode.click(function () {
                mode.toggleClass("imgur_Zzbv-zzURL").children("img").toggleClass("imgur_Zzbv-iconUrl");
                reset.click();
            });

            function icon(className) {
                return '<img class="imgur_Zzbv-icon' + className + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" height="16" width="16" alt="' + className + '" />';
            }

            function li_count() {
                if (li_length > 2) {
                    $(".imgur_Zzbv-li", obj).data("height", (li_length * 34)).hover(function () {
                        var _th = $(this);
                        if ($(".imgur_Zzbv-progress", _th).length) {
                            return false;
                        }
                        _th.height(_th.data("height"));
                    }, function () {
                        $(this).height(68);
                    });
                }
            }

            function deleteUr(hash, thix) {
                $(thix).css({
                    "background-image": "url(" + settings.loading + ")",
                    "background-position": "0 0"
                });
                var li = $(thix).closest(".imgur_Zzbv-li");
                $.ajax({
                    url: "https://api.imgur.com/3/image/" + hash,
                    headers: {
                        "Authorization": "Client-ID " + settings.cliendID
                    },
                    type: "DELETE",
                    success: function (json) {
                        var del = [];
                        $.each($(".imgur_Zzbv-input", $(thix).parent()), function (i, code) {
                            del.push(code.value);
                        });
                        settings.remove(del[0], del);
                        $(thix).closest(".imgur_Zzbv-li").remove();
                        select_length();
                        if (complete.text() == "0") {
                            reset.click();
                        }
                    },
                    error: function (json) {
                        errNoti(li, json);
                    }
                });
            }

            function readImage(file) {
                var reader = new FileReader();
                var image = new Image();
                reader.readAsDataURL(file);
                reader.onload = function (_file) {
                    image.src = _file.target.result;
                    image.onerror = function () {
                        return false;
                    };
                    image.onload = function () {
                        var _im = this.src;
                        if (!$(".imgur_Zzbv-image img[src='" + _im + "']", obj).length) {
                            var w = this.width,
                                h = this.height,
                                n = file.name,
                                s = Math.ceil(file.size / 1024) + 'Kb';
                            list.append('<div class="imgur_Zzbv-li"><div class="imgur_Zzbv-image"><img src="' + _im + '" /></div><div class="imgur_Zzbv-info"><a class="imgur_Zzbv-remove" href="#">Delete</a><div class="imgur_Zzbv-tip">' + icon('Complete') + ' ' + settings.lang.choose + '</div><div class="imgur_Zzbv-wrap-progress"><div class="imgur_Zzbv-progress"></div></div><div>' + n + '</div><small><strong>' + w + 'x' + h + '</strong> <em>(' + s + ')</em></small></div></div>');
                            li_count();
                            if ($(".imgur_Zzbv-progress", obj).length > maxItem) {
                                $(".imgur_Zzbv-li:gt(" + (maxItem - 1) + ")", obj).remove();
                            }
                            selected.text($(".imgur_Zzbv-progress", obj).length);
                        }
                        up_length();
                    };
                };
            }

            function imgurUpload(index, imgData, imgType) {
                var _this = $(".imgur_Zzbv-li", obj).eq(index);
                $(".imgur_Zzbv-tip", _this).html('<img src="' + settings.loading + '" alt="loading..." /> <span>' + settings.lang.waitConnect + '</span>');
                $.ajax({
                    url: 'https://api.imgur.com/3/image',
                    xhr: function () {
                        var xhr = new window.XMLHttpRequest();
                        xhr.upload.addEventListener("progress", function (evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = evt.loaded / evt.total * 100 + "%";
                                $(".imgur_Zzbv-tip span", _this).text(settings.lang.waitUpload);
                                $(".imgur_Zzbv-progress", _this).animate({
                                    width: percentComplete
                                });
                            }
                        }, false);
                        return xhr;
                    },
                    method: "POST",
                    headers: {
                        Authorization: "Client-ID " + settings.cliendID
                    },
                    data: {
                        image: imgData,
                        type: imgType
                    },
                    success: function (json) {
                        $(".imgur_Zzbv-info", _this).html(inputcreat(json, settings.format.split(",")));
                        settings.input($(".imgur_Zzbv-input", _this));
                        upComp();
                        _this.addClass("imgur_Zzbv-success");
                        setTimeout(function () {
                            _this.removeClass("imgur_Zzbv-success");
                        }, 300);
                        status.html(icon('Complete'));
                    },
                    error: function (json) {
                        status.html(icon('Error'));
                        errNoti(_this, json);
                        upComp();
                    }
                });
            }

            function upComp() {
                select_length();
                if ($(".imgur_Zzbv-progress", obj).length === 0) {
                    reset.fadeIn();
                }
            }

            function select_length() {
                complete.text($(".imgur_Zzbv-delete", obj).length);
            }

            function errNoti(thix, json) {
                $(".imgur_Zzbv-info", thix).html('<div class=".imgur_Zzbv-dl"><div class=".imgur_Zzbv-dt"></div><div class=".imgur_Zzbv-dd" style="margin-left: 0!important; color: red">' + json.statusText + '</div></div><div class=".imgur_Zzbv-dl"><div class=".imgur_Zzbv-dt"></div><div class=".imgur_Zzbv-dd" style="margin-left: 0!important">' + settings.lang.errContact + '</div></div>');
            }

            function formatBBcode(json, format) {
                var bbcode, link = json.data.link;
                var img = "IMG",
                    url = "URL";
                if (/o|s|b|t|m|l|h/.test(format)) {
                    img = "img";
                    url = "url";
                }
                if ((null === format) || ("" === format)) {
                    bbcode = link;
                } else if (format === "o") {
                    bbcode = "[" + img + "]" + link + "[/" + img + "]";
                } else {
                    bbcode = "[" + url + "=" + link + "][" + img + "]http://i.imgur.com/" + json.data.id + format + "." + json.data.type.split("/")[1] + "[/" + img + "][/" + url + "]";
                }
                return bbcode;
            }

            function nameformat(test) {
                var title = "";
                switch (test) {
                case "o":
                    title = "Original";
                    break;
                case "s":
                    title = "Small Square";
                    break;
                case "b":
                    title = "Big Square";
                    break;
                case "t":
                    title = "Small Thumb";
                    break;
                case "m":
                    title = "Medium Thumb";
                    break;
                case "l":
                    title = "Large Thumb";
                    break;
                case "h":
                    title = "Huge Thumb";
                    break;
                case "c":
                    title = "Custom";
                    break;
                default:
                    title = "Direct Link";
                }
                return title;
            }

            function inputcreat(json, arr) {
                var input = "",
                    format = [],
                    clas = "",
                    output = "";
                $.each(arr, function (i, val) {
                    var check = val.match(/\{(o|s|b|t|m|l|h)\}/gi);
                    if (check === null) {
                        clas = val;
                        output = formatBBcode(json, val);
                    } else {
                        var custom = val;
                        $.each(check, function (i, code) {
                            clas = /o|s|b|t|m|l|h/.exec(code)[0];
                            custom = custom.replace(code, "http://i.imgur.com/" + json.data.id + clas + "." + json.data.type.split("/")[1]);
                        });
                        clas = "c";
                        output = custom;
                    }
                    format.push(output);
                    var delBtn = '<a class="imgur_Zzbv-delete" data-delete="' + json.data.deletehash + '" href="#" target="_blank">Delete</a>';
                    if (i !== 0) {
                        delBtn = "";
                    }
                    input += delBtn + '<div class="imgur_Zzbv-dl"><div class="imgur_Zzbv-dt">' + nameformat(clas) + ':</div><div class="imgur_Zzbv-dd"><input type="text" class="imgur_Zzbv-input" value="' + output + '" readonly="readonly" /></div></div>';
                });
                settings.success(format[0], format);
                return input;
            }

            function up_length() {
                upload.add(length).fadeIn();
            }

            function reChoose() {
                $(".imgur_Zzbv-choose", obj).replaceWith($(".imgur_Zzbv-choose", obj).clone());
            }

            function mini() {
                if (zzbv.width() < 220) {
                    zzbv.addClass("imgur_Zzbv-mini");
                } else {
                    zzbv.removeClass("imgur_Zzbv-mini");
                }
            }
        });
    };
}(jQuery));

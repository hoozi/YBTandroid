document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady(){
    navigator.splashscreen.hide();
    if(Connection.NONE==navigator.connection.type) {
        if(J.hasPopupOpen){
            J.closePopup();
        }
        J.Toast.show("error","网络未连接！")  
    }
var serverUrl = "http://www.yibutong.com.cn/js/version.js";
window.plugins.updateApp.checkAndUpdate(serverUrl);
    //注册后退按钮
    document.addEventListener("backbutton", function (e) {
       
        if(J.hasMenuOpen){
            J.Menu.hide();
        }else if(J.hasPopupOpen){
            J.closePopup();
        }else{
            var sectionId = $('section.active').attr('id');
            if(sectionId == 'index'){
                J.confirm('提示','是否退出程序？',function(){
                    navigator.app.exitApp();
                });
            }else{
                window.history.go(-1);
            }
        }
    }, false);
}

//根据屏幕大小，计算出fontsize，配合rem自适应
fontSize()
function fontSize() {
    var W = $(window).width();
    var fontSize = W/16;
    $("html").css("fontSize",fontSize>40?40:fontSize);
}
$(window).on("resize",function(){
    fontSize()
})

J.FindParm = function(query, name) {
    var qArr = query.split("&");
    for(var i=0; i<qArr.length; i++) {
        var item = qArr[i].split("=");
        if(item[0]===name) {
            return item[1];
        }
    }
    return -1;
}
var App = (function(){
    var pages = {};
    var resultPath = "page/result/";
    var selectPath = "page/select/"
    var run = function(){
        $.each(pages,function(k,v){
            var sectionId = '#'+k;
            $('body').delegate(sectionId,'pageinit',function(){
                v.init && v.init.call(v);
            });
            $('body').delegate(sectionId,'pageshow',function(e,isBack){
                //页面加载的时候都会执行
                v.show && v.show.call(v);
                //后退时不执行
                if(!isBack && v.load){
                    v.load.call(v);
                }
            });
        });
        //J.Transition.add('flip','slideLeftOut','flipOut','slideRightOut','flipIn');
        Jingle.launch({
            //transitionType : 'cover',
            showPageLoading : false,
            basePagePath : 'page/',
            remotePage: {
                
                "#voyage-result":resultPath+"voyage/voyage-result.html",
                "#branch":resultPath+"voyage/branch.html",
                "#port-select":selectPath+"voyage/port-select.html",
                "#code-select":selectPath+"voyage/code-select.html",
                
                "#price-result":resultPath+"price/price-result.html",
                "#price-detail":resultPath+"price/price-detail.html",
                
                "#ex-result": resultPath+"exportPublishList/ex-result.html",
                "#ex-select": selectPath+"exportPublishList/ex-select.html",
                
                "#trq-result": resultPath+"truckRequirementQuery/trq-result.html",
                
                "#eaq-result": resultPath+"examineApplyQuery/eaq-result.html",
                "#eaq-detail": resultPath+"examineApplyQuery/eaq-detail.html",
                
                "#pq-result": resultPath+"portQuery/pq-result.html",
                
                "#l-select": selectPath+"linerPlanQuery/l-select.html",
                "#l-result": resultPath+"linerPlanQuery/l-result.html",
                "#l-detail": resultPath+"linerPlanQuery/l-detail.html",
                
                "#track-result":resultPath+"track/track-result.html",
                
                "#delivery-result":resultPath+"delivery/delivery-result.html",
                
                "#clp-result":resultPath+"clp/clp-result.html",
                
                "#ctnRelease-result":resultPath+"ctnRelease/ctnRelease-result.html",
                "#ctn-info":resultPath+"ctnRelease/ctn-info.html",
                "#ctn-detail":resultPath+"ctnRelease/ctn-detail.html",
                
                "#GPS-result":resultPath+"GPS/GPS-result.html",
                
                "#yard-select":selectPath+"yard/yard-select.html",
                "#typeSize-select":selectPath+"yard/typeSize-select.html",
                "#yard-result":resultPath+"yard/yard-result.html",
                "#yard-detail":resultPath+"yard/yard-detail.html",
                "#map-detail": resultPath+"yard/map-detail.html",
                
                "#ship-detail": resultPath+"ship/ship-detail.html"
            }
        });
       
    };
    var page = function(id,factory){
        return ((id && factory)?_addPage:_getPage).call(this,id,factory);
    }
    var _addPage = function(id,factory){
        pages[id] = new factory();
    };
    var _getPage = function(id){
        return pages[id];
    }
 
    return {
        run : run,
        page : page
    }
}());

var tmplinit = function(html) {
    return html.replace(/\s+</g,"<")
           .replace(/>\s+</g,"><")
           .replace(/>\s+/g,">") 
}

var _switchEvent = function(el, href, query, placeholder){
    var $el = $(el);
    var $btn = $el.find(".submit");
    var $ipt = $el.find(".ipt")
    //var placeholder = ["请输入完整箱号(不区分大小写)","请输入完整提单号(不区分大小写)"];
    $(el).on("tap", "li", function(){
        var $index = $(this).index();
        var value = $(this).data("value");
        $btn.attr("href", (href || "#track-result?type=")+value+(("&"+query) || ""))
        $ipt.attr("placeholder", placeholder[$index]);
    })
}

var _refresh = function(el, info){
    var $el = $(el);
    var $switch = $el.find(".search-switch");
    var $ipt = $el.find(".ipt");
    $el.on('pagehide',function(e,isBack){
        if(isBack) {
            var $li = $switch.find("li");
            $li.removeClass("active");
            $li.first().addClass("active");
            $ipt.val("").attr("placeholder", info || "请输入完整箱号(不区分大小写)");
        }
    });
}

/*
 * @param {String} id 地图容器id
 * @param {Array} point 初始化定位的点坐标
 * @param {int} 放大级别
 * @return {Object} 地图对象
 * */
var _createMap = function(id, point, zoom) {
    var map = new BMap.Map(id);   
    var point = new BMap.Point(point[0],point[1]); 
    map.centerAndZoom(point, zoom);
    map.addControl(new BMap.ZoomControl());
    return map;
}



var _checkRequired = function(el, btn, info) {
    var $el = $(el);
    var $ipt = $el.find(".ipt");
    $el.on("tap", btn, function(){
        if(!$ipt.val()) {
            J.Toast.show("error", info || "请填写完整的箱号或者提单号！");
            return false;
        }
    })
}

App.page("index",function(){
    var pageNum, category;
    this.init = function(){
        $("#news_article").on("articleshow", function(){
            _initNav();
        })
        pageNum = 1;
        category = $("#news-grid").find(".active").data("category");
        _getNews();
        _initAd(); 
    }
    var _initAd = function(){
        new J.Slider({
            selector : '#index-ad',
            noDots : true,
            autoPlay : true
        });
    }
    var _initNav = function() {
        J.Scroll("#newsNav-scroll",{
            hScroll:true,
            hScrollbar : false
        });
        $("#news-grid").on("tap", "a", function(){
            J.showMask();
            J.Scroll("#news-scroll").scroller.scrollTo(0,0);
            $("#news-list").empty();
            category = $(this).data("category");
            pageNum = 1;
            $(this).siblings().removeClass("active").end().addClass("active");
            if(category==7) {
                _getForword();
            } else {
                _getNews();
            }
        })
    }
    var _getNews = function(scroll) {
        FindData.getNews(category, pageNum, function(data) {
            if(pageNum == 1) {
               _renderFirstPage(data); 
            } else {
               _renderNextPage(scroll, data) 
            }
            J.Scroll("#news-scroll");
            var timer1 = null
            J.Refresh("#news-scroll", "pullUp", function(){
                var scroll = this;
                pageNum++;
                clearTimeout(timer1);
                timer1 = setTimeout(function(){_getNews(scroll);},500);
            })
        })
    }
    var _getForword = function(){
        FindData.getForword(function(data){
            J.Template.render("#news-list", "news-templ3", data);
            J.Scroll("#news-scroll");
            J.hideMask();
        })
    }
    var _renderFirstPage = function(data) {
        if(!data["list"].length) {
            J.Toast.show("info","没有找到任何数据！");
        }
        if(category==5) {
            J.Template.render("#news-list", "news-templ2", data);
        } else {
            Handlebars.registerHelper("each", function(data,options){
                var html = "";
                for(var i=0; i<data.length; i++) {
                    var item = "";
                    item = options.fn(data[i], {
                        data:{
                            latest:!!(i<2)
                        }
                    })
                    html+=item;
                }
                return html;
            })
            J.Template.render("#news-list", "news-templ", data);
        }
        J.hideMask();
    }
    var _renderNextPage = function(scroll, data) {
        if(!data["list"].length) {
            J.Toast.show("info","已经是最后一页了！");
            pageNum--;
            return false;
        }
        if(category==5) {
            J.Template.render("#news-list", "news-templ2", data, "add");
        } else {
            J.Template.render("#news-list", "news-templ", data, "add");
        }
        scroll.refresh();
        J.showToast("获取成功","success");
    }

})
App.page("news-detail", function() {
    var query, id, img;
    this.init = function(){
        $("#news-detail").on("pagehide", function(e, isBack){
            if(isBack) {
                $("#news-title").empty();
                $("#news-detail-content").empty();
            }
        })
    }
    this.load = function(){
        J.showMask();
        query = $("#news-detail").data("query");
        id = J.FindParm(query, "id");
        _getNewsById();
    }
    var _getNewsById = function(){
        FindData.getNewsById(id, function(data) {
            //J.Template.render("#news-title", "news-title-templ", data);
            Handlebars.registerHelper("each", function(data,options){
                var html = "";
                for(var i=0; i<data.length; i++) {
                    var item = "";
                    var suffix = data[i]["suffix"];
                    var url = !!(suffix==".jpg"||suffix==".png"||suffix==".gif")
                    item = options.fn(data[i], {
                        data:{
                            url: url
                        }
                    })
                    html+=item;
                }
                return html;
            })
            J.Template.render("#news-detail-content", "news-detail-templ", data);
            img = $("#news-detail-content").find("img");
            if(img.length) {
                J.imageLoad(img, function(){
                    J.Scroll("#news-detail-scroll");
                    J.hideMask();
                })
            } else {
                J.Scroll("#news-detail-scroll");
                J.hideMask();
            }
            
        })
    }
})
App.page("forword-detail", function() {
    var query, id, img;
    this.init = function(){
        $("#forword-detail").on("pagehide", function(e, isBack){
            if(isBack) {
                $("#forword-company").empty();
                $("#forword-info").empty();
            }
        })
    }
    this.load = function(){
        J.showMask();
        query = $("#forword-detail").data("query");
        id = J.FindParm(query, "companyid");
        _getForwordById();
    }
    var _getForwordById = function(){
        FindData.getForwordById(id, function(data) {
            J.Template.render("#forword-company", "forword-detail-templ", data);
            J.Template.render("#forword-info", "forword-info-templ", data)
            J.Scroll("#forword-detail-scroll");
            J.hideMask();  
        })
    }
})
App.page("voyage", function(){
    this.init = function(){
       
    }
})


App.page("port-select", function(){
    this.init = function(){
       _select(".port", "#port-text")
    }
})
App.page("code-select", function(){
    this.init = function(){
       _select(".code", "#code-text")
    }
})
App.page("ex-select", function(){
    this.init = function(){
        _select(".ex", "#ex-text")
    }
})
var _select = function(el1, el2) {
    $(el1).on("tap", "a", function(){
        var $this = $(this);
        var $parent = $this.parent();
        var $siblings = $parent.siblings();
        $siblings.find(".icon").attr("class","icon checkbox-unchecked");
        $this.find(".icon").attr("class","icon checkbox-checked")
        $parent.siblings().removeClass("active");
        $parent.addClass("active")
        $(el2).text($this.text());
        $(el2).data("value",$this.data("value"))
    })
}


App.page("voyage-result", function(){
    var voyageScroll, port, code, vesselEname, vesselCname, voyageIn, voyageOut, $vContent, $branchLink;
    this.init = function(){
    var $voyageWrap = $("#voyage-result");
    $vContent = $("#voyage-content");
    $branchLink = $(".branch-link");
    $voyageWrap.on('pagehide',function(e,isBack){
        if(isBack) $vContent.empty();
    });
        
    }
    this.load = function() {
        pageNum = 1;
        $vContent = $("#voyage-content");
        port = $("#port-text").data("value");
        code = $("#code-text").data("value");
        vesselEname = $("#vesselEname").val() || "";
        vesselCname = $("#vesselCname").val() || "";
        voyageIn = $("#voyageIn").val() || "";
        voyageOut = $("#voyageOut").val() || "";
        voyageScroll = "#voyage-scroll";
        J.showMask();
        _getPage();
    }
    var _getPage = function(scroll){
        FindData.getVoyage(port, code, vesselEname, vesselCname, voyageIn, voyageOut, pageNum, function(data){ 
            Handlebars.registerHelper("list", function(data,options){
                var html = "", len = $vContent.find(".result-list").length;
                for(var i=0; i<data.length; i++) {
                    var item = "";
                    var hasArrivalPort = data[i]["voyageInfo"]["arrivalPort"]=="CNZPU"?true:false;
                    var index = len?len+i+1:i+1;
                    var publishDate = data[i]["voyageInfo"]["publishDate"].substring(0,8);
                    var today = (J.Util.formatDate(new Date(),"yyyyMd") == publishDate) ? "<div class='tag voyage-today'>今天</div>" : "";
                    Handlebars.registerPartial('today', today) 
                    item = options.fn(data[i], {
                        data:{
                            index: index,
                            hasArrivalPort: hasArrivalPort
                        }
                    })
                    html+=item;
                }
                return html;
            })
            if(pageNum == 1){
                _renderFirstPage(data);
            }else{
                _renderNextPage(scroll, data);
            }
            J.Scroll(voyageScroll);
            var timer2 = null
            J.Refresh(voyageScroll, "pullUp", function(){
                var scroll = this;
                pageNum++;
                clearTimeout(timer2);
                timer2 = setTimeout(function(){ _getPage(scroll);},500);
            })
        });
    }
    var _renderFirstPage = function(data) {
        if(!data["list"].length) {
            J.hideMask();
            J.Toast.show("info","没有找到任何数据！");
            return false;
        }
        J.Template.render("#voyage-content", "voyage-templ", data);
        J.hideMask();
    }
    var _renderNextPage = function(scroll, data) {
        if(!data["list"].length) {
            J.Toast.show("info","已经是最后一页了！");
            pageNum--;
            return false;
        }
        J.Template.render("#voyage-content", "voyage-templ", data, "add");
        scroll.refresh();
        J.showToast("获取成功","success");
    }
     
})

App.page('branch', function(){
    var id, $bContent, query;
    this.init = function(){
        $bContent = $("#branch-content")
        $("#branch").on('pagehide',function(e,isBack){
            if(isBack) $bContent.empty();
        });
    }
    this.load = function(){
        J.showMask();
        query = $("#branch").data("query");
        id = J.FindParm(query, "id");
        $bContent = $("#branch-content");
        _branch();
    }
    
    var _branch = function(){
        
        FindData.getVoyageBranch(id, function(data) {
            J.Template.render("#branch-content", "branch-templ", data);
            J.hideMask();
            J.Scroll("#branch-scroll");
        })
    }
})

App.page("price-result", function(){
    var shipmentPort, dischargePort, shipper, gotoPage;
    this.init = function(){
        $("#price-result").on('pagehide',function(e,isBack){
            if(isBack) $("#price-content").empty();
        });
        
    }
    this.load = function() {
        gotoPage = 1;
        shipmentPort = $("#shipmentPort").val().toUpperCase() || "";
        dischargePort = $("#dischargePort").val().toUpperCase() || "";
        shipper = $("#shipper").val().toUpperCase() || "";
        J.showMask();
        _getPage();
    }
    var _getPage = function(scroll){
        FindData.getPrice(shipmentPort, dischargePort, shipper, gotoPage, function(data){ 
            if(gotoPage == 1){
                _renderFirstPage(data);
            }else{
                _renderNextPage(scroll, data);
            }
            J.Scroll("#price-scroll");
            var timer2 = null
            J.Refresh("#price-scroll", "pullUp", function(){
                var scroll = this;
                gotoPage++;
                clearTimeout(timer2);
                timer2 = setTimeout(function(){ _getPage(scroll);},500);
            })
        });
    }
    var _renderFirstPage = function(data) {
        if(!data["list"].length) {
            J.hideMask();
            J.Toast.show("info","没有找到任何数据！");
            return false;
        }
        J.Template.render("#price-content", "price-templ", data);
        J.hideMask();
    }
    var _renderNextPage = function(scroll, data) {
        if(!data["list"].length) {
            J.Toast.show("info","已经是最后一页了！");
            gotoPage--;
            return false;
        }
        J.Template.render("#price-content", "price-templ", data, "add");
        scroll.refresh();
        J.showToast("获取成功","success");
    }
     
})

App.page('price-detail', function(){
    var forwarder, shipmentPort, dischargePort, shipper, sailingDate, query;
    this.init = function(){
        $bContent = $("#branch-content")
        $("#price-detail").on('pagehide',function(e,isBack){
            if(isBack) $("#price-detail-content").empty();
        });
    }
    this.load = function(){
        J.showMask();
        query = $("#price-detail").data("query");
        forwarder = J.FindParm(query, "forwarder");
        shipmentPort = J.FindParm(query, "shipmentPort");
        dischargePort = J.FindParm(query, "dischargePort");
        shipper = J.FindParm(query, "shipper");
        sailingDate = J.FindParm(query, "sailingDate");
        _getPriceDetail();
    }
    
    var _getPriceDetail = function(){
        
        FindData.getPriceDetail(forwarder, shipmentPort, dischargePort, shipper, sailingDate, function(data) {
            J.Template.render("#price-detail-content", "price-detail-templ", data);
            J.hideMask();
            J.Scroll("#price-detail-scroll");
        })
    }
})

App.page("ex-result", function(){
    var shipmentPort, dischargePort, shipper, gotoPage;
    this.init = function(){
        $("#ex-result").on('pagehide',function(e,isBack){
            if(isBack) $("#ex-content").empty();
        });
        
    }
    this.load = function() {
        gotoPage = 1;
        shipmentPort = $("#ex-text").data("value");
        dischargePort = $("#dischargePort").val().toUpperCase() || "";
        cargoDesc = $("#cargoDesc").val().toUpperCase() || "";
        J.showMask();
        _getPage();
    }
    var _getPage = function(scroll){
        FindData.getEx(shipmentPort, dischargePort, cargoDesc, gotoPage, function(data){
             Handlebars.registerHelper("list", function(data,options){
                var html = "";
                for(var i=0; i<data.length; i++) {
                    var item = "";
                    var ctnFlag = !!(data[i]["ctnFlag"]=="F")
                    item = options.fn(data[i], {
                        data:{
                            ctnFlag: ctnFlag
                        }
                    })
                    html+=item;
                }
                return html;
            }) 
            if(gotoPage == 1){
                _renderFirstPage(data);
            }else{
                _renderNextPage(scroll, data);
            }
            J.Scroll("#ex-scroll");
            var timer2 = null
            J.Refresh("#ex-scroll", "pullUp", function(){
                var scroll = this;
                gotoPage++;
                clearTimeout(timer2);
                timer2 = setTimeout(function(){ _getPage(scroll);},500);
            })
        });
    }
    var _renderFirstPage = function(data) {
        if(!data["list"].length) {
            J.hideMask();
            J.Toast.show("info","没有找到任何数据！");
            return false;
        }
        J.Template.render("#ex-content", "ex-templ", data);
        J.hideMask();
    }
    var _renderNextPage = function(scroll, data) {
        if(!data["list"].length) {
            J.Toast.show("info","已经是最后一页了！");
            gotoPage--;
            return false;
        }
        J.Template.render("#ex-content", "ex-templ", data, "add");
        scroll.refresh();
        J.showToast("获取成功","success");
    }
     
})

App.page("trq-result", function(){
    var cargoName, startPlace, endPlace, gotoPage;
    this.init = function(){
        $("#trq-result").on('pagehide',function(e,isBack){
            if(isBack) $("#trq-content").empty();
        });
        
    }
    this.load = function() {
        gotoPage = 1;
        cargoName = $("#cargoName").val().toUpperCase() || "";
        startPlace = $("#startPlace").val().toUpperCase() || "";
        endPlace = $("#endPlace").val().toUpperCase() || "";
        J.showMask();
        _getPage();
    }
    var _getPage = function(scroll){
        FindData.getTrq(cargoName, startPlace, endPlace, gotoPage, function(data){
             Handlebars.registerHelper("list", function(data,options){
                var html = "";
                for(var i=0; i<data.length; i++) {
                    var item = "";
                    var loadingSymbol = !!(data[i]["loadingSymbol"]=="N");
                    item = options.fn(data[i], {
                        data:{
                            loadingSymbol: loadingSymbol
                        }
                    })
                    html+=item;
                }
                return html;
            }) 
            if(gotoPage == 1){
                _renderFirstPage(data);
            }else{
                _renderNextPage(scroll, data);
            }
            J.Scroll("#trq-scroll");
            var timer2 = null
            J.Refresh("#trq-scroll", "pullUp", function(){
                var scroll = this;
                gotoPage++;
                clearTimeout(timer2);
                timer2 = setTimeout(function(){ _getPage(scroll);},500);
            })
        });
    }
    var _renderFirstPage = function(data) {
        if(!data["list"].length) {
            J.hideMask();
            J.Toast.show("info","没有找到任何数据！");
            return false;
        }
        J.Template.render("#trq-content", "trq-templ", data);
        J.hideMask();
    }
    var _renderNextPage = function(scroll, data) {
        if(!data["list"].length) {
            J.Toast.show("info","已经是最后一页了！");
            gotoPage--;
            return false;
        }
        J.Template.render("#trq-content", "trq-templ", data, "add");
        scroll.refresh();
        J.showToast("获取成功","success");
    }
     
})

var eaqData = [];
var applyStatusfn = function(s){
    var applyStatus = ""
    switch(s) {
        case "C":
            applyStatus = "预约申请";
        break;
        case "CM":
            applyStatus = "能够移箱";
        break;
        case "UM":
            applyStatus = "不能移箱";
        break;
        case "OK":
            applyStatus = "移箱完成";
        break;
        case "R":
            applyStatus = "预约撤销";
        break;
        case "CR":
            applyStatus = "能够撤销";
        break;
        case "UR":
            applyStatus = "不能撤销";
        break;
        case "OR":
            applyStatus = "撤销完成";
        break;
        case "OT":
            applyStatus = "归位完成";
        break;
    }
    return applyStatus;
} 
App.page("eaq-result", function(){
    var ctnNo, gotoPage;
    this.init = function(){
        $("#eaq-result").on('pagehide',function(e,isBack){
            if(isBack) $("#eaq-content").empty();
        });
        
    }
    this.load = function() {
        gotoPage = 1;
        ctnNo = $("#ctnNo").val() || "";
        J.showMask();
        _getPage();
    }
    var _getPage = function(scroll){
        FindData.getEaq(ctnNo, gotoPage, function(data){
             eaqData = data["list"]
             Handlebars.registerHelper("each", function(data,options){
                var html = "";
                for(var i=0; i<data.length; i++) {
                    var item = "";
                    if(data[i]["billNo"].indexOf("|")>-1) {
                        var billNoArr = data[i]["billNo"].split("|");
                        var billNolist = "";
                        for(var j=0; j<billNoArr.length; j++) {
                            billNolist+=billNoArr[j]+"<br/>"
                        }
                    } else {
                       billNolist = data[i]["billNo"]
                    }
                    if(data[i]["contactPhone"].indexOf("|")>-1) {
                        var phoneArr = data[i]["contactPhone"].split("|");
                        var contactPhonelist = "";
                        for(var n=0; n<phone.length; n++) {
                            contactPhonelist+=phoneArr[n]+"<br/>"
                        }
                    } else {
                       contactPhonelist = data[i]["contactPhone"]
                    }
                    
                    Handlebars.registerPartial('billNolist', billNolist);
                    Handlebars.registerPartial('contactPhonelist', contactPhonelist);
                    Handlebars.registerPartial('applyStatus', applyStatusfn(data[i]["applyStatus"]));
                    item = options.fn(data[i], {
                        data: {
                            index: i
                        }
                    })
                    html+=item;
                }
                return html;
            }) 
            if(gotoPage == 1){
                _renderFirstPage(data);
            }else{
                _renderNextPage(scroll, data);
            }
            J.Scroll("#eaq-scroll");
            var timer2 = null
            J.Refresh("#eaq-scroll", "pullUp", function(){
                var scroll = this;
                gotoPage++;
                clearTimeout(timer2);
                timer2 = setTimeout(function(){ _getPage(scroll);},500);
            })
        });
    }
    var _renderFirstPage = function(data) {
        if(!data["list"].length) {
            J.hideMask();
            J.Toast.show("info","没有找到任何数据！");
            return false;
        }
        J.Template.render("#eaq-content", "eaq-templ", data);
        J.hideMask();
    }
    var _renderNextPage = function(scroll, data) {
        if(!data["list"].length) {
            J.Toast.show("info","已经是最后一页了！");
            gotoPage--;
            return false;
        }
        J.Template.render("#eaq-content", "eaq-templ", data, "add");
        scroll.refresh();
        J.showToast("获取成功","success");
    }
     
})

App.page("eaq-detail", function(){
    var index, query;
    this.init = function(){
        $("#eaq-detail").on('pagehide',function(e,isBack){
            if(isBack) $("#eaq-detail-content").empty();
        });
    }
    this.load = function() {
        J.showMask();
        query = $("#eaq-detail").data("query");
        index = J.FindParm(query, "index");
        _showEaqDetail(index);
    }
    var _showEaqDetail = function(index){
        if(eaqData[index]["billNo"].indexOf("|")>-1) {
            var billNoArr = eaqData[index]["billNo"].split("|");
            var billNolist = "";
            for(var j=0; j<billNoArr.length; j++) {
                billNolist+=billNoArr[j]+"<br/>"
            }
        } else {
           billNolist = eaqData[index]["billNo"]
        }
        if(eaqData[index]["contactPhone"].indexOf("|")>-1) {
            var phoneArr = eaqData[index]["contactPhone"].split("|");
            var contactPhonelist = "";
            for(var n=0; n<phone.length; n++) {
                contactPhonelist+=phoneArr[n]+"<br/>"
            }
        } else {
           contactPhonelist = eaqData[index]["contactPhone"]
        }
        var data = eaqData[index];
        eaqData[index]["flag"] = !!(eaqData[index]["applyStatus"]!="C" || eaqData[index]["applyStatus"]!="R"); 
        Handlebars.registerPartial('billNolist', billNolist);
        Handlebars.registerPartial('contactPhonelist', contactPhonelist);
        Handlebars.registerPartial('mFlagDesc', eaqData[index]["feedbackMovectnFlag"] == 'OK' ? "移箱到位":"移箱受理");
        Handlebars.registerPartial('mstatus', applyStatusfn(eaqData[index]["feedbackMovectnFlag"]));
        Handlebars.registerPartial('cFlagDesc', eaqData[index]["feedbackCancelFlag"] == 'OK' ? "撤销完成":"撤销受理");
        Handlebars.registerPartial('cstatus', applyStatusfn(eaqData[index]["feedbackCancelFlag"]));
        Handlebars.registerPartial('rstatus', applyStatusfn(eaqData[index]["feedbackReturnctnFlag"]));
        J.Template.render("#eaq-detail-content", "eaq-detail-templ", eaqData[index]);
        J.hideMask();
    }
     
})

App.page("pq-result", function(){
    var portName, gotoPage;
    this.init = function(){
        $("#pq-result").on('pagehide',function(e,isBack){
            if(isBack) $("#pq-content").empty();
        });
        
    }
    this.load = function() {
        gotoPage = 1;
        portName = $("#portName").val().toUpperCase() || "";
        J.showMask();
        _getPage();
    }
    var _getPage = function(scroll){
        FindData.getPort(portName, gotoPage, function(data){ 
            if(gotoPage == 1){
                _renderFirstPage(data);
            }else{
                _renderNextPage(scroll, data);
            }
            J.Scroll("#pq-scroll");
            var timer2 = null
            J.Refresh("#pq-scroll", "pullUp", function(){
                var scroll = this;
                gotoPage++;
                clearTimeout(timer2);
                timer2 = setTimeout(function(){ _getPage(scroll);},500);
            })
        });
    }
    var _renderFirstPage = function(data) {
        if(!data["portList"].length) {
            J.hideMask();
            J.Toast.show("info","没有找到任何数据！");
            return false;
        }
        J.Template.render("#pq-content", "pq-templ", data);
        J.hideMask();
    }
    var _renderNextPage = function(scroll, data) {
        if(!data["portList"].length) {
            J.Toast.show("info","已经是最后一页了！");
            gotoPage--;
            return false;
        }
        J.Template.render("#pq-content", "pq-templ", data, "add");
        scroll.refresh();
        J.showToast("获取成功","success");
    }
     
})

App.page("l-select", function(){
    var portName, gotoPage;
    this.init = function(){
        J.showMask();
        _select(".l-s", "#l-text")
       _getLineList();
    }
    var _getLineList = function(){
        FindData.getLineList("201401", function(data){
            var list = {};
            list.liner=data;
            Handlebars.registerHelper("code", function(lineList){
               return lineList[0]
            });
            Handlebars.registerHelper("line", function(lineList){
               return lineList[1]
            })
            J.Template.render("#l-select-list", "l-select-templ", list);
            J.Scroll("#l-select-scroll");
            J.hideMask(); 
        });
    }
    
})

App.page("linerPlanQuery", function(){
    var month;
    this.init = function(){
        J.showMask();
       _getMonth();
    }
    var _getMonth = function(){
        FindData.getMonth(function(data){
            if(data.flag==0) {
                J.hideMask();
                J.showToast('获取系统时间异常！','info');
                return false;
            }
            for(var i=0;i<data.length;i++) {
                month = data[i]
            }
            $("#month").val(month);
            J.hideMask();
        });
    }
    
});
App.page("l-result", function(){
    var month,liner;
    this.init = function(){
       $("#l-result").on('pagehide',function(e,isBack){
            if(isBack) $("#l-content").empty();
       });
    }
    this.load = function() {
        month = $("#month").val();
        liner = $("#l-text").data("value");
        console.log(month+"===="+liner)
        J.showMask();
        _getLine();
    }
    var _getLine = function(){
        FindData.getLine(liner, month, function(data){
            if(data.flag==0) {
                J.hideMask();
                J.Toast.show("info","没有找到相关数据");
                return false;
            }
            J.Template.render("#l-content", "l-templ", data);
            J.Scroll("#l-scroll");
            J.hideMask(); 
        });
    }
    
})
App.page("l-detail", function(){
    var ctnVesselSysid, query;
    this.init = function(){
       $("#l-detail").on('pagehide',function(e,isBack){
            if(isBack) $("#l-detail-content").empty();
       });
    }
    this.load = function() {
        query = $("#l-detail").data("query");
        ctnVesselSysid = J.FindParm(query, "ctnVesselSysid");
        J.showMask();
        _getLineDetail();
    }
    var _getLineDetail = function(){
        FindData.getLineDetail(ctnVesselSysid, function(data){
            if(data.flag==0) {
                J.hideMask();
                J.Toast.show("info","没有找到相关数据");
                return false;
            }
            
            J.Template.render("#l-detail-content", "l-detail-templ", data);
            J.Scroll("#l-detail-scroll");
            J.hideMask(); 
        });
    }
    
})

App.page('track', function(){
    var $trackSwitch,query,href,newhref;
    this.init = function(){
        _thisPage = "#track";
       query = $("#track").data("query");
       href = $("#track-search").attr("href");
       track = J.FindParm(query, "track");
       _trackInit()
       _switchEvent(_thisPage, null, query, ["请输入完整箱号(不区分大小写)","请输入完整提单号(不区分大小写)"]);
       _checkRequired(_thisPage,".track-search");
       _refresh(_thisPage);
    }
    var _trackInit = function(){
        if(track=="importTrace") {
            $("#track-title").text("进口跟踪");
        } else {
            $("#track-title").text("出口跟踪");
        }
        newhref = href.indexOf("?") ? href+"&"+query : "?" + query;
        $("#track-search").attr("href", newhref)
    }

});

App.page('track-result', function(){
    var type, hasTrace, query, value;
    this.init = function(){
        $("#track-result").on('pagehide',function(e,isBack){
            if(isBack) {
                $("#ctn-content").empty();
                $("#node-content").empty();
            }
        });
        query = $("#track-result").data("query");
        hasTrace = J.FindParm(query,"track");
       _resultInit();
    }
    this.load = function(){
       value = $("#track-ipt").val();
       query = $("#track-result").data("query");
       hasTrace = J.FindParm(query,"track");
       type = J.FindParm(query,"type");
       J.showMask();
       _getTrace();  
    }
    
    var _resultInit = function() {
       if(hasTrace=="importTrace") {
           $("#hasTitle").text("进口跟踪查询结果");
       } else {
           $("#hasTitle").text("出口跟踪查询结果");
       }
    }
    
    var _getTrace = function() {
        FindData.getTrace(type, hasTrace, value, function(data) {
            J.hideMask();
            if(type=="ctn") {
               _ctn(data)
            } else {
               _bill(data) 
            }
            J.Scroll("#ctn");
            J.Scroll("#node");
        })
    }
    
    var _ctn = function(data) {
        if(data.flag=="0"){
             J.Toast.show("info", "没有相关记录!");
             return false;
         }
         if(data.ctnFlag=="m"){
             J.alert("温馨提示","我们发现这个箱号下存在多个提单，我们给您列出其中一条提单的相关信息，若要精确查询信息请按提单号进行查询!");
         }
         
         if(data.flag==100){
             J.Toast.show("info", "没有访问权限!"); 
             return false;
         }
        J.Template.render("#ctn-content", "ctn-templ", data);
        Handlebars.registerHelper("list", function(data,options){
            var html = "";
            for(var i=data.length-1; i>=0; i--) {
                item = options.fn(data[i]);
                html+=item;
            }
            return html;
        })
        J.Template.render("#node-content", "node-ctn-templ", data);
    }
    
    var _bill = function(data) {
        J.Template.render("#ctn-content", "bl-templ", data);
        Handlebars.registerHelper("list", function(data,options){
            var html = "",multi = "";
            for(var i=data.length-1; i>=0; i--) {
                var hasSon = data[i].nodeFlagCtn;
                var item = "";
                var nodeSequence = data[i].nodeSequence;
                var nextNodeSequence = i!=0?data[i-1].nodeSequence:data[0].nodeSequence;
                
                //是否有子节点（N代表有；否则代表无）
                if(hasSon=="N") {
                    item = options.fn(data[i], {
                        data: {
                            hasSon:true
                        }
                    });
                } else {
                    
                    //前一个是否和后一个相同，相同的话nodeCtnNo与nodeDate缓存，并且跳过不渲染主体。
                    if(nodeSequence==nextNodeSequence&&i!=0) {
                        multi+="<p>箱号："+data[i].nodeCtnNo+"<br/>时间："+data[i].nodeDate+"</p>";
                        continue;
                    }
                     multi+="<p>箱号："+data[i].nodeCtnNo+"<br/>时间："+data[i].nodeDate+"</p>";
                    Handlebars.registerPartial('multi', multi);
                    item = options.fn(data[i], {
                        data: {
                            hasSon:false
                        }
                    });
                    multi=""    
                }
                html+=item;
            }
            return html;
        })
        J.Template.render("#node-content", "node-bl-templ", data);
    }

})

App.page('delivery', function(){
    this.init = function(){
        _switchEvent("#delivery", "#delivery-result?type=", null, ["请输入完整箱号(不区分大小写)","请输入完整提单号(不区分大小写)"]);
       _checkRequired("#delivery", ".delivery-search");
       _refresh("#delivery");
    }
})

App.page('delivery-result', function(){
    var value, type, query
    this.init = function(){
        $("#delivery-result").on('pagehide',function(e,isBack){
            if(isBack) {
                $("#delivery-content").empty();
            }
        });  
    }
    this.load = function(){
        J.showMask();
        value = $("#delivery-ipt").val();
        query = $("#delivery-result").data("query");
        type = J.FindParm(query, "type");
        _getDelivery();
    }
    
    var _getDelivery = function(){
        FindData.getDelivery(type, value, function(data) {
            J.hideMask();
            if(data.flag==1) {
                _success(data)
            } else {
                _error(data)
            }
            J.Scroll("#delivery-scroll");
        })
    }
    
    var _success = function(data) {
        if(!data["list"].length) {
            J.Toast.show("info", "没有相关记录!");
            return false; 
        }
        Handlebars.registerHelper("list", function(data,options){
            var html = "";
            for(var i=0; i<data.length; i++) {
                var item = "";
                var matou = data[i].matou;
                var receivetime = data[i].receivetime;
                var ifcsumFlag = !!(data[i].ifcsumFlag=="Y");
                var matouFlag = !!(data[i].matouFlag=="Y");
                var customFlag = !!(data[i].customFlag=="Y");
                var sldFlag = !!(data[i].sldFlag=="Y");
                var sendEnable = !!(data[i].sendEnable=="Y");
                var sendFlag = !!(data[i].sendFlag=="Y");
                var pass = "";
                
                var passFlag = data[i].passFlag;
                switch(passFlag) {
                    case "Y":
                       pass = "<p>"+matou+" : 已经放行<br/>"+receivetime+"</p>" 
                    break;
                    case "N":
                        pass = "<p class='err1'>"+matou+" : 不能放行<br/>"+receivetime+"</p>" 
                    break;
                    case "T":
                        pass = "<p class='err2'>"+matou+" : 取消放行<br/>"+receivetime+"</p>" 
                    break;    
                }
                Handlebars.registerPartial('passFlag', pass);
                item = options.fn(data[i],{
                    data:{
                        ifcsumFlag: ifcsumFlag,
                        matouFlag: matouFlag,
                        customFlag: customFlag,
                        sldFlag: sldFlag,
                        sendEnable: sendEnable,
                        sendFlag: sendFlag
                    }
                });
                html+=item;
            }
            return html;
        })
        J.Template.render("#delivery-content", "delivery-templ", data);
    }
    
    var _error = function(data) {
        if(data.flag==2) {
            J.Toast.show("error", "查询出错！"); 
        } else {
            J.Toast.show("error", "未知错误！");
        }
    }
})

App.page('clp', function(){
    this.init = function(){
        _switchEvent("#clp", "#clp-result?type=", null, ["请输入完整箱号(不区分大小写)","请输入完整装箱单编号(不区分大小写)"]);
       _checkRequired("#clp", ".clp-search", "请填写完整的箱号或者装箱单编号！");
       _refresh("#clp");
    }
});

App.page('clp-result', function(){
    var value, type, query
    this.init = function(){
       $("#clp-result").on('pagehide',function(e,isBack){
            if(isBack) {
                $("#clp-content").empty();
            }
       });
    }
    
    this.load = function(){
        J.showMask();
        value = $("#clp-ipt").val();
        query = $("#clp-result").data("query");
        type = J.FindParm(query, "type");
        _getCLP();
    }
    
    var _getCLP = function(){
        FindData.getClp(type, value, function(data){
            if(!data["costcoMainDeo"]) {
                J.hideMask();
                J.Toast.show("info", "没有相关记录!");
                return false;
            }
            _success(data);
            J.Scroll("#clp-scroll");
            J.hideMask();
        })
    }
    var _success = function(data) {
        J.alert("温馨提示","装箱单发往: "+data.receiver);
        var total = 0;
        for(var i=0; i<data["costcoBlDeoList"].length;i++) {
            var grossWeight = parseInt(data["costcoBlDeoList"][i]["grossWeight"], 10)
            total+=grossWeight;
        }
        Handlebars.registerPartial('total', total+"");
        J.Template.render("#clp-content", "clp-templ", data);
    }
})

App.page('ctnRelease', function(){
    this.init = function(){
        _switchEvent("#ctnRelease", "#ctnRelease-result?type=", null, ["请输入完整提单号(不区分大小写)","请输入完整订舱号(不区分大小写)"]);
       _checkRequired("#ctnRelease", ".ctnRelease-search", "请填写完整的提单号或者订舱号！");
       _refresh("#ctnRelease", "请输入完整提单号(不区分大小写)");
    }
})

var ctnData = [];
App.page('ctnRelease-result', function(){
    var value, type, query, pageNum
    this.init = function(){
       $("#ctnRelease-result").on('pagehide',function(e,isBack){
            if(isBack) {
                ctnData = null;
                $("#ctnRelease-content").empty();
            }
       });
    }
    
    this.load = function(){
        J.showMask();
        pageNum = 1;
        value = $("#ctnRelease-ipt").val();
        query = $("#ctnRelease-result").data("query");
        type = J.FindParm(query, "type");
        _getPage();
    }
    var _getPage = function(scroll){
        FindData.getCtn(type, value, pageNum, function(data){
            Handlebars.registerHelper("list", function(data,options){
                var html = "", len = $("#ctnRelease-content").find(".result-list").length;
                for(var i=0; i<data.length; i++) {
                    var item = "";
                    var statusTmp = "";
                    var index = len?len+i+1:i+1;
                    var status = data[i]["status"];
                    switch(status) {
                        case "B":
                          statusTmp = "<span>已订舱</span>";
                        break;
                        case "R":
                          statusTmp = "<span>已放箱</span>";
                        break;
                        case "N":
                          statusTmp = "<span>已拒绝</span>";
                        break;
                        case "P":
                          statusTmp = "<span>已打印</span>";
                        break;
                        case "T":
                          statusTmp = "<span>已领取</span>";
                        break;
                        case "C":
                          statusTmp = "<span>已提箱</span>";
                        break;   
                    }
                    Handlebars.registerPartial('status', statusTmp);
                    item = options.fn(data[i], {
                        data:{
                            index: index,
                            ctnindex: index-1
                        }
                    })
                    html+=item;
                }
                return html;
            }) 
            if(pageNum == 1){
                _renderFirstPage(data);
            }else{
                _renderNextPage(scroll, data);
            }
            J.Scroll("#ctnRelease-scroll");
            var timer3 = null;
            J.Refresh("#ctnRelease-scroll", "pullUp", function(){
                var scroll = this;
                pageNum++;
                clearTimeout(timer3);
                timer3 = setTimeout(function(){_getPage(scroll)},500);
            })
        });
    }
    var _renderFirstPage = function(data) {
        if(!data["list"].length) {
            J.hideMask();
            J.Toast.show("info","没有找到任何数据！");
            return false;
        }
        ctnData = data["list"];
        J.Template.render("#ctnRelease-content", "ctnRelease-templ", data);
        J.hideMask();
    }
    var _renderNextPage = function(scroll, data) {
        if(!data["list"].length) {
            J.Toast.show("info","已经是最后一页了！");
            pageNum--;
            return false;
        }
        ctnData = ctnData.concat(data["list"]);
        J.Template.render("#ctnRelease-content", "ctnRelease-templ", data, "add");
        scroll.refresh();
        J.showToast("获取成功","success");
    }
})

App.page('ctn-detail',function(){
    var id, query;
    this.init = function(){
        
        $("#ctn-detail").on('pagehide',function(e,isBack){
            if(isBack) {
                $("#ctn-detail-content").empty();
            }
        });
    }
    
    this.load = function(){
        query = $("#ctn-detail").data("query");
        id = J.FindParm(query, "id");
        _getDetail();
    }
    
    var _getDetail = function(){
        var data = ctnData[id];
        var bookingType = "-"
        switch(data.bookingType) {
            case "S":
                bookingType = "船公司订舱";
            break;
            case "A":
                bookingType = "船代订舱";
        }
        Handlebars.registerPartial('bookingType', bookingType);
        J.Template.render("#ctn-detail-content", "ctn-detail-templ", data);
    }
})

App.page('ctn-info',function(){
    var id, query, newData={};
    this.init = function(){
        
        $("#ctn-info").on('pagehide',function(e,isBack){
            if(isBack) {
                $("#ctn-info-content").empty();                
            }
        });
    }
    
    this.load = function(){
        J.showMask();
        query = $("#ctn-info").data("query");
        id = J.FindParm(query, "ctnRealseId");
        _getInfo();
       
    }
    
    var _getInfo = function(){
        FindData.getCtnInfo(id, function(data) {
            newData.list = data
            _getCtnInfo(newData);
             J.hideMask();
        });
    }
        
    
    var _getCtnInfo = function(data) {
        Handlebars.registerHelper("with", function(data,options){
            var html = "";
            for(var i=0;i<data.length;i++) {
                var item = "";
                var ctnRelease = "";
                var ctnTake = ""
                var ctnReleaseFlag = data[i]["ctnReleaseFlag"];
                var ctnTakeFlag = data[i]["ctnTakeFlag"];
                switch(ctnReleaseFlag) {
                    case "Y":
                        ctnRelease = "<span class='s1'>已放箱</span>";
                    break;
                    case "R":
                        ctnRelease = "<span class='s2'>已拒绝</span>";
                    break;
                    default:
                        ctnRelease = "<span class='s3'>未放箱</span>"; 
                }
                if(ctnTakeFlag=="Y") {
                    ctnTake = "<span class='s1'>已提箱</span>"
                } else {
                    ctnTake = "<span class='s2'>未提箱</span>"
                }
                Handlebars.registerPartial('ctnReleaseFlag', ctnRelease);
                Handlebars.registerPartial('ctnTakeFlag', ctnTake);
                item = options.fn(data[i]);
                html+=item
            }
            return html;
        });
        J.Template.render("#ctn-info-content", "ctn-info-templ", data);
        J.Scroll("#ctn-info-scroll");
        
    }
});

App.page("GPS-result", function(){
    var gpsMap, truckLis, newData={}; 
    this.load = function(){
        J.showMask();
        truckLis = $("#truckLis").val(); 
        _getTruck() 
    }
    
    var _getTruck = function(){
        FindData.getTruck(truckLis, function(data) {
        gpsMap = new BMap.Map("gps-map");   
        var point = new BMap.Point(121.676167,29.889518); 
        gpsMap.centerAndZoom(point, 15);
        gpsMap.addControl(new BMap.ZoomControl());
            function _customBlock(center, div, rotate) {
                this.center = center;
                this.div = div;
                this.rotate = rotate;
            
            }
            
            //继承百度地图的Overlay类
            _customBlock.prototype = new BMap.Overlay();
            
            /* 初始化标注
             * @map {Object} 百度地图
             * @return {Object} 将创建的div返回，给map操作 
             * */
            _customBlock.prototype.initialize = function(gpsMap) {
                    this.map = gpsMap;
                    this.map.getPanes().floatPane.appendChild(this.div);
                    //$(this.div).rotateScale({angle: -this.rotate})
                    return this.div;    
            }
            
            //绘制
            _customBlock.prototype.draw = function() {
                var position = this.map.pointToOverlayPixel(this.center);    
                this.div.style.left = position.x-12 + "px";    
                this.div.style.top = position.y-15 + "px";
                this.div.style.WebkitTransform = "rotate("+ (this.rotate-45) +"deg)";
                this.div.style.Transform = "rotate("+ (this.rotate-45) +"deg)"
            }
            newData["truckInfo"] = data;
            if($(".truck-block").length) {
                $(".truck-block").remove();
            }
            J.hideMask();
            if(data.truckLicense) {
                var div = document.createElement("div");
                div.className = "truck-block";
                div.innerHTML = "<i class='ybticon gpsarrow'></i>"
                gpsMap.centerAndZoom(new BMap.Point(data.longitude, data.latitude), 15);
                var block = new _customBlock(new BMap.Point(data.longitude, data.latitude), div, data.direction);
                gpsMap.addOverlay(block);
                J.Template.render("#truck-info", "gps-tmepl", newData);
            } else {
                J.showToast('没有对应的车辆GPS信息！','info');
            }
            
        })
    }

});

App.page('yard-select', function(){
    var newYardData = {};
    this.init = function(){
        J.showMask();
        _initYard();
        _select("#yard-select-list", "#yard-text")
    }
    var _initYard = function(){
        FindData.getYardSelect("1", function(data) {
            newYardData.yard = data
            J.Template.render("#yard-select-list", "yard-select-templ", newYardData, "add");
            J.Scroll("#yard-select-scroll")
            J.hideMask();
        })
    }
})

App.page('typeSize-select', function(){
    var newTypeSizeData = {};
    this.init = function(){
        J.showMask();
        _initTypeSize();
        _select("#typeSize-select-list", "#typeSize-text")
    }
    var _initTypeSize = function(){
        FindData.getTypeSizeSelect("1", function(data) {
            newTypeSizeData.typeSize = eval(data)
            J.Template.render("#typeSize-select-list", "typeSize-select-templ", newTypeSizeData, "add");
            J.Scroll("#typeSize-select-scroll")
            J.hideMask();
        })
    }
})

var yardData = [];
App.page('yard-result', function(){
    var yardMap, ctnOwner, yardCode, ctnSizeType;
    this.init = function(){
        $("#yard-result").on('pagehide',function(e,isBack){
            if(isBack) {
                yardData = null;
                $("#yard-list").empty();
                $(".yard-block").remove();
            }
        });
    }
    
    this.load = function(){
        J.showMask();
        ctnOwner = $("#ctn-owner").val();
        yardCode = $("#yard-text").data("value");
        ctnSizeType = $("#typeSize-text").data("value");
        _getYard();
    }
    
    var _getYard = function(){
        FindData.getYard(ctnOwner, yardCode, ctnSizeType, function(data){
            yardData = data["list"];
            $("#yard-title").find(".yard-no").text(yardData.length)
            J.Template.render("#yard-list", "yard-list-templ", data);
            J.Scroll("#yard-list-srcoll");
            J.hideMask();
            
            yardMap = new BMap.Map("yard-map");   
            var point = new BMap.Point(108.898747,36.125237); 
            yardMap.centerAndZoom(point, 5);
            yardMap.addControl(new BMap.ZoomControl());
            function _yardBlock(center, div, info) {
                this.center = center;
                this.div = div;
                this.info = info;
            }
            
            //继承百度地图的Overlay类
            _yardBlock.prototype = new BMap.Overlay();
            
            /* 初始化标注
             * @map {Object} 百度地图
             * @return {Object} 将创建的div返回，给map操作 
             * */
            _yardBlock.prototype.initialize = function(yardMap) {
                    var _this = this;
                    this.map = yardMap;
                    this.map.getPanes().floatPane.appendChild(this.div);
                    $(div).tap(function(){
                        $(this).siblings().removeClass("yard-active").end().addClass("yard-active");
                        J.Template.render("#yard-bottom-info", "yard-bottom-info-templ", _this.info);
                    })
                    return this.div;    
            }
            
            //绘制
            _yardBlock.prototype.draw = function() {
                var position = this.map.pointToOverlayPixel(this.center);    
                this.div.style.left = position.x-31 + "px";    
                this.div.style.top = position.y-12 + "px";
            }
            for(var i=0;i<yardData.length;i++) {
                var location = yardData[i]["location"];
                var ctnNum = yardData[i]["ctnNum"];
                var sum = 0;
                var info = {};
                for(var j=0;j<ctnNum.length;j++) {
                    sum+=(+ctnNum[j][1])
                }
                info.name = yardData[i]["name"];
                info.num = sum;
                info.id = i; 
                var div = document.createElement("div");
                div.className = "yard-block";
                div.innerHTML = sum
                var block = new _yardBlock(new BMap.Point(location.split(",")[0], location.split(",")[1]), div, info);
                yardMap.addOverlay(block);
            }
        })
    }
    
})

App.page('yard-detail', function(){
    var query, id, detailData = {};
    this.init = function(){
        $("#yard-detail").on('pagehide',function(e,isBack){
            if(isBack) {
                $("#yard-name-detail").text("获取中...");
                $("#ctn-num-detail").text(0);
                $("#goto-map").attr("href","###");
                $("#yard-detail-content").empty();
                detailData = {};
            }
        });
    }
    
    this.load = function(){
        J.showMask();
        query = $("#yard-detail").data("query");
        id = J.FindParm(query, "id");
        _getYardDetail();
    }
    var _newCtn = function(arr) {
        
        for(var i=0;i<arr.length-1;i++) {
            for(var j=0;j<arr.length-1-i;j++) {
                if(arr[j][2]>arr[j+1][2]) {
                    var tmp = arr[j];
                    arr[j]=arr[j+1];
                    arr[j+1]=tmp;
                }
            }
        }
        
        var newArr = [
            {
                name:arr[0][2],
                ctnList:[{
                    typesize:arr[0][0],
                    num:arr[0][1]
                }]
            }
        ];
        var index = 0;
        for(var i=1;i<arr.length;i++) {
            if(arr[i][2]!=newArr[index]["name"]) {
                newArr.push({
                    "name":arr[i][2],
                    "ctnList":[{
                        typesize:arr[i][0],
                        num:arr[i][1]
                    }]
                });
                index++;
            } else {
                newArr[index]["ctnList"].push({typesize:arr[i][0],num:arr[i][1]})
            }
        }
        
        return newArr;
    }
    var _getYardDetail = function(){
        var newCtnNum = {}
        var sum = 0;
        var data = yardData[id];
        var ctnNum = data["ctnNum"];
        newCtnNum.ctn = _newCtn(ctnNum);
        detailData.yard = data;
        J.hideMask();
        for(var i=0;i<ctnNum.length;i++) {
            sum+=(+ctnNum[i][1]);
        }
        $("#yard-name-detail").text(detailData["yard"]["name"]);
        $("#ctn-num-detail").text(sum);
        $("#goto-map").attr("href","#map-detail?location="+detailData["yard"]["location"]);
        J.Template.render("#yard-detail-content", "yard-ctn-templ", newCtnNum, "add");
    }
    
})

App.page('map-detail', function(){
    var query, location, yardAddMap;
    this.init = function(){
        query = $("#map-detail").data("query");
        location = J.FindParm(query, "location");
        yardAddMap = new BMap.Map("alone-map");   
        var point = new BMap.Point(location.split(",")[0],location.split(",")[1]); 
        yardAddMap.centerAndZoom(point, 15);
        yardAddMap.addControl(new BMap.ZoomControl());
        var marker = new BMap.Marker(new BMap.Point(location.split(",")[0],location.split(",")[1]));  // 创建标注
        yardAddMap.addOverlay(marker);
    }
})

var shipData = [];
App.page('ship-GPS', function(){
    var yardMap;
    this.init = function(){
        $("#ship-GPS").on('pagehide',function(e,isBack){
            if(isBack) {
                shipData = null;
                $("#ship-list").empty();
                $(".yard-block").remove();
            }
        });
    }
    
    this.load = function(){
        J.showMask();
        _getShip();
    }
    
    var _getShip = function(){
        FindData.getShip(function(data){
            shipData = data;
            $("#ship-title").find(".ship-no").text(shipData.length)
            J.Template.render("#ship-list", "ship-list-templ", data);
            J.Scroll("#ship-list-srcoll");
            J.hideMask();
            
            shipMap = new BMap.Map("ship-map");   
            var point = new BMap.Point(121.748031,30.011185); 
            shipMap.centerAndZoom(point, 12);
            shipMap.addControl(new BMap.ZoomControl());
            function _shipBlock(center, div, info) {
                this.center = center;
                this.div = div;
                this.info = info;
            }
            
            //继承百度地图的Overlay类
            _shipBlock.prototype = new BMap.Overlay();
            
            /* 初始化标注
             * @map {Object} 百度地图
             * @return {Object} 将创建的div返回，给map操作 
             * */
            _shipBlock.prototype.initialize = function(yardMap) {
                    var _this = this;
                    this.map = yardMap;
                    this.map.getPanes().floatPane.appendChild(this.div);
                    $(div).tap(function(){
                        $(this).siblings().removeClass("ship-active").end().addClass("ship-active");
                        J.Template.render("#ship-bottom-info", "ship-bottom-info-templ", _this.info);
                    })
                    return this.div;    
            }
            
            //绘制
            _shipBlock.prototype.draw = function() {
                var position = this.map.pointToOverlayPixel(this.center);    
                this.div.style.left = position.x-12 + "px";    
                this.div.style.top = position.y-31 + "px";
            }
            for(var i=0;i<shipData.length;i++) {
                var info = {};
                info.name = shipData[i]["vslname"];
                info.ename = shipData[i]["vslename"]; 
                info.id = i;
                var div = document.createElement("div");
                div.className = "ship-block";
                var block = new _shipBlock(new BMap.Point(shipData[i]["vsl_X"], shipData[i]["vsl_Y"]), div, info);
                shipMap.addOverlay(block);
            }
        })
    }
    
})

App.page('ship-detail', function(){
    var query, id;
    this.init = function(){
        $("#ship-detail").on('pagehide',function(e,isBack){
            if(isBack) {
                $("#ship-name-detail").text("获取中...");
                $("#ship-ename").text("获取中...");
                $("#goto-shipmap").attr("href","###");
                $("#ship-detail-content").empty();
                detailData = {};
            }
        });
    }
    
    this.load = function(){
        J.showMask();
        query = $("#ship-detail").data("query");
        id = J.FindParm(query, "id");
        _getYardDetail();
    }
    var _getYardDetail = function(){
        var data = shipData[id];
        J.hideMask();
        $("#ship-name-detail").text(data["vslname"]);
        $("#ship-ename").text(data["vslename"]);
        $("#goto-shipmap").attr("href","#map-detail?location="+data["vsl_X"]+","+data["vsl_Y"]);
        J.Template.render("#ship-detail-content", "ship-templ", data);
    }
    
})
App.page('book-data' , function(){
    var dingyueContent = "";
    this.init = function(){
        $(".book-data-checkbox").on("tap", ".checkbox", function(){
            $(this).toggleClass("cb-cur");
        });
        $("#all").on("tap", function(){
            if($(this).is(":checked")) {
                $(".checkbox").addClass("cb-cur");
            } else {
                $(".checkbox").removeClass("cb-cur");
            }
        })
        $("#book").tap(function(){
            var billNo = $("#billNo").val()
                ,mobilNo = $("#mobilNo").val()
            $(".book-data-checkbox").find(".checkbox").each(function(){
                if($(this).hasClass("cb-cur")) {
                    dingyueContent+=1;
                } else {
                    dingyueContent+=0;
                }
            })
            _book(billNo, mobilNo, dingyueContent);  
        })
    }
    var _book = function(billNo, mobilNo, dingyueContent) {
        FindData.postBook(billNo, mobilNo, dingyueContent, function(data) {
            switch(data.flag) {
                case 1:
                    J.Toast.show("success","新增成功");
                break;
                case 2:
                    J.Toast.show("success","更新成功");
                break; 
                case 3: 
                    J.Toast.show("error","服务器异常")  
                break;
            }
        })
    }
})
App.run();

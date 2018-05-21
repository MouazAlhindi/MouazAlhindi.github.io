// GLOBAL VARIABLES
var xhr = new XMLHttpRequest();
var currentURL = document.URL;
const defaultRoute = 'home';
var currentPage = '';
var previousPage = '';
var forwardPage = '';
// var currentParams;

// Cache Logic
var htmlCache = [];
/*
example cache object
{
    path: ""
    data: ""
}
*/

function checkCache(target){
    var found = false;
    htmlCache.forEach(function(cacheObject){
        if(cacheObject.path ==  target){
            found = true;
        }
    });
    return found;

}

function addCache(url, html){
    if(!checkCache(url)){
        var cacheObject = {path: url, data: html};
        htmlCache.push(cacheObject);
    }    
}

function getCacheData(target){
    var data;
    htmlCache.forEach(function(cacheObject){
        if(cacheObject.path == target){
            data = cacheObject.data;
        }
    })
    return data;
}

var router = [
    {   
        name:"home", 
        paths: [
            "templates/components/navbar.html",
            "templates/views/home.html",
            "templates/components/footer.html"
        ]
    },
    {
        name:"projects", 
        paths: [
            "templates/components/navbar.html",
            "templates/views/projects.html",
            "templates/components/footer.html"
        ]
    },
    {   
        name:"biography", 
        paths: [
            "templates/components/navbar.html",
            "templates/views/biography.html",
            "templates/views/education.html",
            "templates/views/hobbies.html",
            "templates/components/footer.html"
        ]
    },
    {
        name: "credentials",
        paths: [
            "templates/components/navbar.html",
            "templates/views/credentials.html",
            "templates/views/skills.html",
            "templates/views/experience.html",
            "templates/components/footer.html"
        ]
    }
]

// returns main div in index.html
function getApp(){
    return document.getElementById('app');
}

// loads html based on path
function loadHtml(href) {
    var requestBool = checkCache(href);

    var httpResponse;

    if(requestBool){
        httpResponse = getCacheData(href);
    } else {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", href, false);
        xmlhttp.send();
        httpResponse = xmlhttp.responseText;
        addCache(href, httpResponse);
    }
    return httpResponse;
}

function loadData(href) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET" ,href , false);
    xmlhttp.send();
    return JSON.parse(xmlhttp.response)
}

function getQueryParams(){
    var location = document.location.href;
    var paramList = location.split('?');
    if(paramList.length > 1 && paramList.length == 2){
        return getParamObject(paramList);
    } else {
        currentPage = defaultRoute;
    }
}

function getParamObject(list){
    var paramObj = { };
    list.forEach(function(item){
        var param = item.split('=');
        var key = param[0];
        var val = param[1];
        paramObj[key] = val;
    });
    return paramObj;
}

function loadRequest(){
    getApp().innerHTML = loadHtml('templates/components/navbar.html');    
}

function addEventToRouters(){
    routerItems = document.querySelectorAll('#router');
    routerItems.forEach(function(item){
        item.addEventListener('click', route);
        var childrenItems = Array.from(item.children)
        childrenItems.forEach(function(childItem){
            childItem.setAttribute('page', item.getAttribute('page'))
            childItem.addEventListener('click', route);
        });    
    });
}

function route(page){
    var pageTarget = page.target.getAttribute('page');
    if(pageTarget != currentPage){
        router.forEach(function(routeObj){
            if(routeObj.name == pageTarget){
                loadPage(routeObj);
            }
        })    
    }
}

function loadPage(req){
    var html = "";
    req.paths.forEach(function(path){
        html += loadHtml(path);
    })
    currentPage = req.name;
    setupPage(html, req.name);
}

function addPageParamToURL(page){
    var qs = '/?page=' + page;
    // var newHref = window.location.origin += qs;
    // document.location.href = newHref;

    var stateObj = {page: page}
    var state = page;
    window.history.pushState(stateObj, state, qs);
}

function setupPage(html, pageName){
    getApp().innerHTML = html;
    addEventToRouters();
    setupCollapsible();
    addPageParamToURL(pageName);
    document.title = "Mouaz Alhindi | " + capFirstLetter(pageName);
    currentNavPage();
}

function capFirstLetter(word){
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function determineRoute(){
    var params = getQueryParams();
    if (params && params.page != currentPage){
        var routeTo = params.page;
        router.forEach(function(route){
            if(route.name == routeTo){
                loadPage(route);
            }
        })
    } else {
        loadPage(router[0]);
    }
}

function setupHistoryPage(html, pageName){
    getApp().innerHTML = html;
    addEventToRouters();
    setupCollapsible();
    document.title = "Mouaz Alhindi | " + pageName
}

function loadHistoryPage(req){
    var html = "";
    req.paths.forEach(function(path){
        html += loadHtml(path);
    })
    currentPage = req.name;
    setupHistoryPage(html, req.name);
    currentNavPage();
}

function determineHistoryChange(){
    var params = getQueryParams();
    if (params && params.page != currentPage){
        var routeTo = params.page;
        router.forEach(function(route){
            if(route.name == routeTo){
                loadHistoryPage(route);
            }
        })
    } else {
        loadHistoryPage(router[0]);
    }
}

function currentNavPage(){
    var navItemList = Array.from(document.getElementsByClassName('nav-item'));
    navItemList.forEach(function(navItem){
        var classList = navItem.classList;
        if(classList.contains('nav-item') && navItem.getAttribute('page') == currentPage){
            navItem.classList.add('selected-nav-item');
        } else {
            navItem.classList.remove('selected-nav-item');
        }
    })

}

// window.onhashchange = function(){
//     determineRoute();
// }

// event listener on window on load
window.onload = function(){
    determineRoute();
}

window.onpopstate = function(){
    determineHistoryChange();
}

// Sub Section Logic \\


// Card open and close
function setupCollapsible(){
    var collapsibleElements = Array.from(document.getElementsByClassName('collapsible'));
    var triggerElements = [];

    collapsibleElements.map(function(element){
        Array.from(element.children).map(function(child){
            if(child.classList.contains('collapsible-trigger')){
                triggerElements.push(child);
            }
        })
    })

    triggerElements.forEach(function(target){
        target.addEventListener('click', function(){
            var content = this.nextElementSibling;
            if(content.classList.contains("collapsible-target")){
                toggleContentDisplay(content);
            }
        });
    })
}

function toggleContentDisplay(targetElement){
    if(targetElement.style.display == ""){
        targetElement.style.display = "none";
        targetElement.parentElement.style.minWidth = "fit-content";
        // targetElement.style.left = "-10000px"
    } else {
        targetElement.style.display = "";
        targetElement.parentElement.style.minWidth = "800px";
        // targetElement.style.left = "0"
    }
}

// NEW FEATURE
// PROJECT: PERSONA.JS

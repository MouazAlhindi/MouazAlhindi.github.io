// GLOBAL VARIABLES

var xhr = new XMLHttpRequest();
var currentURL = document.URL;
const defaultRoute = 'home';
var currentPage = '';
var previousPage = '';
var forwardPage = '';
// var currentParams;

var router = [
    {   
        name:"home", 
        paths: [
            "templates/components/navbar.html",
            "templates/views/home.html"
        ]
    },
    {
        name:"projects", 
        paths: [
            "templates/components/navbar.html",
            "templates/views/projects.html"
        ]
    },
    {   
        name:"education", 
        paths: [
            "templates/components/navbar.html",
            "templates/views/education.html"
        ]
    },
    {   
        name:"hobbies", 
        paths: [
            "templates/components/navbar.html",
            "templates/views/hobbies.html"
        ]
    },
    {   
        name:"aboutme", 
        paths: [
            "templates/components/navbar.html",
            "templates/views/aboutme.html"
        ]
    },
]

// returns main div in index.html
function getApp(){
    return document.getElementById('app');
}

// loads html based on path
function loadHtml(href) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false);
    xmlhttp.send();
    return xmlhttp.responseText;
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
    addPageParamToURL(pageName);
    document.title = "Mouaz Alhindi | " + pageName
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

window.onhashchange = function(){
    determineRoute();
}

// event listener on window on load
window.onload = function(){
    determineRoute();
}

window.onpopstate = function(){
    determineRoute();
}


// NEW FEATURE
// PROJECT: PERSONA.JS

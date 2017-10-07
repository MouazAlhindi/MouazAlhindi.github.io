$(document).ready(function(){
    
    /* The following code is the router function. 
    --------------------------------------------*/
    function router($route_on){
      var routers = $($route_on + '[data-function="router"]');
  
      routers.each(function(){
  
        var $this = $(this);
        var links  = $this.find('a');
        var route = $this.attr('data-route');
  
        links.each(function(){
          var link = $(this);
          link.attr('data-route',route);
  
          var route_url = $(this).attr('href');
  
          if("[data-route="+route+"]"){
            link.attr('href',route+'/'+route_url)
            link.attr('text-route' +'/'+route_url)
          }
  
        });
      });
    }
    
    
    
    
    
    
    /* Deployment
    -------------------------------------------*/
    
    router('');
    
    // router() = return nothing;
    // router('') => [data-function="router"];
    // router('div') => div[data-function="router"];
    // router('section') => section[data-function="router"];
  
  })
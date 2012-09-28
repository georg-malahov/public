// (c) 2011 @miketaylr, Opera Software
// MIT license

function FilePreview() {
  var dir = document.getElementById('dir'),
      folders = document.querySelectorAll('li.folder'),
      img = document.querySelector('#container img'),
      imgs = document.querySelectorAll('.photo > a'),
      h2 = document.getElementById('note'),
      msg = document.getElementById('message'), note,
  
  self = {
    preloadImages: function(){
      for (var i = 0, l = imgs.length; i < l; i++){
        var k = new Image();
        k.src = imgs[i].textContent;
      }
    },
    
    bindEvents: function(){
      window.addEventListener('popstate', function(e){
       // be nice to Chrome, the spec changed
       // and they haven't caught up yet
       // http://code.google.com/p/chromium/issues/detail?id=63040
       if (history.state){
         self.loadImage(e.state.path, e.state.note);
       }
      }, false);
      
      dir.addEventListener('click', function(e){
        e.preventDefault();
        var f = e.target;
        
        if (f.parentNode.classList.contains('folder')) {
          self.toggleFolders(f);
        } 
        
        else if (f.parentNode.classList.contains('photo')){
          //be nice to FF 4 & 5, as they don't have .dataset yet
          //https://bugzilla.mozilla.org/show_bug.cgi?id=560112
          note = f.dataset ? f.dataset.note : f.getAttribute('data-note');
          
          self.loadImage(f.textContent, note);
          history.pushState({note: note, path:f.textContent}, '', f.href);
        }
      }, false);
    },
    
    toggleFolders: function(el){
      el.parentNode.classList.toggle('closed');
      el.parentNode.classList.toggle('open');
    },
    
    loadImage: function(path, note){
        img.src = path;
        h2.textContent = note;
    },
    
    featureDetect: function(){
      var html5history = !!(history.pushState && history.state !== undefined),
          classList = 'classList' in document.createElement('i');

      if (!(html5history && classList)) {
        msg.className = '';
      };
    },
    
    parseURL: function(pathname, link){
      if (!~location.toString().indexOf('viewer.html')){
        //change t to 6
        pathname = location.pathname.split('/6/')[1];
        link = document.querySelector('[href='+ pathname.replace('.html', '') +'\\.html]');
        self.toggleFolders(link.parentNode.parentNode);
      }
    },
    
    init: function(){
      self.featureDetect();
      self.parseURL();
      setTimeout(self.preloadImages, 4);
      self.bindEvents();
    }
  };
  
  return self.init();
  
};

var fp = new FilePreview();
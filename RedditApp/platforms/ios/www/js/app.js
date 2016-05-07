(function() {
var app = angular.module('app', ['ionic','angularMoment']);

app.controller('RedditCtrl', function($scope, $http){

  $scope.posts = [];


  function loadPosts(params, callback) {
    $http.get('https://www.reddit.com/r/all/.json', {params:params})
    .success(function(response){
        var posts = [];
        angular.forEach(response.data.children, function(child) {
          var post = child.data;
          if(!post.thumbnail || post.thumbnail === 'self' || post.thumbnail === 'default'){
            post.thumbnail = 'https://www.redditstatic.com/icon.png';
          }
          posts.push(child.data);
      });
    callback(posts);
   });   
  }

  $scope.loadOlderPosts = function() {
    var params = {};
    if ($scope.posts.length > 0) {
      params['after'] = $scope.posts[$scope.posts.length - 1].name;
    }
    loadPosts(params, function(olderPosts){
      $scope.posts = $scope.posts.concat(olderPosts);
      $scope.$broadcast('scroll.infiniteScrollComplete');        
    });
  };

  $scope.loadNewerPosts = function() {
    var params = {'before': $scope.posts[0].name};
    loadPosts(params, function(newerPosts){
      $scope.posts = newerPosts.concat($scope.posts);
      $scope.$broadcast('scroll.refreshComplete');
    })
  };

  $scope.openLink = function(url){
    window.open(url, '_blank');
  };
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
   if(window.cordova && window.cordova.InAppBrowser) {
      window.open = window.cordova.InAppBrowser.open;
   }
  });
})
}());
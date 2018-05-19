angular.module('getlancerApp.Portfolio', [
    'ngResource',
    'ngSanitize',
    'satellizer',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'ui.router',
    'angular-growl',
    'google.places',
    'angular.filter',
    'ngCookies',
    'angular-md5',
    'ui.select2',
    'http-auth-interceptor',
    'angulartics',
    'pascalprecht.translate',
    'angulartics.google.analytics',
    'tmh.dynamicLocale',
    'ngFileUpload',
    'infinite-scroll',
    'ngTagsInput',
    'angularMoment',
    'bc.Flickity',
    'afkl.lazyImage',
    'angular-loading-bar',
    'ngAnimate',
    '720kb.socialshare',
    'oitozero.ngSweetAlert',
    'ngMessages',
    'slugifier'
  ])
    .constant('PortfolioConstant', {
        "ClassName": "Portfolio",
        "ImagePath": "images/",
        "Myportfolios": "my_portfolios",
        "Myfollowing": "my_followings",
        "StatePortfolios": "portfolios",
        "StatePortfoliosType": "myportfolios",
        "StatePortfolioView": "portfolio_view",
        "StatePortfolioTags": "search_portfoliotags",
        "StatePortfolioProfile": "Portfolio_Userprofile"
    })
    .config(function($stateProvider, $urlRouterProvider, PortfolioConstant) {
        var getToken = {
            'TokenServiceData': function(TokenService, $q) {
                return $q.all({
                    AuthServiceData: TokenService.promise,
                    SettingServiceData: TokenService.promiseSettings
                });
            }
        };
        $urlRouterProvider.otherwise('/');
        $stateProvider.state(PortfolioConstant.StatePortfolios, {
                url: '/portfolios?skills',
                templateUrl: 'scripts/plugins/Portfolio/Portfolio/views/default/portfolioshome.html',
                controller: 'PortfoliosController',
                resolve: getToken
            })
            .state(PortfolioConstant.StatePortfoliosType, {
                url: '/portfolios/:type',
                templateUrl: 'scripts/plugins/Portfolio/Portfolio/views/default/portfolioshome.html',
                controller: 'PortfoliosController',
                resolve: getToken
            })
            .state(PortfolioConstant.StatePortfolioProfile, {
                url: '/portfolios/profile/:id',
                templateUrl: 'scripts/plugins/Portfolio/Portfolio/views/default/profile.html',
                controller: 'PortfoliosController',
                resolve: getToken
            })
            .state(PortfolioConstant.StatePortfolioView, {
                url: '/portfolios/:id/:slug',
                templateUrl: 'scripts/plugins/Portfolio/Portfolio/views/default/photo.html',
                controller: 'PortfoliosViewController',
                resolve: getToken
            })
            .state(PortfolioConstant.StatePortfolioTags, {
                url: '/portfolios/skill/:id/:slug',
                templateUrl: 'scripts/plugins/Portfolio/Portfolio/views/default/portfolioshome.html',
                controller: 'PortfoliosController',
                resolve: getToken
            });
    })
    .filter('dateformat', function($filter) {
        return function(input, format) {
            return $filter('date')(new Date(input), format);
        };
    })
    .filter('unsafe', function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    })
    .filter('words', function() {
        function isInteger(x) {
            return x % 1 === 0;
        }
        return function(value) {
            if (value && isInteger(value)) return toWords(value);
            return value;
        };
    })
    .directive('portfolioHomeBlock', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'scripts/plugins/Portfolio/Portfolio/views/default/portfolio_home_block.html',
            controller: function($scope, $rootScope, $window, $filter, $state, $stateParams, $timeout, PortfoliosFactory, HelperFactory, $uibModal, md5, flash, Slug) {
                var params = {};
                params.limit = 8;
                $scope.photos = [];
                /* [ Set Alert Message ] */
                function alertMessage(message, type) {
                    flash.set($filter("translate")(message), type, false);
                }
                /* [ Create Slug ] */
                function createSlug(input) {
                    return Slug.slugify(input);
                }

                function getPortfolioData() {
                    if (angular.isDefined($stateParams.id)) {
                        params.user_id = $stateParams.id;
                        PortfoliosFactory.getbyId(params, function(response) {
                            /* [ Success Response ] */
                            if (angular.isDefined(response.data)) {
                                $scope.showview = false;
                                var temp_photos = [];
                                var i = 0;
                                angular.forEach(response.data, function(photo) {
                                    i++;
                                    photo.photos_url = HelperFactory.Portfoliodefaultimage();
                                    if (angular.isDefined(photo.attachment) && photo.attachment !== null) {
                                        photo.photos_url = HelperFactory.generateimage('Portfolio', photo.id, 'medium_thumb');
                                    }
                                    if (angular.isDefined(photo.follower) && photo.follower.length > 0) {
                                        photo.is_favorite = true;
                                        angular.forEach(photo.follower, function(follower) {
                                            photo.like_id = follower.id;
                                        });
                                    } else {
                                        photo.is_favorite = false;
                                    }
                                    if (angular.isDefined(photo.flag) && photo.flag.length > 0) {
                                        photo.is_flag = true;
                                    } else {
                                        photo.is_flag = false;
                                    }
                                    temp_photos.push(photo);
                                    if (temp_photos.length === 4 || i === response.data.length) {
                                        $scope.photos.push(temp_photos);
                                        temp_photos = [];
                                    }
                                });
                            }
                        }, function() {
                            $scope.scroll_flag = true;
                        });
                    } else {
                        PortfoliosFactory.getall(params, function(response) {
                            $scope.showview = true;
                            /* [ Success Response ] */
                            if (angular.isDefined(response.data)) {
                                var temp_photos = [];
                                var i = 0;
                                angular.forEach(response.data, function(photo) {
                                    i++;
                                    photo.photos_url = HelperFactory.Portfoliodefaultimage();
                                    if (angular.isDefined(photo.attachment) && photo.attachment !== null) {
                                        photo.photos_url = HelperFactory.generateimage('Portfolio', photo.id, 'medium_thumb');
                                    }
                                    if (angular.isDefined(photo.follower) && photo.follower.length > 0) {
                                        photo.is_favorite = true;
                                        angular.forEach(photo.follower, function(follower) {
                                            photo.like_id = follower.id;
                                        });
                                    } else {
                                        photo.is_favorite = false;
                                    }
                                    if (angular.isDefined(photo.flag) && photo.flag.length > 0) {
                                        photo.is_flag = true;
                                    } else {
                                        photo.is_flag = false;
                                    }
                                    temp_photos.push(photo);
                                    if (temp_photos.length === 4 || i === response.data.length) {
                                        $scope.photos.push(temp_photos);
                                        temp_photos = [];
                                    }
                                });
                            }
                        }, function() {
                            $scope.scroll_flag = true;
                        });
                    }
                }
                getPortfolioData();
                /*  portfolios list ---- END  */
                $scope.openPhotoModal = function(id, title, index, size, key) {
                    var redirectto = {
                        statename: $state.current.name,
                        params: ($state.params.slug) ? $state.params.slug : $state.params.type
                    };
                    $scope.modalInstance = $uibModal.open({
                        templateUrl: 'scripts/plugins/Portfolio/Portfolio/views/default/modal_photo_view.html',
                        animation: false,
                        controller: function($scope, $rootScope, photoid, photoindex, photoKey, photos, follow, redirect, $stateParams, $filter, md5, $location, $uibModalStack, SweetAlert, $uibModal, $state, photoStatsFactory, userSettings, $timeout, HelperFactory) {
                            $scope.data = {
                                prev_key: -1,
                                prev_index: -1,
                                prev_id: -1,
                                current_key: -1,
                                current_index: -1,
                                current_id: -1,
                                next_key: -1,
                                next_index: -1,
                                next_id: -1
                            };
                            $scope.viewphotos = [];
                            $scope.flag = {};
                            $scope.taglabel = [];

                            function portfolioModelLoad() {
                                params.id = $scope.photo_id = photoid;
                                $scope.index = photoindex;
                                $scope.photoKey = photoKey;
                                $scope.photos = photos;
                                $scope.follow = follow;
                                $scope.redirect = redirect;
                                $scope.loadPhoto();
                                $scope.indexOfRowContainingId();
                                $state.go('portfolio_view', {
                                    slug: createSlug(title),
                                    id: params.id
                                }, {
                                    notify: false,
                                });
                            }
                            $scope.loadPhoto = function() {
                                if ($scope.photos[$scope.photoKey][$scope.index].id === parseInt(params.id)) {
                                    $scope.viewphotos = $scope.photos[$scope.photoKey][$scope.index];
                                    $scope.viewphotos.username = $scope.photos[$scope.photoKey][$scope.index].user.username;
                                    $scope.photoView($scope.viewphotos.id);
                                    $scope.viewphotos.user_avatar_url = HelperFactory.userdefaultimage();
                                    if (angular.isDefined($scope.viewphotos.user.attachment) && $scope.viewphotos.user.attachment !== null) {
                                        $scope.viewphotos.user_avatar_url = HelperFactory.generateimage('UserAvatar', $scope.viewphotos.user.id, 'small_thumb');
                                    }
                                    delete $scope.viewphotos.photo_url;
                                    $scope.viewphotos.photo_url = HelperFactory.generateimage('Portfolio', $scope.viewphotos.id, 'large_thumb');
                                } else {
                                    PortfoliosFactory.get(params, function(response) {
                                        $scope.photos[$scope.photoKey][$scope.index] = response.data;
                                        $scope.viewphotos = response.data;
                                        $scope.photoView($scope.viewphotos.id);
                                    });
                                }
                            };
                            //photo view update
                            $scope.photoView = function(photo_id) {
                                params.id = photo_id;
                                params.type = 'view';
                                PortfoliosFactory.getbyId(params, function(response) {
                                    $scope.Count();
                                });
                            }
                            $scope.scrollPhoto = function(id, index) {
                                $uibModalStack.dismissAll();
                                $location.path('/discover/' + id + '/' + index);
                            };
                            $scope.indexOfRowContainingId = function() {
                                $scope.data = {
                                    prev_key: -1,
                                    prev_index: -1,
                                    prev_id: -1,
                                    current_key: -1,
                                    current_index: -1,
                                    current_id: -1,
                                    next_key: -1,
                                    next_index: -1,
                                    next_id: -1
                                };
                                for (var i = 0, len = $scope.photos.length; i < len; i++) {
                                    for (var j = 0, len2 = $scope.photos[i].length; j < len2; j++) {
                                        if ($scope.photos[i][j].id === $scope.photo_id) {
                                            $scope.data.current_key = i;
                                            $scope.data.current_index = j;
                                            $scope.data.current_id = $scope.photos[i][j].id;
                                        } else {
                                            if ($scope.data.current_key === -1) {
                                                $scope.data.prev_key = i;
                                                $scope.data.prev_index = j;
                                                $scope.data.prev_id = $scope.photos[i][j].id;
                                            } else {
                                                $scope.data.next_key = i;
                                                $scope.data.next_index = j;
                                                $scope.data.next_id = $scope.photos[i][j].id;
                                                return;
                                            }
                                        }
                                    }
                                }
                                return;
                            };
                            //Next and Previous Function 
                            $scope.slide_change = function(option) {
                                if (option === 'next') {
                                    $scope.photo_id = $scope.data.next_id;
                                }
                                if (option === 'prev') {
                                    $scope.photo_id = $scope.data.prev_id;
                                }
                                $scope.indexOfRowContainingId();
                                if ($scope.data.current_id !== -1) {
                                    $scope.index = parseInt($scope.data.current_index);
                                    $scope.photoKey = parseInt($scope.data.current_key);
                                    $scope.photo_id = parseInt($scope.data.current_id);
                                    if (angular.isDefined($scope.photos[$scope.photoKey][$scope.index])) {
                                        params.id = $scope.photos[$scope.photoKey][$scope.index].id;
                                        params.slug = $scope.photos[$scope.photoKey][$scope.index].title;
                                        $state.go('portfolio_view', {
                                            slug: createSlug(params.slug),
                                            id: params.id
                                        }, {
                                            notify: false,
                                            location: 'replace'
                                        });
                                        var myEl = angular.element(document.querySelector('img'));
                                        myEl.attr('src', '//:0');
                                        $timeout(function() {
                                            $scope.loadPhoto();
                                        }, 100);
                                    }
                                }
                            };
                            /* [ Close the Popup model ] */
                            $rootScope.closemodel = function() {
                                $uibModalStack.dismissAll();
                                $state.go('home', {}, {
                                    notify: false
                                });
                            };
                            //login function
                            $scope.Login_func = function() {
                                $uibModalStack.dismissAll();
                                $location.path('/users/login');
                            };
                            //Like and Comment Count
                            $scope.Count = function() {
                                var params = {};
                                params.id = $scope.photos[$scope.photoKey][$scope.index].id;
                                PortfoliosFactory.getbyId(params, function(response) {
                                    var comment = response.data;
                                    $scope.viewphotos.follower_count = comment.follower_count;
                                    $scope.viewphotos.message_count = comment.message_count;
                                    $scope.viewphotos.view_count = comment.view_count;
                                });
                            };
                            portfolioModelLoad();
                        },
                        size: size,
                        backdrop: 'static',
                        windowClass: "js-photo-view",
                        resolve: {
                            photoid: function() {
                                return id;
                            },
                            photoindex: function() {
                                return index;
                            },
                            photoKey: function() {
                                return key;
                            },
                            follow: function() {
                                return $scope.follow;
                            },
                            photos: function() {
                                return $scope.photos;
                            },
                            redirect: function() {
                                return redirectto;
                            }
                        }
                    });
                };
                /* [ Edit Portfolio - Can edit by posted user only --- Begins] */
                $scope.editPortfolio = function(title, size, portfolio_id) {
                    /* [ Checks the user_id and login in auth user id ] */
                    if ($rootScope.user !== null && $rootScope.user !== undefined) {
                        // setRootHeader(title);
                        $scope.editPortfolioModel = $uibModal.open({
                            animation: false,
                            templateUrl: 'scripts/plugins/Portfolio/Portfolio/views/default/portfolio.html',
                            controller: function($scope, $rootScope, $location, $window, PortfoliosFactory, flash, $filter, HelperFactory, Upload, portfolioId, userId, PortfolioSkillsFactory) {
                                /* [ Get Portfolios Data ] */
                                function getPortfolioById(params) {
                                    PortfoliosFactory.getbyId(params, function(response) {
                                        if (response.error.code === 0) {
                                            $scope.portfolio = response.data;
                                            $scope.tags = [];
                                            angular.forEach($scope.portfolio.portfolios_skill, function(tag) {
                                                $scope.tags.push({
                                                    'text': tag.skill.name
                                                });
                                            });
                                        }
                                    });
                                }
                                //autocomplete tag input  
                                $scope.loadTags = function(query) {
                                    return PortfolioSkillsFactory.getall({
                                            q: query,
                                            fields: 'name',
                                            limit: 'all'
                                        })
                                        .$promise.then(function(response) {
                                            if (angular.isDefined(response.data) && response.data.length > 0) {
                                                $scope.newEntry = [];
                                                angular.forEach(response.data, function(tag) {
                                                    $scope.newEntry.push({
                                                        'text': tag.name
                                                    });
                                                });
                                            }
                                            return $scope.newEntry;
                                        });
                                };
                                $scope.portfoliopage = 1;
                                $scope.newImage = null;
                                params.id = portfolioId;
                                getPortfolioById(params);
                                /* [ Upload Image store the data in $scope.image ] */
                                $scope.uploadPortfolioImage = function(file) {
                                    Upload.upload({
                                            url: '/api/v1/attachments?class=Portfolio',
                                            data: {
                                                file: file
                                            }
                                        })
                                        .then(function(response) {
                                            if (response.data.error.code === 0) {
                                                $scope.newImage = response.data.attachment;
                                            }
                                        });
                                }
                                /* [ Form Submit - Edit Portfolio ] */
                                $scope.portfolio_submit = function(is_valid) {
                                    if (is_valid === true) {
                                        var pdata = {};
                                        if ($scope.newImage !== null) {
                                            pdata.image = $scope.newImage;
                                        }
                                        pdata.id = portfolioId;
                                        pdata.title = $scope.portfolio.title;
                                        pdata.description = $scope.portfolio.description;
                                        var value = [];
                                        angular.forEach($scope.tags, function(tag) {
                                            value.push(tag.text);
                                            pdata.skills = value.join();
                                        });
                                        PortfoliosFactory.update(pdata, function(response) {
                                            if (response.error.code === 0) {
                                                alertMessage("Portfolio updated successfully.", 'success');
                                                /* [ Closed the Popup with already defined function ] */
                                                $state.go('user_profile', {}, {
                                                    reload: true
                                                });
                                            } else {
                                                alertMessage("Please try again", 'error');
                                            }
                                        });
                                    }
                                }
                            },
                            size: size,
                            backdrop: 'static',
                            windowClass: "js-photo-view",
                            resolve: {
                                portfolioId: function() {
                                    return portfolio_id;
                                },
                                userId: function() {
                                    return $rootScope.user.id;
                                }
                            }
                        });
                    }
                }
                /* [ Edit Portfolio - Can edit by posted user only --- Ends] */
                /* [ Delete Portfolio - Can delte by posted user only --- Begins] */
                $scope.deletePortfolio = function(portfolio_id) {
                    /* [ Checks the user_id and login in auth user id ] */
                    if ($rootScope.user !== null && $rootScope.user !== undefined) {
                        SweetAlert.swal({
                            title: $filter("translate")("Are you sure you want to delete?"),
                            text: "",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "OK",
                            cancelButtonText: "Cancel",
                            closeOnConfirm: true,
                            animation:false,
                        }, function(isConfirm) {
                            if (isConfirm) {
                                var params = {};
                                params.id = portfolio_id;
                                /* [ Delete the portfolio Data ]  */
                                PortfoliosFactory.delete(params, function(response) {
                                    if (response.error.code === 0) {
                                        /* [ Redirects to portfolios page ] */
                                        alertMessage("Portfolio deleted successfully.", "success");
                                        /* [ Closed the Popup with already defined function ] */
                                        $state.go('user_profile', {}, {
                                            reload: true
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        $state.go('user_profile');
                    }
                }
                /* [ Delete Portfolio - Can delte by posted user only --- Ends] */
            }
        }
    });
var th = ['', 'thousand', 'million', 'billion', 'trillion'];
var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function toWords(s) {
    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s)) return 'not a number';
    var x = s.indexOf('.');
    if (x == -1) x = s.length;
    if (x > 15) return 'too big';
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
            if (n[i] == '1') {
                str += tn[Number(n[i + 1])] + ' ';
                i++;
                sk = 1;
            } else if (n[i] != 0) {
                str += tw[n[i] - 2] + ' ';
                sk = 1;
            }
        } else if (n[i] != 0) {
            str += dg[n[i]] + ' ';
            if ((x - i) % 3 == 0) str += 'hundred ';
            sk = 1;
        }
        if ((x - i) % 3 == 1) {
            if (sk) str += th[(x - i - 1) / 3] + ' ';
            sk = 0;
        }
    }
    if (x != s.length) {
        var y = s.length;
        str += 'point ';
        for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
    }
    return str.replace(/\s+/g, ' ');
}
window.toWords = toWords;
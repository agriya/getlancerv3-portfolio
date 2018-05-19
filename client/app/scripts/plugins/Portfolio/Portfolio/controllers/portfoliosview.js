'use strict';
/**
 * @ngdoc function
 * @name Portfolios.controller:PortfoliosViewController
 * @description
 * #PortfoliosViewController
 * Controller of the Portfolios
 */
angular.module('getlancerApp.Portfolio')
    .controller('PortfoliosViewController', ['$scope', '$rootScope', '$location', '$window', '$filter', '$state', '$stateParams', 'md5', 'flash', '$uibModal', 'PortfoliosFactory', '$uibModalStack', 'HelperFactory', 'PortfolioConstant', 'Slug', function($scope, $rootScope, $location, $window, $filter, $state, $stateParams, md5, flash, $uibModal, PortfoliosFactory, $uibModalStack, HelperFactory, PortfolioConstant, Slug) {
        /* [ Function to set Page Header ] */
        function setRootHeader(pagename) {
            $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")(pagename);
        }
        /* [ Create Slug ] */
        function createSlug(input) {
            return Slug.slugify(input);
        }
        /* [ Set Alert Message ] */
        function alertMessage(message, type) {
            flash.set($filter("translate")(message), type, false);
        }
         $scope.closeInstance = function() {
            $uibModalStack.dismissAll();
        };
        $scope.init = function() {
            $scope.getphoto();
            $scope.follow = [];
        };
        $scope.getphoto = function() {
            var params = {};
            params.id = $stateParams.id;
            PortfoliosFactory.getbyId(params, function(response) {
                if (angular.isDefined(response.data)) {
                    /* [ Success Response] */
                    $scope.photo = response.data;
                    $scope.photo.user_avatar_url = HelperFactory.userdefaultimage();
                    $scope.photo.photos_url = HelperFactory.generateimage('Portfolio', $scope.photo.attachment.foreign_id, 'extra_large_thumb');
                    if (angular.isDefined($scope.photo.user.attachment) && $scope.photo.user.attachment !== null) {
                        $scope.photo.user_avatar_url = HelperFactory.generateimage('UserAvatar', $scope.photo.user.attachment.foreign_id, 'small_thumb');
                    }
                    if (angular.isDefined($scope.photo.follower) && $scope.photo.follower.length > 0) {
                        $scope.photo.is_favorite = true;
                        angular.forEach($scope.photo.follower, function(follower) {
                            $scope.photo.like_id = follower.id;
                        });
                    } else {
                        $scope.photo.is_favorite = false;
                    }
                    if (angular.isDefined($scope.photo.flag) && $scope.photo.flag.length > 0) {
                        $scope.photo.is_flag = true;
                    } else {
                        $scope.photo.is_flag = false;
                    }
                } else {
                    /* [ error Response ] */
                    $scope.closemodel();
                }
            });
        };
        //modal closing fucntion
        $scope.ModelCancel = function() {
            $uibModalStack.dismissAll();
            $location.path($scope.redirect);
        };
        //login function
        $scope.Login_func = function() {
            $uibModalStack.dismissAll();
            $location.path('/users/login');
        };
        //Like and Comment Count
        $scope.Count = function() {
            var params = {};
            params.id = $scope.photo.id;
            PortfoliosFactory.getbyId(params, function(response) {
                var comment = response.data;
                $scope.photo.follower_count = comment.follower_count;
                $scope.photo.message_count = comment.message_count;
            });
        };
        $scope.init();
    }]);
'use strict';
/**
 * @ngdoc function
 * @name Portfolios.controller:PortfoliosDashboardController
 * @description
 * # PortfoliosDashboardController
 * Controller of the Portfolios
 */
angular.module('getlancerApp.Portfolio')
    .controller('PortfoliosDashboardController', ['$scope', '$rootScope', '$location', '$window', '$filter', '$state', 'md5', 'PortfoliosFactory', 'flash', '$uibModal', '$uibModalStack', 'HelperFactory', 'SweetAlert', 'Upload', '$stateParams', 'PortfolioConstant', 'PortfolioSkillsFactory', 'Slug', 'PortfolioAutocompleteUsers', 'ConstUserRole', 'mePortfoliosFactory', function($scope, $rootScope, $location, $window, $filter, $state, md5, PortfoliosFactory, flash, $uibModal, $uibModalStack, HelperFactory, SweetAlert, Upload, $stateParams, PortfolioConstant, PortfolioSkillsFactory, Slug, PortfolioAutocompleteUsers, ConstUserRole, mePortfoliosFactory) {
        /* [ Function to set Page Header ] */
        function setRootHeader(pagename) {
            $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate") ("My Portfolios");
        }
        /* [ Create Slug ] */
        function createSlug(input) {
            return Slug.slugify(input);
        }
        /* [ On load close all the models ] */
        $uibModalStack.dismissAll();
        /* [ Generate Image ] */
        $rootScope.cimage = function(foreign_id, thumb, classname) {
            return HelperFactory.generateimage(classname, foreign_id, thumb);
        }
        /* [ Close the Popup model ] */
        $rootScope.closemodel = function(gotopage) {
            $uibModalStack.dismissAll();
                $state.go('user_dashboard', {
                    type: 'portfolios',
                    status: 'my_portfolios'
                }, {
                    notify: false
                });
            // setRootHeader('Portfolios');
            // if (gotopage !== undefined && gotopage !== null) {
            //     if (gotopage.statename === PortfolioConstant.StatePortfolios) {
            //         $state.go(gotopage.statename, {}, {
            //             notify: false
            //         });
            //     } else if (gotopage.statename === PortfolioConstant.StatePortfoliosType) {
            //         $state.go(gotopage.statename, {
            //             type: gotopage.params
            //         }, {
            //             notify: false
            //         });
            //     } else if (gotopage.statename === PortfolioConstant.StatePortfolioTags) {
            //         $state.go(gotopage.statename, {
            //             slug: gotopage.params
            //         }, {
            //             notify: false
            //         });
            //     } else {
            //         $state.go(PortfolioConstant.StatePortfolios);
            //     }
            // } else {
            //     $state.go(PortfolioConstant.StatePortfolios);
            // }
        }
        /* [ Set Alert Message ] */
        function alertMessage(message, type) {
            flash.set($filter("translate")(message), type, false);
        }
        /* [ Check Login type and user ] */
        function chkLoginParams(name) {
            var result = false;
            if ($stateParams.type !== undefined && $stateParams.type !== null && $stateParams.type === name && $rootScope.user !== null && $rootScope.user !== undefined) {
                result = true;
            }
            return result;
        }
        /* Loader */
        function statusBarShow() {
            $scope.norecodeShow = false;
            $('#search-loading-div')
                .attr('style', 'display:block');
            $('#loading')
                .attr('style', 'display:block');
            $('#search-result-div')
                .attr('style', 'display:none');
        }

        function statusBarHide() {
            $scope.norecodeShow = true;
            $('#search-loading-div')
                .attr('style', 'display:none');
            $('#loading')
                .attr('style', 'display:none');
            $('#search-result-div')
                .attr('style', 'display:block');
        }
        setRootHeader('Portfolios');
        /* [ On load Pre action for the portfolios list ---- Begin ] */
        var params = {};
        $scope.enabled = true;
        $scope.scroll_flag = true;
        $scope.photos = [];
        $scope.follow = [];
        $scope.currentpage = 1;
        $scope.lastpage = 2;
        $scope.loader = true;

        function getPortfolioData() {
            statusBarShow()
            params.sort = 'id';
            params.sortby = 'desc';
            params.limit = 12;
            params.q = $state.params.q;
            params.page = $scope.currentpage;
            $scope.NoRecordMessage = true;
            if ($stateParams.slug !== null && $stateParams.slug !== undefined) {
                params.skill = $stateParams.slug;
            } else if (chkLoginParams(PortfolioConstant.Myportfolios) === true) {
                $scope.NoRecordMessage = false;
                params.user_id = $rootScope.user.id;
            } else if (chkLoginParams(PortfolioConstant.Myfollowing) === true) {
                $scope.NoRecordMessage = false;
                params.filter = PortfolioConstant.Myfollowing;
            } else if (chkLoginParams(PortfolioConstant.StatePortfolioProfile) !== true) {
                params.user_id = $stateParams.id;
            }
            mePortfoliosFactory.get(params, function(response) {
                $scope.scroll_flag = true;
                if (angular.isDefined(response._metadata)) {
                    $scope.lastpage = response._metadata.last_page;
                    $scope.currentpage = response._metadata.current_page;
                }
                /* [ Success Response ] */
                if (angular.isDefined(response.data)) {
                    var temp_photos = [];
                    var i = 0;
                    angular.forEach(response.data, function(photo) {
                        i++;
                        photo.user_avatar_url = HelperFactory.userdefaultimage();
                        if (angular.isDefined(photo.user.attachment) && photo.user.attachment !== null) {
                            photo.user_avatar_url = HelperFactory.generateimage('UserAvatar', photo.user.id, 'small_thumb');
                        }
                        photo.photos_url = HelperFactory.generateimage('Portfolio', photo.id, 'medium_thumb');
                        if (angular.isDefined(photo.follower) && photo.follower.length > 0) {
                            photo.is_favorite = true;
                            angular.forEach(photo.follower, function(follower) {
                                photo.like_id = follower.id;
                            });
                        } else {
                            photo.is_favorite = false;
                        }
                        if (angular.isDefined(photo.user.user_follow) && photo.user.user_follow !== null) {
                            angular.forEach(photo.user.user_follow, function(follow) {
                                {
                                    $scope.follow[photo.user.id] = {
                                        follow_id: follow.id,
                                        isfollow: true
                                    };
                                }
                            });
                        } else {
                            $scope.follow[photo.user.id] = {
                                follow_id: 0,
                                isfollow: false
                            };
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
                $scope.loader = false;
                statusBarHide();
            }, function(error) {
                $scope.scroll_flag = true;
            });
			
        }
        getPortfolioData();
        /* [ On load Pre action for the portfolios list ---- Begin ] */
        /* [ Pagination Function --- Begin ] */
        $scope.loadMore = function() {
            $scope.currentpage += 1;
            getPortfolioData();
        };
        /* [ Pagination Function --- Ends ] */
        /* [ Portfolio Data Unlike Function --- Ends ] */
        $scope.go = function(photo_user_id, photo_user_username) {
            $location.path('profile/' + photo_user_id + '/' + photo_user_username);
        };
        /* [ Portfolio Open Photo Model Function --- Begins ] */
        $scope.openPhotoModal = function(id, title, index, size, key) {
            setRootHeader(title);
            var redirectto = {
                statename: $state.current.name,
                params: ($state.params.slug) ? $state.params.slug : $state.params.type
            };
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'scripts/plugins/Portfolio/Portfolio/views/default/modal_photo_view.html',
                animation: false,
                controller: function($scope, $rootScope, photoid, photoindex, photoKey, photos, follow, redirect, $stateParams, $filter, md5, $location, $uibModalStack, $uibModal, $state, photoStatsFactory, PortfoliosFactory, userSettings, $timeout, HelperFactory) {
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
                        $state.go(PortfolioConstant.StatePortfolioView, {
                            slug: createSlug(title),
                            id: params.id
                        }, {
                            notify: false,
                        });
                    };
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
                            PortfoliosFactory.getbyId(params, function(response) {
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
                                setRootHeader($scope.photos[$scope.photoKey][$scope.index].title);
                                params.id = $scope.photos[$scope.photoKey][$scope.index].id;
                                params.slug = createSlug($scope.photos[$scope.photoKey][$scope.index].title);
                                $state.go(PortfolioConstant.StatePortfolioView, {
                                    slug: params.slug,
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
                    //login function
                    $scope.Login_func = function() {
                        $uibModalStack.dismissAll();
                        $location.path('/users/login');
                    };
                    //Like and Comment Count
                    $scope.Count = function() {
                        var params = {};
                        params.id = $scope.photos[$scope.photoKey][$scope.index].id;
                        PortfoliosFactory.get(params, function(response) {
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
        /* [ Portfolio Open Photo Model Function --- Ends ] */
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
                                $state.go(PortfolioConstant.StatePortfolios, {}, {
                                    reload: true
                                });
                            }
                        });
                    }
                });
            } else {
                $state.go(PortfolioConstant.StatePortfolios);
            }
        }
        /* [ Delete Portfolio - Can delte by posted user only --- Ends] */
        /* [ Edit Portfolio - Can edit by posted user only --- Begins] */
        $scope.editPortfolio = function(title, size, portfolio_id) {
            /* [ Checks the user_id and login in auth user id ] */
            if ($rootScope.user !== null && $rootScope.user !== undefined) {
                setRootHeader(title);
                $scope.editPortfolioModel = $uibModal.open({
                    animation: false,
                    templateUrl: 'scripts/plugins/Portfolio/Portfolio/views/default/portfolio.html',
                    controller: function($scope, $rootScope, $location, $window, PortfoliosFactory, flash, $filter, HelperFactory, Upload, portfolioId, userId, PortfolioSkillsFactory, usertypeId, ConstUserRole, PortfolioAutocompleteUsers) {
                        /* [ Get Portfolios Data ] */
						var selectedUser = [];
                        function getPortfolioById(params) {
							PortfoliosFactory.getbyId(params, function(response) {
                                if (response.error.code === 0) {
                                    $scope.portfolio = response.data;
									selectedUser = response.data.user_id;
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
                        $scope.save_btn = false;
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
						PortfolioAutocompleteUsers.get(function(response) {
							if (parseInt(response.error.code) === 0) {
								$scope.employerUser = [];
								$scope.employerUsers = response.data;
								$scope.portfolio.user_select = [];
								angular.forEach($scope.employerUsers, function(value) {
									$scope.employerUser.push({
										id: value.id,
										text: value.username
									});

									if (selectedUser !== "" && selectedUser.indexOf(value.id) != -1) {
											$scope.portfolio.user_select.push({
												id: value.id,
												text: value.username
											});
										}
									});
								} else {
									console.log('User Error');
								}
							}, function(error) {
								console.log('Users Error', error);
						});
						$scope.portfolioloadEmployers = function(qstr) {
							qstr = qstr.toLowerCase();
							var items = [];
							angular.forEach($scope.employerUser, function(value) {
								name = value.text.toLowerCase();
								if (name.indexOf(qstr) >= 0) {
									items.push({
										id: value.id,
										text: value.text
									});
								}
							});
							return items;
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
                                $scope.save_btn = true;
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
								if (angular.isUndefined($scope.portfolio.user_select)) {
									  pdata.user_id = ConstUserRole.Admin;
								} else {
									pdata.user_id = $scope.portfolio.user_select;
								}
                                PortfoliosFactory.update(pdata, function(response) {
                                    if (response.error.code === 0) {
                                        alertMessage("Portfolio updated successfully.", 'success');
                                        /* [ Closed the Popup with already defined function ] */
                                        $state.go(PortfolioConstant.StatePortfolios, {}, {
                                            reload: true
                                        });
                                    } else {
                                        alertMessage("Please try again", 'error');
                                        $scope.save_btn = false;
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
						usertypeId: function() {
                            return $rootScope.user.role_id;
                        },
                        userId: function() {
                            return $rootScope.user.id;
                        }
                    }
                });
            }
        }
        /* [ Edit Portfolio - Can edit by posted user only --- Ends] */
        /* [ Add Portfolio - Can Add by login user only --- Begins] */
        $scope.addPortfolio = function(file, size) {
            function uploadImage(file) {
                            angular.element('#custom-upload').val(file.name);
                            Upload.upload({
                                    url: '/api/v1/attachments?class=Portfolio',
                                    data: {
                                        file: file
                                    }
                                })
                                .then(function(response) {
                                    if (response.data.error.code === 0) {
                                        $rootScope.newImage = response.data.attachment;
                                        $rootScope.error_message = '';
                                        } else {
                                            $rootScope.error_message = response.data.error.message;
                                        }
                                });
                        }
            /* [ Checks the user_id and login in auth user id ] */
            if ($rootScope.user !== null && $rootScope.user !== undefined) {
                setRootHeader('Add New Portfolio');
                $scope.addPortfolioModel = $uibModal.open({
                    animation: false,
                    templateUrl: 'scripts/plugins/Portfolio/Portfolio/views/default/portfolio.html',
                    controller: function($scope, $rootScope, $location, $window, PortfoliosFactory, flash, $filter, HelperFactory, userId, uploadfile, PortfolioSkillsFactory, ConstUserRole, PortfolioAutocompleteUsers, usertypeId) {
                        
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
						/* $scope.portfolioloadEmployers = function(query) {
                            return PortfolioAutocompleteUsers.get({
                                    q: query,
                                    fields: 'id',
							    })
                                .$promise.then(function(response) {
                                    if (angular.isDefined(response.data) && response.data.length > 0) {
                                        $scope.newUser = [];
                                        angular.forEach(response.data, function(tag) {
                                            $scope.newUser.push({
												'id': tag.id,
                                                'text': tag.username
                                            });
                                        });
                                    }
                                    return $scope.newUser;
                                });
                        };*/
						$scope.portfoliopage = 0;
                        $scope.file = uploadfile;
                        uploadImage(uploadfile);
                        /* [ Form Submit - Edit Portfolio ] */
                        $scope.portfolio_submit = function(is_valid) {
                            if (is_valid === true && !$rootScope.error_message) {
                                $scope.save_btn = true;
                                var pdata = {};
                                if ($rootScope.newImage !== null) {
                                    pdata.image = $rootScope.newImage;
                                }
                                pdata.title = $scope.portfolio.title;
                                pdata.description = $scope.portfolio.description;
                                var value = [];
                                angular.forEach($scope.tags, function(tag) {
                                    value.push(tag.text);
                                    pdata.skills = value.join();
                                });
								if (angular.isUndefined($scope.portfolio.user_id)) {
									  pdata.user_id = ConstUserRole.Admin;
								} else {
									pdata.user_id = $scope.portfolio.user_id;
								}
								PortfoliosFactory.create(pdata, function(response) {
                                    if (response.error.code === 0) {
                                        alertMessage("Portfolio added successfully.", 'success');
                                        /* [ Closed the Popup with already defined function ] */
                                        $state.go(PortfolioConstant.StatePortfolios, {}, {
                                            reload: true
                                        });
                                    } else {
                                        alertMessage("Please try again", 'error');
                                        $scope.save_btn = false;
                                    }
                                });
                            }
                        }
                    },
                    size: size,
                    backdrop: 'static',
                    windowClass: "js-photo-view",
                    resolve: {
                        userId: function() {
                            return $rootScope.user.id;
                        },
						usertypeId: function() {
                            return $rootScope.user.role_id;
                        },
                        uploadfile: function() {
                            return file;
                        }
                    }
                });
            }
        }
        /* [ Add Portfolio - Can Add by login user only --- Ends] */
    }]);
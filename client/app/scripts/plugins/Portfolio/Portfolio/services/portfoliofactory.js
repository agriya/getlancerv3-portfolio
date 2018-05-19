'use strict';
/**
 * @ngdoc service
 * @name Getlancerv3
 * @PortfolioFactory
 * # Customservices
 * Factory in the Getlancerv3.
 */
angular.module('getlancerApp.Portfolio')
    .factory('HelperFactory', function($rootScope, md5, $http, PortfolioConstant) {
        var data = {};
        var d = new Date();
        return {
            /* [ Get User default Image ] */
            userdefaultimage: function() {
                return PortfolioConstant.ImagePath + 'default.png?' + d.getTime();;
            },
            Portfoliodefaultimage: function() {
                return PortfolioConstant.ImagePath + 'no-image.png?' + d.getTime();;
            },
            /* [ Generate Image ] */
            generateimage: function(classname, foreign_id, thumb_type) {
                var hash = md5.createHash(classname + foreign_id + 'png' + thumb_type);
                return PortfolioConstant.ImagePath + thumb_type + '/' + classname + '/' + foreign_id + '.' + hash + '.png?' + d.getTime();
            },
            /* [ Datetime Format ] */
            getdatetime: function(value) {
                var nd = new Date(value);
                return nd.getFullYear() + '-' + (nd.getMonth() + parseInt(1)) + '-' + nd.getDate() + ' ' + nd.getHours() + ':' + nd.getMinutes() + ':00';
            },
            /* [ Date Format ] */
            getdate: function(value) {
                var nd = new Date(value);
                return nd.getFullYear() + '-' + (nd.getMonth() + parseInt(1)) + '-' + nd.getDate();
            },
            /* [ Time Format ] */
            gettime: function(value) {
                var nd = new Date(value);
                return nd.getHours() + ':' + nd.getMinutes() + ':00';
            },
            /* [ Check the value is int ] */
            checkint: function(x) {
                if (x % 1 !== 0) {
                    throw new TypeError(x + " is not an integer"); // throw an exception
                }
                return x;
            },
            /* [ $http call for PUT  ] */
            Update: function(url, reqdata) {
                return $http.put(url, reqdata);
            },
            /* [ $http call for POST  ] */
            Create: function(url, reqdata) {
                return $http.post(url, reqdata);
            },
            /* [ $http call for GET  ] */
            Get: function(url) {
                return $http.get(url);
            },
            /* [ $http call for GET  ] */
            GetbyId: function(url, id) {
                return $http.get(url + id);
            },
            /* [ $http call for DELETE  ] */
            Delete: function(url) {
                return $http.delete(url);
            }
        };
    })
    /* [ GET, PUT, DELETE Portfolios ] */
    .factory('PortfoliosFactory', ['$resource', function($resource) {
        return $resource('/api/v1/portfolios/:id', {}, {
            getbyId: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            },
            delete: {
                method: 'DELETE',
                params: {
                    id: '@id'
                }
            },
            getall: {
                method: 'GET'
            },
            create: {
                method: 'POST'
            },
            update: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            }
        });
    }])
    /* [ Gel all Portfolio Skills ] */
    .factory('PortfolioSkillsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/skills', {}, {
            getall: {
                method: 'GET'
            }
        });
    }])
    /* [ Search Portfolios Tag ] */
    .factory('SearchPhotoFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photo_tags/:photoTagId/photos', {}, {
            get: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            }
        });
    }])
    /* [ Upload Portfolio ] */
    .factory('PhotoUploadFactory', ['$resource', function($resource) {
        return $resource('/api/v1/portfolios', {}, {
            create: {
                method: 'POST'
            }
        });
    }])
    /* [ View Portfolio ] */
    .factory('photoStatsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/views', {}, {
            create: {
                method: 'POST',
            }
        });
    }])
     .factory('mePortfoliosFactory', ['$resource', function($resource) {
        return $resource('/api/v1/me/portfolios', {}, {
            get: {
                method: 'GET',
            }
        });
    }])
    /* [ User Settings ] */
    .factory('userSettings', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id', {}, {
            update: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            },
            get: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            },
            delete: {
                method: 'delete',
                params: {
                    id: '@id'
                }
            }
        });
    }])
	.factory('PortfolioAutocompleteUsers', ['$resource', function($resource) {
			return $resource('/api/v1/users?type=employer', {}, {
				get: {
					method: 'GET'
				}
			});
	  }]);
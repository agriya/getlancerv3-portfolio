'use strict';
/**
 * @ngdoc directive
 * @name instagramApp.directive:googleAnalytics
 * @description
 * # googleAnalytics
 */
angular.module('getlancerApp.Portfolio')
    .directive('customScroll', function() {
        return {
            restrict: 'A',
            link: function postLink(scope, iElement) {
                iElement.mCustomScrollbar({
                    autoHideScrollbar: false,
                    theme: "rounded-dark",
                    mouseWheel: {
                        scrollAmount: 188
                    },
                    autoExpandScrollbar: true,
                    snapAmount: 188,
                    snapOffset: 65,
                    advanced: {
                        updateOnImageLoad: true
                    },
                    keyboard: {
                        scrollType: "stepped"
                    },
                    scrollButtons: {
                        enable: true,
                        scrollType: "stepped"
                    }
                });
            }
        };
    })
     .directive('portfolioHomeSkills', function (PortfolioSkillsFactory) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'scripts/plugins/Portfolio/Portfolio/views/default/portfolio_home_skills.html',
            link: function postLink(scope, element, attrs) {
                var params = {
                    limit: 30,
                    sort: 'name',
                    sortby: 'DSC',
                    field: 'id,name,slug,description'
                };
                PortfolioSkillsFactory.get(params, function(response) {
                  scope.portfolio_skills = response.data;
                });
            }
        }
    })
        .directive('portfolioHome', function () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'scripts/plugins/Portfolio/Portfolio/views/default/portfolios_home_block.html',
            controller: 'PortfoliosHomeController'
        }
    })
    .directive('monthShow', function() {
        return {
            restrict: 'EA',
            replace: true,
            template: '<select class="form-control" ng-options="month.value as month.text for month in months"><option value="">Select Month</option></select>',
            link: function(scope, e, a) {
                scope.months = [];
                scope.months.push({
                    value: 1,
                    text: 'January'
                });
                scope.months.push({
                    value: 2,
                    text: 'February'
                });
                scope.months.push({
                    value: 3,
                    text: 'March'
                });
                scope.months.push({
                    value: 4,
                    text: 'April'
                });
                scope.months.push({
                    value: 5,
                    text: 'May'
                });
                scope.months.push({
                    value: 6,
                    text: 'June'
                });
                scope.months.push({
                    value: 7,
                    text: 'July'
                });
                scope.months.push({
                    value: 8,
                    text: 'August'
                });
                scope.months.push({
                    value: 9,
                    text: 'September'
                });
                scope.months.push({
                    value: 10,
                    text: 'October'
                });
                scope.months.push({
                    value: 11,
                    text: 'November'
                });
                scope.months.push({
                    value: 12,
                    text: 'December'
                });
            }
        }
    });
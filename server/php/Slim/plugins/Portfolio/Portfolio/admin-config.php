<?php
/**
 * Plugin
 *
 * PHP version 5
 *
 * @category   PHP
 * @package    GetlancerV3
 * @subpackage Core
 * @author     Agriya <info@agriya.com>
 * @copyright  2018 Agriya Infoway Private Ltd
 * @license    http://www.agriya.com/ Agriya Infoway Licence
 * @link       http://www.agriya.com
 */
$menus = array(
    'Portfolios' => array(
        'title' => 'Portfolios',
        'icon_template' => '<span class="fa fa-briefcase"></span>',
        'child_sub_menu' => array(
            'portfolios' => array(
                'title' => 'Portfolios',
                'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                'link' => '/portfolios/list?search={"filter":"all"}',
                'suborder' => 1
            ) ,
            'portfolio_views' => array(
                'title' => 'Portfolio Views',
                'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                'suborder' => 4
            )
        ) ,
        'order' => 8,
    ) ,
    'Master' => array(
        'title' => 'Master',
        'icon_template' => '<span class="glyphicon glyphicon-dashboard"></span>',
        'child_sub_menu' => array()
    )
);
$tables = array(
    'portfolios' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => '',
                    'label' => 'Image',
                    'template' => '<display-image entry="entry" thumb="normal_thumb" type="Portfolio"  entity="entity"></display-image>',
                ) ,
                2 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                3 => array(
                    'name' => 'title',
                    'label' => 'Title',
                ) ,
                4 => array(
                    'name' => 'description',
                    'label' => 'Description',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                ) ,
                5 => array(
                    'name' => 'follower_count',
                    'label' => 'Followers',
                    'template' => '<a href="#/portfolio_followers/list?search=%7B%22class%22:%22Portfolio%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.follower_count}}</a>',
                ) ,
                6 => array(
                    'name' => 'view_count',
                    'label' => 'Views',
                    'template' => '<a href="#/portfolio_views/list?search=%7B%22class%22:%22Portfolio%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.view_count}}</a>',
                ) ,
                7 => array(
                    'name' => 'flag_count',
                    'label' => 'Flags',
                    'template' => '<a href="#/portfolio_flags/list?search=%7B%22class%22:%22Portfolio%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.flag_count}}</a>',
                ) ,
                8 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Portfolios',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'edit',
                1 => 'show',
                2 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
                1 => '<batch-adminsuspend type="suspend" action="portfolios" selection="selection"></batch-adminsuspend>',
                2 => '<batch-adminunsuspend type="unsuspend" action="portfolios" selection="selection"></batch-adminunsuspend>'
            ) ,
            'filters' => array(
                0 => array(
                    'name' => 'q',
                    'pinned' => true,
                    'label' => 'Search',
                    'type' => 'template',
                    'template' => '',
                ) ,
                1 => array(
                    'name' => 'user_id',
                    'label' => 'User',
                    'targetEntity' => 'users',
                    'targetField' => 'username',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'reference',
                    'remoteComplete' => true,
                ) ,
                2 => array(
                    'name' => 'is_admin_suspend',
                    'type' => 'choice',
                    'label' => 'Admin Suspend?',
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter',
                2 => '<project-create entity="portfolio"></project-create>',
            ) ,
        ) ,
        'creationview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'user_id',
                    'label' => 'User',
                    'targetEntity' => 'users',
                    'targetField' => 'username',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'reference',
                    'remoteComplete' => true,
                ) ,
                1 => array(
                    'name' => 'description',
                    'label' => 'Description',
                    'type' => 'text',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
            ) ,
        ) ,
        'editionview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'user_id',
                    'label' => 'User',
                    'targetEntity' => 'users',
                    'targetField' => 'username',
                    'type' => 'reference',
                    'editable' => false,
                ) ,
                1 => array(
                    'name' => '',
                    'label' => 'Image',
                    'template' => '<display-image entry="entry" thumb="normal_thumb" type="Portfolio"  entity="entity"></display-image>',
                ) ,
                2 => array(
                    'name' => 'title',
                    'label' => 'Title',
                    'type' => 'string',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                3 => array(
                    'name' => 'description',
                    'label' => 'Description',
                    'type' => 'text',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
            ) ,
        ) ,
        'showview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => '',
                    'label' => 'Image',
                    'template' => '<display-image entry="entry" thumb="normal_thumb" type="Portfolio"  entity="entity"></display-image>',
                ) ,
                2 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                3 => array(
                    'name' => 'title',
                    'label' => 'Title',
                ) ,
                4 => array(
                    'name' => 'description',
                    'label' => 'Description'
                ) ,
                5 => array(
                    'name' => 'follower_count',
                    'label' => 'Followers',
                    'template' => '<a href="#/followers/list?search=%7B%22class%22:%22Portfolio%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.follower_count}}</a>',
                ) ,
                6 => array(
                    'name' => 'view_count',
                    'label' => 'Views',
                    'template' => '<a href="#/views/list?search=%7B%22class%22:%22Portfolio%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.view_count}}</a>',
                ) ,
                7 => array(
                    'name' => 'flag_count',
                    'label' => 'Flags',
                    'template' => '<a href="#/portfolio_flags/list?search=%7B%22class%22:%22Portfolio%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.flag_count}}</a>',
                ) ,
                8 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
        ) ,
    ) ,
    'portfolio_followers' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                2 => array(
                    'name' => 'foreign_follower.title',
                    'label' => 'Portfolio',
                ) ,
                3 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Portfolio Favorites',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'edit',
                1 => 'show',
                2 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter',
            ) ,
        ) ,
        'showview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                2 => array(
                    'name' => 'foreign_follower.title',
                    'label' => 'Portfolio',
                ) ,
                3 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
        ) ,
    ) ,
    'portfolio_flags' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                2 => array(
                    'name' => 'foreign_flag.title',
                    'label' => 'Portfolio',
                ) ,
                3 => array(
                    'name' => 'flag_category.name',
                    'label' => 'Category',
                ) ,
                4 => array(
                    'name' => 'message',
                    'label' => 'Message',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                ) ,
                5 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Portfolio Flags',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'show',
                1 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter',
            ) ,
        ) ,
        'showview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                2 => array(
                    'name' => 'foreign_flag.title',
                    'label' => 'Portfolio',
                ) ,
                3 => array(
                    'name' => 'flag_category.name',
                    'label' => 'Category',
                ) ,
                4 => array(
                    'name' => 'message',
                    'label' => 'Message',
                ) ,
                5 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
        ) ,
    ) ,
    'portfolio_views' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                ) ,
                1 => array(
                    'name' => 'foreign_view.title',
                    'label' => 'Portfolio',
                ) ,
                2 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                3 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Portfolio Views',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'delete'
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch'
            ) ,
        ) ,
    ) ,
    'portfolio_flag_categories' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'name',
                    'label' => 'Name',
                ) ,
                2 => array(
                    'name' => 'flag_count',
                    'template' => '<a href="#/portfolio_flags/list?search=%7B%22class%22:%22Portfolio%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.flag_count}}</a>',
                    'label' => 'Flags',
                ) ,
                3 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'boolean',
                ) ,
            ) ,
            'title' => 'Portfolio Flag Categories',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'edit',
                1 => 'show',
                2 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'filters' => array(
                0 => array(
                    'name' => 'q',
                    'pinned' => true,
                    'label' => 'Search',
                    'type' => 'template',
                    'template' => '',
                ) ,
                1 => array(
                    'name' => 'filter',
                    'type' => 'choice',
                    'label' => 'Active',
                    'choices' => array(
                        0 => array(
                            'label' => 'Active',
                            'value' => 'active',
                        ) ,
                        1 => array(
                            'label' => 'Inactive',
                            'value' => 'inactive',
                        ) ,
                    ) ,
                ) ,
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter',
                2 => 'create',
            ) ,
        ) ,
        'creationview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'name',
                    'label' => 'Name',
                    'type' => 'string',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                1 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'choice',
                    'defaultValue' => false,
                    'validation' => array(
                        'required' => true,
                    ) ,
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
            ) ,
            'prepare' => array(
                'class' => 'Portfolio'
            )
        ) ,
        'editionview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'name',
                    'label' => 'Name',
                    'type' => 'string',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                1 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'choice',
                    'defaultValue' => false,
                    'validation' => array(
                        'required' => true,
                    ) ,
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
            ) ,
            'prepare' => array(
                'class' => 'Portfolio'
            )
        ) ,
        'showview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'id',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'name',
                    'label' => 'Name',
                ) ,
                2 => array(
                    'name' => 'flag_count',
                    'template' => '<a href="#/portfolio_flags/list?search=%7B%22class%22:%22Portfolio%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.flag_count}}</a>',
                    'label' => 'Flags',
                ) ,
                3 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'boolean'
                ) ,
            ) ,
        ) ,
    ) ,
    'messages' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'foreign_id',
                    'label' => 'Portfolio',
                    'template' => '<display-image entry="entry" thumb="normal_thumb" type="Portfolio"  entity="entity"></display-image>'
                ) ,
                2 => array(
                    'name' => 'user.username',
                    'label' => 'Commented By'
                ) ,
                3 => array(
                    'name' => 'message_content.message',
                    'label' => 'Comment',
                ) ,
                4 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Comments',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'show',
                1 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
            ) ,
        ) ,
    ) ,
);
if (isPluginEnabled('Common/Message')) {
    $milestone_table = array(
        'portfolios' => array(
            'listview' => array(
                'fields' => array(
                    0 => array(
                        'name' => 'message_count',
                        'label' => 'Comments',
                        'template' => '<a href="#/messages/list?search=%7B%22class%22:%22Portfolio%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.message_count}}</a>',
                    )
                )
            )
        )
    );
    $tables = merge_details($tables, $milestone_table);
}
if (isPluginEnabled('Portfolio/PortfolioFollow')) {
    $portfolio_menu = array(
        'Portfolios' => array(
            'title' => 'Portfolios',
            'icon_template' => '<span class="fa fa-file-text-o"></span>',
            'child_sub_menu' => array(
                'portfolio_followers' => array(
                    'title' => 'Portfolio Favorites',
                    'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                    'suborder' => 3
                ) ,
            )
        )
    );
    $menus = merged_menus($menus, $portfolio_menu);
}
if (isPluginEnabled('Portfolio/PortfolioFlag')) {
    $portfolio_menu = array(
        'Portfolios' => array(
            'title' => 'Portfolios',
            'icon_template' => '<span class="fa fa-file-text-o"></span>',
            'child_sub_menu' => array(
                'portfolio_flags' => array(
                    'title' => 'Portfolio Flags',
                    'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                    'suborder' => 2
                )
            )
        )
    );
    $menus = merged_menus($menus, $portfolio_menu);
}
if (isPluginEnabled('Portfolio/PortfolioFlag')) {
    $portfolio_menu = array(
        'Master' => array(
            'title' => 'Master',
            'icon_template' => '<span class="glyphicon glyphicon-dashboard"></span>',
            'child_sub_menu' => array(
                'portfolio_flag_categories' => array(
                    'title' => 'Portfolio Flag Categories',
                    'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                    'suborder' => 31
                )
            )
        )
    );
    $menus = merged_menus($menus, $portfolio_menu);
}
if (isPluginEnabled('Common/Message')) {
    $portfolio_menu = array(
        'Portfolios' => array(
            'title' => 'Portfolios',
            'icon_template' => '<span class="fa fa-file-text-o"></span>',
            'child_sub_menu' => array(
                'messages' => array(
                    'title' => 'Comments',
                    'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                    'link' => '/messages/list?search={"class":"Portfolio"}',
                    'suborder' => 4
                )
            )
        )
    );
    $menus = merged_menus($menus, $portfolio_menu);
}

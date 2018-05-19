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
/**
 * GET portfoliosGet
 * Summary: Fetch all portfolios
 * Notes: Returns all portfolios from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/portfolios', '_getPortfolios');
/**
 * GET portfoliosGet
 * Summary: Fetch all portfolios
 * Notes: Returns all portfolios from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/me/portfolios', function ($request, $response, $args) {
    global $authUser;
    $result = array();
    $queryParams = $request->getQueryParams();
    try {
        $count = PAGE_LIMIT;
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }
        $enabledIncludes = array(
            'user',
            'attachment',
            'portfolios_skill'
        );
        $portfolio = Models\Portfolio::with($enabledIncludes)->where('user_id', $authUser['id'])->Filter($queryParams)->paginate($count)->toArray();
        if (!empty($portfolio)) {
            $data = $portfolio['data'];
            unset($portfolio['data']);
            $results = array(
                'data' => $data,
                '_metadata' => $portfolio
            );
            return renderWithJson($results);
        } else {
            return renderWithJson($result, 'No record found', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Your not have portfolio', '', 1);
    }
})->add(new ACL('canUserPortfolio'));
/**
 * DELETE portfolioIdDelete
 * Summary: Delete portfolio
 * Notes: Deletes a single portfolio based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/portfolios/{portfolioId}', function ($request, $response, $args) {
    global $authUser;
    $result = array();
    $portfolios = Models\Portfolio::find($request->getAttribute('portfolioId'));
    try {
        if (!empty($portfolios)) {
            if ($portfolios->delete()) {
                portfolioTabeCountUpdation('Portfolio', 'portfolio_count', 0, $portfolios->user_id);
                Models\SkillsPortfolios::where('portfolio_id', $portfolios->id)->delete();
                $result = array(
                    'status' => 'success',
                );
                return renderWithJson($result);
            } else {
                return renderWithJson($result, 'Portfolio could not be deleted. Access Denied.', '', 1);
            }
        } else {
            return renderWithJson($result, 'Portfolio could not be Found.', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Portfolio could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeletePortfolio'));
/**
 * GET portfoliosPortfolioIdGet
 * Summary: Fetch Portfolio
 * Notes: Returns a Portfolio based on a single ID
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/portfolios/{portfolioId}', '_getportfolios');
/**
 * PUT portfoliosPortfolioIdPut
 * Summary: Update Portfolio by its id
 * Notes: Update Portfolio by its id
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/portfolios/{portfolioId}', function ($request, $response, $args) {
    global $authUser;
    $args = $request->getParsedBody();
    $portfolios = Models\Portfolio::find($request->getAttribute('portfolioId'));
    $result = array();
    $portfolios->fill($args);
    try {
        $validationErrorFields = $portfolios->validate($args);
        if (empty($validationErrorFields)) {
            if ($authUser['role_id'] == \Constants\ConstUserTypes::Admin && !empty($args['user_id'])) {
                $portfolios->user_id = $args['user_id'];
            }
            if ($authUser['role_id'] != \Constants\ConstUserTypes::Admin) {
                unset($portfolios->is_admin_suspend);
            }
            if ($portfolios->save()) {
                portfolioTabeCountUpdation('Portfolio', 'portfolio_count', 0, $portfolios->user_id);
                // Updating #tag
                preg_match_all('/#([^\\s]*)/', $args['description'], $name_mentioned);                
                if (!empty($args['skills'])) {
                    Models\SkillsPortfolios::where('portfolio_id', $portfolios->id)->delete();   
                    $skills = explode(',', $args['skills']);
                    foreach ($skills as $skill) {
                        $newSkills = Models\Skill::where('name', $skill)->first();
                        if(empty($newSkills)) {
                            $newSkills = new Models\Skill;
                            $newSkills->name = $skill;
                            $newSkills->slug = Inflector::slug(strtolower($skill), '-');
                            $newSkills->save();
                        }
                        $skillsPortfolios = new Models\SkillsPortfolios;
                        $skillsPortfolios->skill_id = $newSkills->id ;
                        $skillsPortfolios->portfolio_id = $portfolios->id;
                        $skillsPortfolios->save();
                    }
                }
                $enabledIncludes = array(
                    'attachment'
                );
                $portfolios = Models\Portfolio::with($enabledIncludes)->find($portfolios->id);
                $result['data'] = $portfolios->toArray();
                return renderWithJson($result);
            } else {
                return renderWithJson($result, 'Portfolio could not be updated. Access Denied.', '', 1);
            }
        } else {
            return renderWithJson($result, 'Portfolio could not be updated. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Portfolio could not be updated. Please, try again.', '', 1);
    }
})->add(new ACL('canUpdatePortfolio'));
/**
 * POST portfoliosPost
 * Summary: Creates a new Portfolio
 * Notes: Creates a new Portfolio
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/portfolios', function ($request, $response, $args) {
    $args = $request->getParsedBody();
    global $authUser, $_server_domain_url;
    $portfolios = new Models\Portfolio($args);
    $result = array();
    if (!in_array($authUser->role_id, [\Constants\ConstUserTypes::User, \Constants\ConstUserTypes::Freelancer]) && $authUser->role_id != \Constants\ConstUserTypes::Admin) {
        return renderWithJson($result, 'Employer could not be added the portfolio.', '', 1);
    }
    try {
        $validationErrorFields = $portfolios->validate($args);
        //if (empty($validationErrorFields) && (!empty($args['image'])) && (file_exists(APP_PATH . '/media/tmp/' . $args['image']))) {
        if (empty($validationErrorFields)) {
            $portfolios->user_id = $authUser['id'];
            if ($authUser['role_id'] == \Constants\ConstUserTypes::Admin && !empty($args['user_id'])) {
                $portfolios->user_id = $args['user_id'];
            }
            if ($authUser['role_id'] != \Constants\ConstUserTypes::Admin) {
                unset($portfolios->is_admin_suspend);
            }
            $portfolios->save();
            portfolioTabeCountUpdation('Portfolio', 'portfolio_count', 0, $portfolios->user_id);
            if (!empty($args['description'])) {
                // Updating @mentioned
                preg_match_all('/@([^\\s]*)/', $args['description'], $name_mentioned);
                if (!empty($name_mentioned)) {
                    foreach ($name_mentioned[1] as $username) {
                        $username = trim($username);
                        //$user = Models\User::where('username', $username)->first();
                        /*if(!empty($user)) {
                            //Add activities
                            $activity = new Models\Activity;
                            $activity->owner_user_id = $userfollow['user_id'];
                            $activity->user_id = $portfolios->user_id;
                            $activity->type = 'Post';
                            $activity->foreign_id = $portfolios->id;
                            $activity->class = 'Portfolio';
                            $activity->is_read = 0;
                            $activity->save();
                            $activity->updateActivityCount($userfollow['user_id']);
                            $userNotification = Models\UserNotificationSetting::with('user')->where('user_id', $userfollow['user_id'])->first();                                    
                            if (!empty($userNotification) && $userNotification['is_enable_email_when_follow_post'] == 1) {
                                $user = Models\User::find($userfollow['user_id'])->toArray();                          
                                $to_mail = $user['email'];                            
                                $emailFindReplace = array(
                                    '##POSTUSER##' => $userNotification['user']['username'],
                                    '##USERNAME##' => $user['username'],
                                    '##POST##' => 'http://' . $_SERVER['HTTP_HOST'] . '/Portfolio/' . $portfolios->id,
                                    '##SUPPORT_EMAIL##' => SUPPORT_EMAIL
                                );
                                sendMail('Portfoliopost', $emailFindReplace, $to_mail);
                            }
                        }*/
                    }
                }
                if (!empty($args['skills'])) { 
                    $skills = explode(',', $args['skills']);
                    foreach ($skills as $skill) {
                        $newSkills = Models\Skill::where('name', $skill)->first();
                        if(empty($newSkills)) {
                            $newSkills = new Models\Skill;
                            $newSkills->name = $skill;
                            $newSkills->slug = Inflector::slug(strtolower($skill), '-');
                            $newSkills->save();
                        }
                        $skillsPortfolios = new Models\SkillsPortfolios;
                        $skillsPortfolios->skill_id = $newSkills->id ;
                        $skillsPortfolios->portfolio_id = $portfolios->id;
                        $skillsPortfolios->save();
                    }
                }
                if ((!empty($args['image'])) && (file_exists(APP_PATH . '/media/tmp/' . $args['image']))) {
                    $attachment = new Models\Attachment;
                    if (!file_exists(APP_PATH . '/media/Portfolio/' . $portfolios->id)) {
                        mkdir(APP_PATH . '/media/Portfolio/' . $portfolios->id, 0777, true);
                    }
                    // Removing Thumb folder images
                    $mediadir = APP_PATH . '/client/app/images/';
                    $whitelist = array(
                        '127.0.0.1',
                        '::1'
                    );
                    if (!in_array($_SERVER['REMOTE_ADDR'], $whitelist)) {
                        $mediadir = APP_PATH . '/client/images/';
                    }
                    foreach (THUMB_SIZES as $key => $value) {
                        $list = glob($mediadir . $key . '/' . 'Portfolio' . '/' . $portfolios->id . '.*');
                        if ($list) {
                            @unlink($list[0]);
                        }
                    }
                    $src = APP_PATH . '/media/tmp/' . $args['image'];
                    $dest = APP_PATH . '/media/Portfolio/' . $portfolios->id . '/' . $args['image'];
                    copy($src, $dest);
                    unlink($src);
                    list($width, $height) = getimagesize($dest);
                    $attachment->filename = $args['image'];
                    if (!empty($width)) {
                        $attachment->width = $width;
                        $attachment->height = $height;
                    }
                    $attachment->dir = 'Portfolio/' . $portfolios->id;
                    $attachment->foreign_id = $portfolios->id;
                    $attachment->class = 'Portfolio';
                    $attachment->save();
                }
                $enabledIncludes = array(
                    'attachment',
                    'portfolios_skill'
                );
                $portfolios = Models\Portfolio::with($enabledIncludes)->find($portfolios->id);
                $employerDetails = getUserHiddenFields($portfolios->user_id);                
                $emailFindReplace = array(
                    '##USERNAME##' => ucfirst($employerDetails->username) ,
                    '##FAV_USERNAME##' => ucfirst($employerDetails->username) ,
                    '##PORTFOLIO_NAME##' => $portfolios->title,
                    '##PORTFOLIO_LINK##' => $_server_domain_url . '/portfolios/' . $portfolios->id . '/' . $portfolios->title
                );
                sendMail('New portfolio opened', $emailFindReplace, $employerDetails->email);                 
                $result = $portfolios->toArray();
                return renderWithJson($result);
            } else {
                return renderWithJson($result, 'Portfolio could not be added. Access Denied.', '', 1);
            }
        } else {
            if (empty($validationErrorFields)) {
                if (empty($args['image']) || ((!empty($args['image'])) && (!file_exists(APP_PATH . '/media/tmp/' . $args['image'])))) {
                    $validationErrorFields['image'] = array(
                        'Image Required'
                    );
                }
            }
            return renderWithJson($result, 'Portfolio could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Portfolio could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canCreatePortfolio'));
//Get Portfolios
function _getPortfolios($request, $response, $args)
{
    global $authUser;
    $result = array();
    $count = PAGE_LIMIT;
    $queryParams = $request->getQueryParams();
    if (!empty($queryParams['fields'])) {
        $fieldvalue = explode(',', $queryParams['fields']);
    } else {
        $fieldvalue = '*';
    }
    try {
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }
        if (!empty($queryParams['limit']) && ($queryParams['limit'] == 'all')) {
            $count = Models\Portfolio::count();
        }
        $portfolio_flags = array();
        if (!empty($request->getAttribute('userId'))) {
            if (!empty($authUser)) {
                $enabledIncludes = array(
                    'attachment',
                    'portfolios_skill',
                    'user'
                );
                (isPluginEnabled('Portfolio/PortfolioFlag')) ? $enabledIncludes[] = 'flag' : '';
                (isPluginEnabled('Portfolio/PortfolioFollow')) ? $enabledIncludes[] = 'follower' : '';
                $portfolios = Models\Portfolio::with($enabledIncludes)->Filter($queryParams)->where('user_id', $request->getAttribute('userId'))->paginate($count)->toArray();
            } else {
                $enabledIncludes = array(
                    'attachment',
                    'portfolios_skill',
                    'user'
                );
                $portfolios = Models\Portfolio::with($enabledIncludes)->Filter($queryParams)->where('user_id', $request->getAttribute('userId'))->paginate($count)->toArray();
            }
        } elseif (!empty($request->getAttribute('portfolioId'))) {
            if (!empty($authUser)) {
                $enabledIncludes = array(
                    'attachment',
                    'portfolios_skill',
                    'user'
                );
                (isPluginEnabled('Portfolio/PortfolioFlag')) ? $enabledIncludes[] = 'flag' : '';
                (isPluginEnabled('Portfolio/PortfolioFollow')) ? $enabledIncludes[] = 'follower' : '';
                $portfolios = Models\Portfolio::with($enabledIncludes)->where('id', $request->getAttribute('portfolioId'))->select($fieldvalue)->first();
            } else {
                $enabledIncludes = array(
                    'attachment',
                    'portfolios_skill',
                    'user'
                );
                $portfolios = Models\Portfolio::with($enabledIncludes)->where('id', $request->getAttribute('portfolioId'))->select($fieldvalue)->first();
            }
            if (!empty($_GET['type']) && $_GET['type'] == 'view') {
                insertViews($request->getAttribute('portfolioId'), 'Portfolio');
                $enabledIncludes = array(
                    'attachment',
                    'portfolios_skill',
                    'user'
                );
                $portfolios = Models\Portfolio::with($enabledIncludes)->where('id', $request->getAttribute('portfolioId'))->first();
            }
        } elseif (!empty($queryParams['filter']) && $queryParams['filter'] == 'my_followings' && !empty($authUser)) {
            $myFollowings = array();
            $myFollowings = Models\Follower::select('foreign_id as id')->distinct('foreign_id')->where('user_id', $authUser['id'])->where('class', 'Portfolio')->get()->toArray();
            $enabledIncludes = array(
                'attachment',
                'portfolios_skill',
                'user'
            );
            (isPluginEnabled('Portfolio/PortfolioFlag')) ? $enabledIncludes[] = 'flag' : '';
            (isPluginEnabled('Portfolio/PortfolioFollow')) ? $enabledIncludes[] = 'follower' : '';
            $portfolios = Models\Portfolio::with($enabledIncludes)->where('is_admin_suspend', 0)->whereIn('id', $myFollowings)->Filter($queryParams)->paginate($count)->toArray();
        } else {
            if (!empty($authUser)) {
                $enabledIncludes = array(
                    'attachment',
                    'portfolios_skill',
                    'user'
                );
                (isPluginEnabled('Portfolio/PortfolioFlag')) ? $enabledIncludes[] = 'flag' : '';
                (isPluginEnabled('Portfolio/PortfolioFollow')) ? $enabledIncludes[] = 'follower' : '';
                $portfolios = Models\Portfolio::with($enabledIncludes);
                if ((empty($queryParams['filter']) || (!empty($queryParams['filter']) && $queryParams['filter'] != 'all')) && !isset($queryParams['is_admin_suspend'])) {
                    $portfolios = $portfolios->where('is_admin_suspend', 0);
                }
                $portfolios = $portfolios->Filter($queryParams)->paginate($count)->toArray();
            } else {
                $enabledIncludes = array(
                    'attachment',
                    'portfolios_skill',
                    'user'
                );
                $portfolios = Models\Portfolio::with($enabledIncludes)->where('is_admin_suspend', 0)->Filter($queryParams)->paginate($count)->toArray();
            }
        }
        if (!empty($request->getAttribute('portfolioId'))) {
            if (!empty($portfolios)) {
                $result = array(
                    'data' => $portfolios
                );
            } else {
                return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1, 404);
            }
        } else {
            $data = $portfolios['data'];
            unset($portfolios['data']);
            $result = array(
                'data' => $data,
                '_metadata' => $portfolios
            );
        }
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = $e->getMessage(), $isError = 1, 404);
    }
}

# Getlancer Portfolio

Getlancer Portfolio, part of Getlancer Suite (Bidding, Quote, Jobs, Portfolio) is an open source service marketplace script that is capable to run sites similar to Behance clone. It is written in AngularJS with REST API for high performance in mind.

> This project is part of Agriya Open Source efforts. Getlancer was originally a paid script and was selling around 60000 Euros. It is now released under dual license ([OSL 3.0](https://www.agriya.com/resources) & [Commercial](https://www.agriya.com/products/behance-clone)) for open source community benefits.

[![portfolio_banner](https://user-images.githubusercontent.com/4700341/47851517-df255e80-ddfe-11e8-8059-56dd323144b6.png)](https://www.agriya.com/products/behance-clone)


## Support

Getlancer Portfolio is an open source project. Full commercial support (commercial license, customization, training, etc) are available through [Getlancer  platform support](https://www.agriya.com/products/behance-clone)

Theming partner [CSSilize for design and HTML conversions](http://cssilize.com/)

## Getlancer Suite

Agriya Getlancer Suite is a complete freelancer marketplace platform that caters to bidding, quote, jobs and portfolio business models. Any website can be built in combination of these modules, say with bidding and quote, or with all, etc.

* [Getlancer Bidding](https://github.com/agriya/getlancerv3-bidding) - bidding marketplaces like or clone of Freelancer, Guru, elance, Scriptlance, oDesk, Redbeacon, PeoplePerHour, McroWorkers, etc.
* [Getlancer Quote](https://github.com/agriya/getlancerv3-quote) - quote marketplaces like or clone of Thumbtack, Zaarly, Localmind, Redbeacon, TaskRabbit, Urgntly, HouseJoy.
* [Getlancer Jobs](https://github.com/agriya/getlancerv3-job) - jobs marketplaces like or clone of Startuply, Coroflot, AuthenticJobs, Guru, WorkInStartups, dribbble, behance.
* [Getlancer Portfolio](https://github.com/agriya/getlancerv3-portfolio) - portfolio based marketplaces like or clone of dribbble, behance, Coroflot.



## How it works

[Behance clone](https://www.agriya.com/products/behance-clone) 

It's always free to post your project. You'll automatically begin to receive bids from our freelancers. Alternatively, you can browse through the talent available on our site, and make a direct offer to a freelancer instead.
Browse freelancer profiles and Chat in real-time.  Then Compare proposals and select the best one.
Award your project and your freelancer goes to work. Pay when you are satisfied!

Pay safely using our Milestone Payment system - release payments according to a schedule of goals you set, or pay only upon completion. You are in control, so you get to make decisions.

![portfolio_work](https://user-images.githubusercontent.com/4700341/47851518-df255e80-ddfe-11e8-97a5-61caf0cabcdd.png)

## Features

### Geo Location Based Listing

Ease of finding your local service provider with our Geo-based listing functionality with crystal clear accuracy.
  
### Intuitive Category Management

Whatever be your business model is, we made our script with dynamic form builder whereby you can create any service to the extent without having any difficulties.

### Dual Sign up

Take pleasure i hassle-free registration process to enter ino portfolio based freelancer site boh as freelancer or employers.

### Interoperability

Tired of updating the website whenever the new trend unveils? Agriya's Getlancer Suite is power-packed with Front and Back approach. So you can have an absolute freedom to customize the website easily with your intended data metrics.

### AI Enabled Script

Most of the functionalities are automated as it feels the current stats and takes you to the intended space where you can obtain your needed data as well. We indulged with bot mechanism with the script to make it more friendly with the search engines.

## Getting Started

### Prerequisites

#### For deployment

* PostgreSQL >= 9.4
* PHP >= 5.5.9 with OpenSSL, PDO, Mbstring, JSON and cURL extensions
* Nginx (preferred) or Apache

#### For building (build tools)

* Nodejs
* Composer
* Bower
* Grunt

### Setup

* PHP dependencies are handled through `composer` (Refer `/server/php/Slim/`)
* JavaScript dependencies are handled through `bower` (Refer `/client/`)
* Needs writable permission for `/tmp/` and `/media/` folders found within project path
* Build tasks are handled through `grunt`
* Database schema `/sql/getlancer_with_empty_data.sql`
* Cron with below:
```bash
# Common
*/2 * * * * /{$absolute_project_path}/server/php/Slim/shell/main.sh 1 >> /{$absolute_project_path}/tmp/logs/shell.log 2 >> /{$absolute_project_path}/tmp/logs/shell.log
```

### Contributing

Our approach is similar to Magento. If anything is not clear, please [contact us](https://www.agriya.com/contact).

All Submissions you make to Getlancer through GitHub are subject to the following terms and conditions:

* You grant Agriya a perpetual, worldwide, non-exclusive, no charge, royalty free, irrevocable license under your applicable copyrights and patents to reproduce, prepare derivative works of, display, publicly perform, sublicense and distribute any feedback, ideas, code, or other information ("Submission") you submit through GitHub.
* Your Submission is an original work of authorship and you are the owner or are legally entitled to grant the license stated above.


### License

Copyright (c) 2014-2018 [Agriya](https://www.agriya.com/).

Dual License ([OSL 3.0](https://www.agriya.com/resources) & [Commercial License](https://www.agriya.com/contact))

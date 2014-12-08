Angular About using WordPress REST API
================

Introduction
-------
This is the Development environment of my Angular About page (http://www.goncaloneves.com).

I am using WordPress REST API (http://wp-api.org). This will be integrated in future WP versions. So that's a good thing !

My intention is to share my website source code to anyone who wants to build skills with Angular and want something to start off. This is a simple app that can be extended and changed to your liking, it is simple and super light.

What it does have:

 - Development environment: [Yeoman Gulp Angular](https://github.com/Swiip/generator-gulp-angular)
 - [Bootstrap Only CSS](https://github.com/fyockm/bootstrap-css-only)
 - Angular Modules:
	 - Route
	 - Sanitize
	 - Touch
 - Angular Directives:
	 - Auto Hide Navbar
	 - Error View: [Google AJAX Crawl](https://developers.google.com/webmasters/ajax-crawling/docs/getting-started) with html5mode, using [Prerender.io 404 status](https://prerender.io/getting-started#404s) to solve [this](https://support.google.com/webmasters/answer/181708) problem.
	 - Navbar List: I have done this directive to simplify things on the desktop/mobile navbar.
 - Angular Controllers:
	 - Page

Milestone
-----

What may follow:

 1. Release Auto Hide Navbar and Error View directives separately
 2. Update unit / e2e tests
 3. Add contact page
 4. Add post page / post list
 5. Integrate Disqus comments

Usage
-----

You will have from [Yeoman Gulp-Angular](https://github.com/Swiip/generator-gulp-angular#use-gulp-tasks) fantastic generator:

 - `gulp` or `gulp build` to build an optimized version of your
   application in `/dist`
 - `gulp serve` to launch a browser sync server on your source files
 - `gulp serve:dist` to launch a server on your optimized application
 - `gulp wiredep` to fill bower dependencies in your .html file(s)
 - `gulp test` to launch your unit tests with Karma gulp protractor to launch your e2e tests with Protractor
 - `gulp protractor:dist` to launch your e2e tests with Protractor on the dist files

----------

**Deploy**

    . deploy.ssh

I have added a shell script file `deploy.ssh` in your app root folder, that it is really useful and fast to deploy to production server.

Installation
------------

**Server:**
I am running an Apache server, so I am using `.htaccess` to redirect hash requests to index and send `?_escaped_fragment_=` requests to [Prerender.io](https://prerender.io/) that delivers html snapshots to crawlers using PhantomJS.

----------

**WordPress:**
I have it installed under the same domain in a sub-folder.
Then install [wp-api here](http://wp-api.org) or on [GitHub](https://github.com/WP-API/WP-API).
Install my [WordPress REST Domain Redirect](https://github.com/goncaloneves/rest-domain-redirect) plugin if you want to redirect requests from your sub-folder WordPress installation to your root domain folder without including `/wp-admin` on `template_redirect` action as recommended.

----------

**Let's create our App really fast:**

 1. `mkdir angularAbout`
 2. `cd angularAbout`
 2. `git clone https://github.com/goncaloneves/angular-about.git .`
 3. `npm install` or in my case on OSX I need to `sudo npm install`
 4. `bower install`
 5. `gulp serve` and you will see it working in your browser
 6. `. deploy.ssh` to deploy your build, but first you will need to do some changes, read next...

----------

**Deploy**

*What it does ?*
The idea is to have a git production repository, cloned in your production directory in your production server and cloned in your `/dist` folder to commit and push changes. Then ssh into your production server and pull the latest changes.

*Now in steps...*

 1. Clones your production remote repository ([mine is this one](https://github.com/goncaloneves/angular-about-live)) to your `/dist` folder
 2. `gulp build` a new `/dist` version
 3. Commits and pushes changes to remote repository
 4. SSH into your production server and goes to your production directory
 5. Pulls your latest build and finishes

You will need *ssh access* from where you run the script to your production server and *deployment keys* to your repository.

*What you need to do:*
 1. Create your git production repository, for example like mine here on GitHub
 2. Go to your remote server, get to the folder you want
 3. Clone your repository
 4. Edit your `deploy.ssh` file and change `production_server`, `production_directory` and `git_remote` with your information
 5. Check if you can ssh into your production server using ssh keys so you don't have to worry about password prompts in the future
 6. When all it's ready just `. deploy.ssh`

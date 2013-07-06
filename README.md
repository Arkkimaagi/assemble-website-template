assemble-website-template
=========================

This is my personal website template for Assemble. I've tried to take the best parts from html5bp, bootstrap and many others.

## Install
You should have a couple of things installed on your system, please check the instructions on how to do that.
* Git [install](https://help.github.com/articles/set-up-git)
* npm, the Node.js package manager:  [install](http://blog.nodeknockout.com/post/33857791331/how-to-install-node-npm)
* Grunt.js: [install](http://gruntjs.com/getting-started#installing-the-cli)

After you're done with those, just clone the repository to a folder you want:
```bash
git clone https://github.com/Arkkimaagi/assemble-website-template website-template
```

Then go to the directory and install all the npm packages required:
```bash
cd website-template
npm i
```

Now you're ready to run the build script:
```bash
grunt
```

That should run the template generation and you should see it process a bunch of files.

You can now type ```grunt --help``` and see what options you have, or you can take a peak at Gruntfile.js that sets it up.
module.exports = function(grunt) {

  grunt.initConfig({
    // load our main definition package
    pkg: grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('_config.yml'),

    /*
    * url: https://github.com/ai/autoprefixer
    * description: Autoprefixer uses the data on current browser popularity and properties support to apply prefixes for you:
      a { transition: transform 1s }
      become
      a {
        -webkit-transition: -webkit-transform 1s;
        transition: -ms-transform 1s;
        transition: transform 1s
      }
    */
    autoprefixer: {
      build: {
        options: {
          browsers: ['last 2 versions', '> 1%']
        },
        files: [
          {
            src : ['**/*.sass.css'],
            ext : '.autoprefixed.css',
            expand : true
          }
        ]
      }
    },

    /*
    * url: https://github.com/gruntjs/grunt-contrib-concat
    * description: concat all js plugin into one js file and concat the css prefixed with the icon and font css
    */
    concat: {
      options: {
        separator: ';',
        stripBanners: true,
        banner: '/*!\n<%= pkg.name %>\nv<%= site.version %>\n<%= grunt.template.today("mm-dd-yyyy") %>\nMade by <%= pkg.author.name %> - <%= pkg.author.url %>\n*/'
      },
      js: {
        src: ['assets/vendors/modernizr/modernizr.js', 'assets/js/*.js'],
        dest: 'assets/js/script.js'
      },
      css: {
        options: {
          separator: '',
        },
        src: ['assets/css/style.autoprefixed.css' ],
        dest: 'assets/css/style.css'
      }
    },

    /*
    * url: https://github.com/gruntjs/grunt-contrib-connect
    * description: start a server on port 8000 for the documentation
    */
    connect: {
      server: {
        options: {
          hostname: '*',
          port: 8000,
          base: 'dist/'
        }
      }
    },

    /*
    * url: https://github.com/gruntjs/grunt-contrib-copy
    * description: copy icon, js and vendors into the documentation
    */
    copy: {
      // Copy vendors to Jekyll folder
      vendors: {
        files: [
          { 
            expand: true, 
            cwd: './assets/vendors', 
            src: ['./**/*.*', '!./modernizr/modernizr.js'], 
            dest: 'jekyll/assets/vendors/' 
          }
        ]
      },
      // Copy img to Jekyll folder
      images: {
        files: [
          { 
            expand: true, 
            cwd: './assets/img', 
            src: ['./**/*.*'], 
            dest: 'jekyll/assets/vendors/' 
          }
        ]
      }
    },

    /*
    * url: https://github.com/gruntjs/grunt-contrib-cssmin
    * description: minify the css
    */

    cssmin: {
      dist: {
        expand: true,
        cwd: 'assets/css/',
        src: ['*.css', '!*.min.css', '!*.sass.css', '!*.autoprefixed.css'],
        dest: 'dist/assets/css/',
        ext: '.min.css'
      },
      jekyll: {
        expand: true,
        cwd: 'assets/css/',
        src: ['*.css', '!*.min.css', '!*.sass.css', '!*.autoprefixed.css'],
        dest: 'jekyll/assets/css/',
        ext: '.min.css'
      }
    },

    /*
    * url: https://github.com/dannygarcia/grunt-jekyll
    * description: Run Jekyll
    */
    jekyll: {
      options: {
        src: './jekyll'
      },
      dev: {
        options: {
          dest: './dist',
          config: '_config.yml'
        }
      }
    },

    /*
    * url: https://github.com/gruntjs/grunt-contrib-jshint
    * description: Validate files with JSHint.
    */
    jshint: {
      all: [
        'assets/js/**/*.js', '!assets/js/script*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    /*
    * url: https://github.com/Modernizr/grunt-modernizr
    * description: sifts through your project files, gathers up your references to Modernizr tests and outputs a lean, mean Modernizr machine.
    */
    modernizr: {
      "devFile" : "assets/vendors/modernizr/modernizr-dev.js",
      "outputFile" : "assets/vendors/modernizr/modernizr.js",
      "extra" : {
        "shiv" : true,
        "printshiv" : false,
        "load" : true,
        "mq" : true,
        "cssclasses" : true
      },
      "extensibility" : {
        "addtest" : false,
        "prefixed" : true,
        "teststyles" : false,
        "testprops" : false,
        "testallprops" : false,
        "hasevents" : false,
        "prefixes" : false,
        "domprefixes" : false
      },
      "uglify" : true,
      "tests" : ["csstransitions"],
      "parseFiles" : false,
      "matchCommunityTests" : false,
      "customTests" : []
    },

    /*
    * https://github.com/gruntjs/grunt-contrib-sass
    * description: compile sass to css
    */
    sass: {
      build: {
        files : [
          {
            src : ['style.scss'],
            cwd : 'assets/scss',
            dest : 'assets/css/',
            ext : '.sass.css',
            expand : true
          }
        ],
        options : {
          style : 'expanded'
        }
      }
    },

    /*
    * url: https://github.com/gruntjs/grunt-contrib-uglify
    * description: Minify files with UglifyJS.
    */
    uglify: {
      options: {
        report: true
      },
      js: {
        files: {
          'jekyll/assets/js/script.min.js': ['assets/js/script.js']
        }
      }
    },

    /*
    * url: https://github.com/gruntjs/grunt-contrib-watch
    * description: Run predefined tasks whenever watched file patterns are added, changed or deleted.
    */
    watch: {
      scss: {
        files: ['assets/scss/**/*.scss'],
        tasks: ['scss']
      },
      js: {
        files: ['assets/js/*.js'],
        tasks: ['js']
      },
      jekyll: {
        files: ['jekyll/**/*.markdown', 'jekyll/**/*.md',  'jekyll/**/*.html'],
        tasks: 'jekyll'
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          'dist/**/*.html',
          'dist/assets/css/{,*/}*.css',
          'dist/assets/js/{,*/}*.js'
        ]
      }
    }

  });


  grunt.registerTask('scss', ['sass', 'autoprefixer', 'concat:css', 'cssmin']);
  grunt.registerTask('js', ['jshint', 'modernizr', 'concat:js', 'uglify:js']);
  grunt.registerTask('vendors', ['copy:vendors']);
  grunt.registerTask('images', ['copy:images']);

  grunt.registerTask('default', ['scss', 'js', 'images','vendors', 'jekyll']);

  grunt.registerTask('dev', ['connect', 'watch']);

  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-modernizr');
  grunt.loadNpmTasks('grunt-autoprefixer');
  require('matchdep').filterDev('grunt-contrib*').forEach(grunt.loadNpmTasks);
};

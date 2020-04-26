module.exports = grunt => {
    const path = require('path');
    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), '.config/grunt'),
        packageJsonPath: path.join(process.cwd(), 'package.json'),
        init: true,
        loadGruntTasks: {
            pattern: 'grunt-*',
            config: require('./package.json'),
            scope: 'devDependencies'
        }
    });
    const target = grunt.option('target') || 'all';
    grunt.registerTask('testGrep', 'Watch files for speed up development', () => {
        const config = {
            exec: {
                test: {
                    command: ".\\node_modules\\.bin\\nyc --nycrc-path .config\\.nycrc.json -a false .\\node_modules\\.bin\\mocha --full-trace --config .config\\.mocharc.yml -g " + target
                }
            }
        }
        if (target !== 'all') {
            grunt.config.merge(config);
        }
        grunt.task.run(['testDev'])
    });
};

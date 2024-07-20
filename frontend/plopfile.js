const fs = require('fs');
const {readdirSync} = fs;


const MODIFY_PLACE = "/*<PLOP_MODIFY_EXTENSION/>*/";
const MODIFY_PLACE_JSX = "{" + MODIFY_PLACE + "}";
const MODIFY_PLACE_IMPORT = "/*<PLOP_MODIFY_EXTENSION_IMPORT/>*/";

const getDirectories = source =>
    readdirSync(source, {withFileTypes: true})
        .filter(dirent => dirent.isDirectory())
        .map(dirent => ({name: dirent.name}));


const rm = function (dirPath) {
    let files = [];
    try {

        if (fs.statSync(dirPath).isFile()) {
            files = [dirPath];
        } else {
            files = fs.readdirSync(dirPath);
        }

    } catch (e) {

        throw e;
    }

    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rm(filePath);
        }

    fs.rmdirSync(dirPath);
};

module.exports = function (plop) {
    const getAllGroups = () => [{name: "base"}].concat(getDirectories("./src/groups"));

    //
    plop.setActionType('remove', function (answers, config, plop) {
        const {path} = config;
        rm(path);
    });

    // group generator
    plop.setGenerator('new group', {
        description: 'new group',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'group name please'
            },
            {
                type: 'input',
                name: 'route',
                message: 'route name please - example /app/chat'
            },
        ],
        actions: [
            // Create base tree routing file
            {
                type: 'add',
                path: 'src/groups/{{camelCase name}}/WorkoutSetUpItem.jsx',
                templateFile: 'plop/templates/createGroup.md'
            },
            // Css file
            {
                type: 'add',
                path: 'src/groups/{{camelCase name}}/index.scss',
                template: ''
            },
            // Add constant LINK_
            {
                type: 'append',
                path: 'src/base/constants/links.js',
                pattern: MODIFY_PLACE,
                template: 'export const LINK_{{constantCase name}} = "{{route}}"',
            },
            // Append routes
            {
                type: 'append',
                path: 'src/groups/app/WorkoutSetUpItem.jsx',
                pattern: MODIFY_PLACE_JSX,
                template: '        <Route path={ LINK_{{constantCase name}} } component={ {{pascalCase name}} } />',
            },
            // Append import Group Routes
            {
                type: 'append',
                path: 'src/groups/app/WorkoutSetUpItem.jsx',
                pattern: MODIFY_PLACE_IMPORT,
                template: 'import {{pascalCase name}} from "../{{camelCase name}}";',
            },
            // Append import const LINK_
            {
                type: 'append',
                path: 'src/groups/app/WorkoutSetUpItem.jsx',
                pattern: MODIFY_PLACE_IMPORT,
                template: 'import {  LINK_{{constantCase name}} } from "../../base/constants/links";',
            },
        ]
    });

    plop.setGenerator('new component', {
        description: 'create a new component',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'component name please'
            },
            {
                type: 'list',
                name: 'group',
                message: 'What group do you like?',
                choices: getAllGroups
            }
        ],
        actions: ({group}) => {
            const pathToGroup = group === "base" ?
                'src/base' :
                'src/groups/{{camelCase group}}';

            return [{
                type: 'add',
                path: `${pathToGroup}/components/{{pascalCase name}}/index.jsx`,
                templateFile: 'plop/templates/createComponent.md'
            }]
        }
    });

    plop.setGenerator('new service', {
        description: 'create a new service',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'service name please'
            },
        ],
        actions: [{
            type: 'add',
            path: 'src/services/{{pascalCase name}}Service.js',
            templateFile: 'plop/templates/createHttpService.md'
        }]
    });

    plop.setGenerator('clear', {
        description: 'Select groups to delete',
        prompts: [
            {
                type: 'checkbox',
                name: 'groups',
                message: 'What template would you like to use ?',
                choices: () => {
                    return getAllGroups()
                }
            }
        ],
        actions: ({groups = []}) => {
            const deleteActions = groups.map((groupName) => {
                return {
                    type: 'remove',
                    path: `src/groups/${groupName}`,
                }
            });

            const modifyActions = groups.map((groupName) => {
                return {
                    type: 'modify',
                    path: `src/groups/app/index.jsx`,
                    transform: (template) => {
                        const importSection = path => new RegExp(`import\\s*[A-z]*\\s*from\\s*['\"]${path}["'];`, "");
//                        const routeSection = name => new RegExp(`<Route path={[A-z_]*} component={name} />`, "");

                        template = template.replace(importSection(`../${groupName}`), "");

                        return template;
                    }
                }
            });

            return [
                ...deleteActions,
                ...modifyActions
            ]
        }
    });
};

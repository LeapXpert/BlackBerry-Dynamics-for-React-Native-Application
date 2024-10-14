#!/usr/bin/env node

/**
 * Copyright (c) 2022 BlackBerry Limited. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
  checkAndExitOrContinue();

  const execSync = require('child_process').execSync,
    path = require('path'),
    projectRoot = process.env.INIT_CWD,
    scriptPath = path.join(
      projectRoot, 'node_modules', 'BlackBerry-Dynamics-for-React-Native-Base',
      'scripts', 'react_native_info', 'update_development_info.js'
    );

  try {
    execSync(`node "${scriptPath}"`);
  } catch (e) {
    // BlackBerry-Dynamics-for-React-Native-Base is not yet installed.
    // We shouldn't do any actions here.
  }

  
  function checkAndExitOrContinue() {
    let isUsingYarn =
      process.env.YARN_WRAP_OUTPUT !== undefined ||
      process.env.npm_config_user_agent?.includes("yarn");
    let isUsingNpm = process.env.npm_config_argv !== undefined;

    let originalArgs = [];

    if (isUsingNpm) {
      originalArgs = JSON.parse(process.env.npm_config_argv).original;
    } else if (isUsingYarn) {
      originalArgs = process.argv.slice(2);
    } else {
      // lxp ci don't know what package manager is being used so i will exit the process
      process.exit(1);
    }

    let filteredOriginal = originalArgs.filter(function (val) {
      return !["--save", "--verbose", "--d"].includes(val);
    });

    if (
      !(
        filteredOriginal[1] &&
        filteredOriginal[1].indexOf(
          "BlackBerry-Dynamics-for-React-Native-Application"
        ) > -1 &&
        (filteredOriginal.includes("i") ||
          filteredOriginal.includes("install") ||
          filteredOriginal.includes("add"))
      )
    ) {
      process.exit(0);
    }
  }

})();

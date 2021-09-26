/**
 * Copyright 2021 Netin Systems S.L. All rights reserved.
 * Note: All information contained herein is, and remains the property of Netin Systems S.L. and its
 * suppliers, if any. The intellectual and technical concepts contained herein are property of
 * Netin Systems S.L. and its suppliers and may be covered by European and Foreign patents, patents
 * in process, and are protected by trade secret or copyright.
 *
 * Dissemination of this information or the reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Netin Systems S.L.
 */

/**
 * Auxiliary tool for Build process in Netin packages/artifacts based in Nodejs.
 * This tool create an internal release notes, based in the HTML template file and some environment
 * variables:
 * - {{name}} will be replaced by package.json name field
 * - {{body}} will be replaced with the RELEASE.md file
 * - {{artifactName}} will be replaced with ARTIFACT_NAME environment variable
 */
const markdown = require('markdown-it');
const fs = require('fs');
const config = require('../package.json');

const artifactName = process.env.ARTIFACT_NAME;
const name = config.name;
const md = markdown({ html: true, linkify: true, typographer: true, highlight: true });

if (!artifactName) {
  console.error(
    `Wrong repository configuration, no artifact name has been setted, the pipeline looks to be broken`
  );
  process.exit(-1);
}
if (!fs.existsSync('RELEASE.md')) {
  console.error(
    `Wrong repository configuration, no RELEASE.md file found in folder, the pipeline looks to be broken`
  );
  process.exit(-1);
}
if (!fs.existsSync('.config/RELEASE.html')) {
  console.error(
    `Wrong repository configuration, no RELEASE.html template file found in folder, the pipeline looks to be broken`
  );
  process.exit(-1);
}
try {
  console.log('Reading the Release notes from markdown file');
  const releaseNotesMD = fs.readFileSync('RELEASE.md').toString();
  console.log(releaseNotesMD);
  console.log('Rendering releases notes to HTML');
  const releaseNotesHTML = md.render(releaseNotesMD);
  console.log(releaseNotesHTML);
  console.log('Getting HTML Release notes template');
  const htmlTemplate = fs.readFileSync('.config/RELEASE.html').toString();
  console.log('Replace the place holders');
  const html = htmlTemplate
    .replace('{{body}}', releaseNotesHTML)
    .replace('{{name}}', name)
    .replace('{{artifactName}}', artifactName);
  console.log('Writing the HTML release notes');
  fs.writeFileSync('./RELEASE.html', html);
  console.log('Process finnish properly');
} catch (error) {
  console.error('Error creating the Release Notes');
  console.error(error.message);
  process.exit(-1);
}

const gulp = require('gulp');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
var webserver = require('gulp-server-livereload');

const dist_folder = './dist/';
const cv_name = 'cv.pdf';
const cv_path = `${dist_folder}${cv_name}`;

const port = 8000

gulp.task('webserver', function () {
  return gulp.src('app')
    .pipe(webserver({
      livereload: true,
      open: true,
      port,
    }));
});

gulp.task('cv', async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle' });
  await fs.ensureDir(dist_folder)
  await page.pdf({ path: cv_path, format: 'A4', pageRanges: '1-1', 'printBackground': true });

  browser.close();
})

gulp.task('build', ['webserver', 'cv'])
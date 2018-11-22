const gulp = require('gulp');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const webserver = require('gulp-server-livereload');

function task_server() {
  const port = 8000;
  const app_path = './app';

  return gulp.src(app_path)
    .pipe(webserver({
      livereload: true,
      open: true,
      port,
    }));
}

async function task_pdf() {
  const dist_folder = './dist/';
  const cv_name = 'cv.pdf';
  const cv_path = `${dist_folder}${cv_name}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle' });
  await fs.ensureDir(dist_folder);
  await page.pdf({ path: cv_path, format: 'A4', pageRanges: '1-1', 'printBackground': true });

  browser.close();
}

gulp.task('default', task_server);

gulp.task('dev', task_server);

gulp.task('build', gulp.series(task_server, task_pdf));

# gulp-css-resolve-relative-urls
> CSS relative urls resolve plugin for gulp

## Usage

```javascript
var resolveRelativeUrls = require('gulp-css-resolve-relative-urls');

gulp.task('build', function(){
  gulp.src('path/to/css/*.css')
    .pipe(resolveRelativeUrls('dest/'))
    .pipe(rename('build.css'))
    .pipe(gulp.dest('dest/'));
});
```

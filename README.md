http://krizaandmatt.com/

## Installation

Download to your project directory, customize `README.md`, and run the following base on your environment needs:

```
npm install
bower install
```

## Gulp tasks:

For dev preview:
```
gulp
```
## Deploy

For pushing to staging for dev preview:
```
git push staging master
```

For promoting to production:
```
heroku pipelines:promote -r staging
```
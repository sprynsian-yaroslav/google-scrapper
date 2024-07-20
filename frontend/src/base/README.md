## AUTH group description

This group contains next goodies:

1. Private Route guard.
2. Toastr.
3. Meta tags (change page title etc.).
4. Formik Input.
5. Common checkbox.
6. Common Input.
7. Storage constants.
8. Query string parser.
9. Http service (useful and powerful axios config).
10. Refresh session service (use with http service).
11. Storage service.
12. Icon.
13. JoinClassNames helper.
14. useSocketIo (hook to work with Socket.io).
15. useWebSocket (hook to work with native WebSockets).
16. S3 image uploader.

### Adivices for use

1. Import whatever you want from `components`, `constants`, `helpers` and `services` in your project files.
2. Import `index.scss` file to root of your progect.
3. In case you'll import `Private Route` or/and `http` service - you should check and change links
    in `links.js` (e.g link to Logout route path if token has expired etc.)
4. In case you'll import `StorageService` you should rename storage constants which will contain project`s name.
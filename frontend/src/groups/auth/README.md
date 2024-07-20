## AUTH group description

### Pages:
1. Login 
2. Logout 
3. Forgot password  (send restoration email)
4. Reset password 
5. Register 
6. Verification 
7. Blocked user

### Advices for use

3. Import AuthRoutes from `ProfileService.js` (which contains `<Routes>` with all routes described above).
4. Add `<Route>` with path `/auth` to your root routing component. 
    (if you want custom name of `auth` routing (and also start of `auth` routes path) - rename `ROOT_LINK_TO_AUTH` 
    in `links.js` file in `auth` group and in root route of your project (described in point 4)).
5. In `links.js` add ACTUAL links to your `app` routing (will be redirected to after success login),
    also add actual links to APIs (e.g. `/sessions`, `verifications` etc.)
6. Auth group also should be taken with base group, due to the fact that Auth contains common components 
    like `formikInput` and `Icon`, and helpers like `http` and `storageService`

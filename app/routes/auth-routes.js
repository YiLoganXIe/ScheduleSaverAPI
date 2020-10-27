const router = require('express').Router();
const passport = require('passport');

router.get('/failed', (req, res) => res.send('Failed to login'));


router.get('/google', function(req,res,next){
    passport.authenticate(
        'google', { scope: ['profile', 'email'] }
    )(req, res, next);
})
  

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/api/auth/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/api/successful');
  });

router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/api')
})

module.exports = router;
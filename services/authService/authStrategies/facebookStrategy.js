const { Strategy } = require('passport-facebook')

const facebookStrategy = (config, User) => new Strategy(
  {
    clientID: config.facebookClientID,
    clientSecret: config.facebookClientSecret,
    callbackURL: 'auth/facebook/callback',
    profileFields: [
      'id',
      'displayName',
      'email',
      'birthday',
      'friends',
      'first_name',
      'last_name',
      'middle_name',
      'gender',
      'link',
      'hometown',
      'picture.type(large)',
    ],
  },
  async (accessToken, refreshToken, profile, cb) => {
    const {
      name, profileUrl, photos, id,
    } = profile
    let user = null
    let error = null
    try {
      user = await User.findOrCreate({ facebookId: profile.id }, {
        facebookId: id, name: name.givenName, profileUrl, avatarUrl: photos && photos.length > 0 ? photos[0].value : '',
      })
    } catch (err) {
      error = err
    }
    cb(error, user)
  },
)
module.exports = facebookStrategy

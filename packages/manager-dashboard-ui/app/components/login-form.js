import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        login() {
            let { identification, password } = this.getProperties('identification', 'password');
            this.get('session').authenticate('authenticator:oauth2', identification, password).catch((reason) => {
                this.set('errorMessage', reason.error);
            });
        },

        authenticateWithFacebook() {
            this.get('session').authenticate('authenticator:torii', 'facebook');
        }
    }
});

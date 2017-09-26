import DS from 'ember-data';

export default DS.Model.extend({
    username: DS.attr('string'),
    password: DS.attr('string'),
    first_name: DS.attr('string'),
    last_name: DS.attr('string'),
    email: DS.attr('string'),
    picture: DS.attr('string'),
    is_moderator: DS.attr('boolean'),
    status: DS.attr('string'),
    user_status: DS.belongsTo('user-status'),
    last_activity: DS.attr('date'),
    facebookId: DS.attr('string')
});

import DS from 'ember-data';

export default DS.Model.extend({
    subject: DS.attr('string'),
    user: DS.belongsTo('user'),
    status: DS.belongsTo('forum-status'),
    posts: DS.hasMany('forum-post')
});

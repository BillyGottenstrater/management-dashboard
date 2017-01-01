import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    creator: DS.belongsTo('user'),
    status: DS.belongsTo('forum-status'),
    category_id: DS.belongsTo('forum-category')
});

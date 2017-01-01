import DS from 'ember-data';

export default DS.Model.extend({
	thread: DS.belongsTo('forum-thread')
});

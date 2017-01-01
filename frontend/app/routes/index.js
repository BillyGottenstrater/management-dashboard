import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.get('store').findAll('forum-thread', {include: 'posts'});
	}
});

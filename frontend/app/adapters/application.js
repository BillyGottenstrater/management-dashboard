import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: 'http://localhost:1337',
  pathForType: function(type) {
  	return type.camelize();
  }
});
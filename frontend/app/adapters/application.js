import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    pathForType: function(type) {
        return type.camelize();
    }
});

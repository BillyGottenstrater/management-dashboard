import DS from 'ember-data';

export default DS.Model.extend({
    datapoints: DS.hasMany('retail-kpi')
});

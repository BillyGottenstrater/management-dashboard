import Ember from 'ember';

export default Ember.Controller.extend({
    activeKey: Ember.computed('_projectKey', '_subTypeKey', '_metricsKey', function() {
        if (!this.get('_projectKey') || !this.get('_subTypeKey') || !this.get('_metricsKey')) {
            return null;
        }
        return this.get('_projectKey') + this.get('_subTypeKey') + this.get('_metricsKey');
    }),
    _projectKey: null,
    _subTypeKey: null,
    _metricsKey: null,
    session: Ember.inject.service('session'),
    projects: Ember.computed('model.[]', function() {
        return [
            { 'label': 'UUX', value: 'Q2.UUX' },
            { 'label': 'UUX - Retail', value: 'Q2.UUX.Retail' },
            { 'label': 'UUX - Commercial', value: 'Q2.UUX.Commercial' },
            { 'label': 'HQ', value: 'Q2.HQ' }
        ];
    }),
    subType: Ember.computed('model.[]', function() {
        return [
            { 'label': 'Resolved', value: 'Resolved' },
            { 'label': 'Field', value: 'Resolved.field' },
            { 'label': 'Triaged', value: 'Resolved.triaged' }
        ];
    }),
    metrics: Ember.computed('model.[]', function() {
        return [
            { 'label': 'total', value: 'total' },
            { 'label': 'configuration', value: 'configuration.total' },
            { 'label': 'as designed', value: 'asDesigned.total' },
            { 'label': 'cannot reproduce', value: 'cannotReproduce.total' },
            { 'label': 'won\'t fix', value: 'wontFix.total' },
            { 'label': 'fixed', value: 'fixed.total' },
            { 'label': 'p1', value: 'P1.total' },
            { 'label': 'p2', value: 'P2.total' },
            { 'label': 'p3', value: 'P3.total' },
            { 'label': 'p4', value: 'P4.total' }
        ];
    }),
    actions: {
        projectChange(value) {
            this.set('_projectKey', value);
        },
        metricChange(value) {
            this.set('_metricsKey', '.' + value);
        },
        subTypeChange(value) {
            this.set('_subTypeKey', '.' + value);
        }
    }
});

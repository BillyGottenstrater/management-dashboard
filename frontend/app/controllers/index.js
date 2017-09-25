import Ember from 'ember';

export default Ember.Controller.extend({
    activeKey: Ember.computed('_projectKey', '_subTypeKey', '_metricsKey', function() {
        if (!this.get('_projectKey') || !this.get('_metricsKey')) {
            return null;
        }
        return this.get('_projectKey') + this.get('_subTypeKey') + this.get('_metricsKey');
    }),
    percentToggle: false,
    _projectKey: '',
    _subTypeKey: '',
    _metricsKey: '',
    storedMetrics: [],
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%m-%d'
            }
        },
        y: {
            show: false,
        },
        y2: {
            show: false,
            tick: {
                format: d3.format('%')
            }
        }
    },
    dates: Ember.computed('model.[]', 'activeKeys.[]', function() {
        return ['x'].concat(this.get('model').map((datapoint) => {
            return moment(datapoint.date).format('YYYY-MM-DD');
        }));
    }),
    data: Ember.computed('storedMetrics.[]', 'storedMetrics', function() {
        var data = {
            x: 'x',
            columns: [],
            axes: {}
        };
        if (Ember.isEmpty(this.get('storedMetrics'))) {
            return data;
        }
        data.columns.push(this.get('dates'));
        this.get('axis.y2.show', false);
        this.get('axis.y.show', false);
        this.get('storedMetrics').forEach((key) => {
            let parentKey;
            if (key.indexOf('%') > -1) {
                parentKey = key.replace(/([a-zA-Z]*)\.total/, 'total');
                parentKey = parentKey.replace('%', '');
            }
            let object =  [key].concat(this.get('model').map((datapoint) => {
                let data = Ember.get(datapoint, key = key.replace('%', ''));
                if (parentKey) {
                    return data / Ember.get(datapoint, parentKey);
                }
                return data
            }));
            data.columns.push(object);
            if (parentKey) {
               data.axes[key] = 'y2'; 
               this.set('axis.y2.show', true);
            } else {
                this.set('axis.y.show', true);
            }
        });
        
        this.toggleProperty('switch');
        return data;
    }),
    session: Ember.inject.service('session'),
    projects: Ember.computed('model.[]', function() {
        return [
            { 'label': 'UUX', value: 'Q2.UUX' }
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
        togglePercent() {
            this.toggleProperty('percentToggle');
        },
        clear() {
            this.set('storedMetrics', []);
        },
        add_metric() {
            var key = this.get('activeKey');
            if (this.get('percentToggle')) {
                key = '%' + this.get('activeKey');
            }
            this.get('storedMetrics').pushObject(key);
        },
        projectChange(value) {
            this.set('_projectKey', value);
        },
        metricChange(value) {
            this.set('_metricsKey', '.' + value);
        },
        subTypeChange(value) {
            if (value) {
                this.set('_subTypeKey', '.' + value);
                return;
            }
            this.set('_subTypeKey', '');
        }
    }
});

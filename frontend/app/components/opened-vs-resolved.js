import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    activeKey: null,
    switch: false,
    model: [],
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%m-%d'
            }
        }
    },
    data: Ember.computed('model', 'activeKey', function() {
        var data = {
            x: 'x',
            columns: []
        };
        if (!this.get('activeKey')) {
            return;
        }
        data.columns.push(this.get('dates'));
        //data.columns.push(this.get('created'));
        data.columns.push(this.get('resolved'));
        this.toggleProperty('switch');
        return data;
    }),
    dates: Ember.computed('model.[]', 'activeKey', function() {
        return ['x'].concat(this.get('model').map((datapoint) => {
            return moment(datapoint.date).format('YYYY-MM-DD');
        }));
    }),
    created: Ember.computed('model.[]', 'activeKey', function() {
        return []; //['opened'].concat(this.get('model').map((datapoint) => {
        //     return 3000;
        // }));
    }),
    resolved: Ember.computed('model.[]', 'activeKey', function() {
        return ['resolved'].concat(this.get('model').map((datapoint) => {
            return Ember.get(datapoint, this.get('activeKey'));
        }));
    })
});

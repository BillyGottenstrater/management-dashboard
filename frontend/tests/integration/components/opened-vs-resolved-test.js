import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('opened-vs-resolved', 'Integration | Component | opened vs resolved', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{opened-vs-resolved}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#opened-vs-resolved}}
      template block text
    {{/opened-vs-resolved}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

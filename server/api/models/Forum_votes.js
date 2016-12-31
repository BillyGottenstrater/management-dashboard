/**
 * Forum_votes.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        id: {
            type: 'integer',
            primaryKey: true
        },
        up_count: 'integer',
        down_count: 'integer',
        thread_id: {
            type: 'integer',
            model: 'forum_thread',
        },
        post_id: {
            type: 'integer',
            model: 'forum_post'
        }
    }
};

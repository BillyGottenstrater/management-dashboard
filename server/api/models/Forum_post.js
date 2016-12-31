/**
 * Forum_post.js
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
        subject: 'string',
        content: 'text',
        thread_id: 'integer',
        user_id: {
            type: 'integer',
            model: 'user'
        },
        status_id: {
            type: 'integer',
            model: 'forum_status'
        }
    }
};

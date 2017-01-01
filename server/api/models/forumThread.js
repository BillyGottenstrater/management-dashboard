/**
 * Forum_threads.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    identity: 'forumThread',
    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        subject: 'string',
        user_id: {
            type: 'integer',
            model: 'user'
        },
        status_id: {
            type: 'integer',
            model: 'forumStatus'
        },
        posts: {
            collection: 'forumPost',
            via: 'thread'
        }
    }
};

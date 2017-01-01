/**
 * forum-categories.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        name: 'string',
        description: 'text',
        creator_id: {
            type: 'integer',
            model: 'user'
        },
        status_id: {
            type: 'integer',
            model: 'forumStatus'
        },
        category_id: {
            type: 'integer',
            model: 'forumCategory'
        }
    }
};

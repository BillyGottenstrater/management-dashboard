/**
 * Forum_threadController
 *
 * @description :: Server-side logic for managing forum_threads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    find(req, res) {
        var includes = [];
        var query = forumThread.find();
            
        if (req.query.include !== undefined) {
            query.populate('posts');
        }
        query.exec(function(err, users) {
            res.ok(users);
        });
    }
};

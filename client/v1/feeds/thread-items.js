var _ = require('underscore');
var FeedBase = require('./feed-base');


function ThreadItemsFeed(session, threadId, limit) {
    this.threadId = threadId;
    this.limit = parseInt(limit) || null;
    FeedBase.apply(this, arguments);
}
_.extend(ThreadItemsFeed.prototype, FeedBase.prototype);

module.exports = ThreadItemsFeed;
var ThreadItem = require('../thread-item');
var Request = require('../request');
var Thread = require('../thread');



ThreadItemsFeed.prototype.get = function () {
    var that = this;
    return new Request(this.session)
        .setMethod('GET')
        .setResource('threadsShow', {
            cursor: this.getCursor(),
            threadId: this.threadId
        })
        .send()
        .then(function (json) {
            var items = _.map(json.thread.items, function(item) {
                return new ThreadItem(that.session, item);
            })
            that.moreAvailable = json.thread.has_older;
            if(that.isMoreAvailable())
                that.setCursor(json.thread.oldest_cursor)
            return items;
        })
};
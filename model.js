const mongoose = require('mongoose');
const { Schema } = mongoose;

const date = new Date();

const ReplySchema = new Schema({
    text: { type: String },
    delete_password: { type: String },
    created_on: { type: Date, default: date },
    reported: { type: Boolean, default: false },
    bumped_on: { type: Date, default: date }
});
const Reply = mongoose.model('Reply', ReplySchema);

const ThreadSchema = new Schema({
    text: { type: String },
    delete_password: { type: String },
    created_on: { type: Date, default: date },
    bumped_on: { type: Date, default: date },
    reported: { type: Boolean, default: false },
    replies: { type: [ReplySchema], default: [] }
});
const Thread = mongoose.model('Thread', ThreadSchema);

const BoardSchema = new Schema({
    name: { type: String },
    threads: { type: [ThreadSchema], default: [] }
});
const Board = mongoose.model('Board', BoardSchema);

exports.Board = Board;
exports.Thread = Thread;
exports.Reply = Reply;
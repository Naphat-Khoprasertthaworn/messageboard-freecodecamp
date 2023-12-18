'use strict';

const BoardModel = require('../model.js').Board;
const ThreadModel = require('../model.js').Thread;
const ReplyModel = require('../model.js').Reply;


module.exports = function (app) {
  
  app.route('/api/threads/:board').post(async function (req, res) {
    
    const {text, delete_password} = req.body;
    let board = req.body.board;
    if(!board) board = req.params.board;
    console.log("post",req.body);

    const newThread = ThreadModel({
      text:text,
      delete_password:delete_password,
      replies: [],
    });

    let BoardData = await BoardModel.findOne({name: board})
    // console.log(BoardData);
    if(!BoardData) {
      const newBoard = BoardModel({
        name: board,
        threads: []
      });
      newBoard.threads.push(newThread);
      newBoard.save().then((data, err) => {
        if(err || !data){
          res.send("Error saving new thread");
        }else{
          console.log('New board created');
          res.json(newThread);
        }
      })
    } else {
      BoardData.threads.push(newThread);
      BoardData.save().then((data, err) => {
        
        if(err || !data){
          console.log(err);
          res.send("there was an error saving in post")
        }else{
          console.log('New thread created');
          res.json(newThread);
        }
      })
    }
  })
  .get(async (req,res) => {
    const board = req.params.board;
    let data = await BoardModel.findOne({name: board})

    if(!data){
      console.log("No board found");
      res.send("No board found");
    } else {
      const threads = data.threads.map((thread) => {
        const {_id, text, created_on, bumped_on, replies} = thread;
        return {_id, text, created_on, bumped_on, replies, replycount: thread.replies.length};
      })
      res.json(threads);
    }
    
  })
  .put(async function (req, res) {
    console.log("put",req.body);
    const board = req.params.board;
    let data = await BoardModel.findOne({name: board});

    if(!data){
      res.send("No board found");
    } else {
      const date = new Date();
      let repordedThread = data.threads.id(req.body.report_id);
      repordedThread.reported = true;
      repordedThread.bumped_on = date;
      data.save().then((data, err) => {
        res.send('success');
      })
    }

  })
  .delete(async function (req, res) {
    //console.log("delete",req.body);
    const {thread_id, delete_password} = req.body;
    const board = req.params.board;
    let data = await BoardModel.findOne({name: board});
    if(!data){
      res.send("No board found");
    } else {
      let thread = data.threads.id(thread_id);
      if(thread.delete_password === delete_password){
        thread.deleteOne();
        data.save().then((data,err) => {
          res.send('success');
        })
      } else {
        res.send('incorrect password');
      }
      
    }
  })
  

  app.route('/api/replies/:board')
  .post(async function (req, res) {
    console.log("post",req.body);
    const {text, delete_password, thread_id} = req.body;
    const board = req.params.board;
    const newReqly = new ReplyModel({
      text:text,
      delete_password:delete_password
    });
    let data = await BoardModel.findOne({name: board});
    if(!data){
      res.send("No board found");
    } else {
      const date = new Date();
      let threadToAddReply = data.threads.id(thread_id);
      threadToAddReply.bumped_on = date;
      threadToAddReply.replies.push(newReqly);
      data.save().then((data, err) => {
        res.json(data);
      })
    }
  })
  .get(async function (req, res) {
    // console.log("get",req.body);
    const board = req.params.board;
    const thread_id = req.query.thread_id;
    let data = await BoardModel.findOne({name: board});
    if(!data){
      res.send("No board found");
    } else {
      let thread = data.threads.id(thread_id);
      res.json(thread);
    }
  })
  .put(async function (req, res) {
    // console.log("put",req.body);
    const {thread_id, reply_id} = req.body;
    const board = req.params.board;
    let data = await BoardModel.findOne({name: board});
    if(!data){
      res.send("No board found");
    } else {
      const date = new Date();
      let thread = data.threads.id(thread_id);
      let reply = thread.replies.id(reply_id);
      reply.reported = true;
      reply.bumped_on = date;
      data.save().then((data, err) => {
        res.send('success');
      })
    }
  })
  .delete(async function (req, res) {
    console.log("delete",req.body);
    const {thread_id, reply_id, delete_password} = req.body;
    const board = req.params.board;
    let data = await BoardModel.findOne({name: board});
    if(!data){
      res.send("No board found");
    } else {
      let thread = data.threads.id(thread_id);
      let reply = thread.replies.id(reply_id);
      if(reply.delete_password === delete_password){
        reply.deleteOne();
        data.save().then((data, err) => {
          res.send('success');
        })
      } else {
        res.send('incorrect password');
      }
      
    }
  });


};

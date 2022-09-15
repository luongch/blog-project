const commentRouter = require('../routes/comment');
const blogRouter = require('../routes/blog');
const request = require("supertest");
const createServer = require('../utils/server')
const {MongoMemoryServer} = require('mongodb-memory-server')

const dotenv = require('dotenv');
dotenv.config();

describe('comment module', ()=>{
  let app;
  let instance;
  let blogId;
  let title;
  let text;
  let commentText;
  let commentId;
    
  beforeAll(async()=>{
    instance = await MongoMemoryServer.create();
    const uri = instance.getUri();

    const localDB = process.env.MONGODB_LOCAL_URI;    
    app = createServer(uri);


    app.use(express.urlencoded({ extended: false }));
    app.use("/comment", commentRouter);
    app.use("/blog", blogRouter);

  })
  afterAll(async()=>{
    //need to delete all the data after, maybe this should be afterEach?
    instance.stop();
  })
  describe("comment router", ()=>{
    beforeAll(async()=>{
        //create blog so we have an id
        title = "sample title"
        text = "sample text"
        let {body,statusCode} = await request(app)
          .post("/blog")
          .send(
            {
              title,
              text
            }
          )    
        blogId = body.data.blog._id
    })
    describe('given the comment does not exist',()=>{
      it("should return a 200 status and no results when queried for by id", async ()=>{
        let invalidId = "invalidid"
        let {body, statusCode} = await request(app).get(`/comment/`)
        .query({ //why does this need to be done this way? fails when you pass in directly to the .get
          id: invalidId
        })
        expect(statusCode).toBe(200)  
        expect(body.data.comments.length).toBe(0)
      })
      it("should return a 200 status and the comment when created", async ()=>{
        commentText = "sample comment"
        let {body, statusCode} = await request(app).post(`/blog/${blogId}/comment`)
        .send(
            {
                text: commentText
            }
        )
          expect(statusCode).toBe(200)
          expect(body.data.comment.text).toBe(commentText)
      })
    })
    describe("given the comment does exist", ()=>{
        beforeAll(async ()=>{
            commentText = "sample comment"
            let {body, statusCode} = await request(app).post(`/blog/${blogId}/comment`)
            .send(
                {
                    text: commentText
                }
            )
            commentId = body.data.comment._id
        })
      it("should return a 200 status and more than 0 results when getting all comments", async ()=>{
        let {body, statusCode} = await request(app).get('/comment')
        .send(
            {
                blogId
            }
        )
        expect(statusCode).toBe(200)
        expect(body.data.comments.length).not.toBe(0)
      })
      describe("when updated", ()=>{
        it("should return a 200 status and updated the comment", async()=>{
            let {body, statusCode} = await request(app).put(`/comment/${commentId}`)
            .send(
                {
                    text: "updated comment"
                }
            )
            expect(statusCode).toBe(200)
            expect(body.data.comment.text).toBe("updated comment")
        });
      })
      describe("when deleted", ()=>{
        it("should return a 200 status and deleted comment id", async()=>{
            let {body, statusCode} = await request(app).delete(`/comment/${commentId}`)
            expect(statusCode).toBe(200)
            expect(body.id).toBe(commentId)
        })
        it("should return a 200 status and no results when querying for deleted blog", async()=>{
            let {body, statusCode} = await request(app).get(`/comment`)
            .send(
                {
                    blogId
                }
            )
            expect(statusCode).toBe(200) 
            body.data.comments.forEach(comment => {
                expect(comment._id).not.toBe(commentId)
            });
        })
      })
    })
  })
});




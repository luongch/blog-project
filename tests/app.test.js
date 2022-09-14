const blogRouter = require('../routes/blog');
const request = require("supertest");
const createServer = require('../utils/server')
const {MongoMemoryServer} = require('mongodb-memory-server')

const dotenv = require('dotenv');
dotenv.config();

describe('blog module', ()=>{
  let app;
  let instance;
  let blogId;
  let title;
  let text;
    
  beforeAll(async()=>{
    instance = await MongoMemoryServer.create();
    const uri = instance.getUri();

    const localDB = process.env.MONGODB_LOCAL_URI;    
    app = createServer(uri);


    app.use(express.urlencoded({ extended: false }));
    app.use("/blog", blogRouter);

  })
  afterAll(async()=>{
    //need to delete all the data after, maybe this should be afterEach?
    instance.stop();
  })
  describe("blog router", ()=>{
    describe('given the blog does not exist',()=>{
      it("should return a 200 status and no results when queried for by id", async ()=>{
        let invalidId = "invalidid"
        let {body, statusCode} = await request(app).get(`/blog/`)
        .query({
          _id: invalidId
        })
        expect(statusCode).toBe(200)  
        expect(body.data.blogs.length).toBe(0)
      })
      it("should return a 200 status and the blog when created", async ()=>{
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
          expect(statusCode).toBe(200)
      })
    })
    describe("given the blog does exist", ()=>{
      beforeAll(async ()=>{
        let {body,statusCode} = await request(app)
          .post("/blog")
          .send(
            {
              title: "sample title",
              text: "sample text",
            }
          )    
        blogId = body.data.blog._id
      })
      it("should return a 200 status", async ()=>{
        let {body, statusCode} = await request(app).get("/blog")
        expect(statusCode).toBe(200)  
        expect(body.data.blogs.length).not.toBe(0)
      })
      it("should return a 200 status and the correct blog", async()=> {
        let {body, statusCode} = await request(app).get(`/blog/${blogId}`)
        expect(statusCode).toBe(200)  
        expect(body.data.blog._id).toBe(blogId)
        expect(body.data.blog.title).toBe(title)
        expect(body.data.blog.text).toBe(text)
      })
    })
  })
});




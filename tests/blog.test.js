const request = require("supertest");
const createServer = require('../utils/server')
const {MongoMemoryServer} = require('mongodb-memory-server')

describe('blog module', ()=>{
  let app;
  let instance;
  let blogId;
  let title;
  let text;
  let updatedTitle;
  let updatedText;
  let token;
    
  beforeAll(async()=>{
    instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    
    app = createServer(uri);
  })
  afterAll(async()=>{
    //need to delete all the data after, maybe this should be afterEach?
    instance.stop();
  })
  describe("blog router", ()=>{
    describe.skip('given the user is not logged in',()=>{
      it("should return a 403 status attempting to post a blog", async ()=>{
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
          expect(statusCode).toBe(403)
      })
    })
    describe('given the blog does not exist',()=>{
      beforeAll(async()=>{
        //create user
        console.log("create user in test")
         await request(app)
          .post("/signup")
          .send(
            {
              username: "username",
              password: "password"
            }
          )    
         
        //authenticate user
        console.log("authenicating in test")
        let {body,statusCode} = await request(app)
          .post("/auth/login")
          .send(
            {
              username: "username",
              password: "password"
            }
          ) 
          token = body.token
          console.log("token", token)
      })
      afterAll(async()=>{
        //logout
        let {body,statusCode} = await request(app)
          .post("/auth/logout")
      })
      it("should return a 200 status and no results when queried for by id", async ()=>{
        let invalidId = "invalidId"
        let {body, statusCode} = await request(app).get(`/blog/`)
        .query({ //why does this need to be done this way? fails when you pass in directly to the .get
          id: invalidId
        })
        expect(statusCode).toBe(200)  
        expect(body.data.blogs.length).toBe(0)
      })
      it("should return a 200 status and the blog when created", async ()=>{
        title = "sample title"
        text = "sample text"
        let {body,statusCode} = await request(app)
          .post("/blog")
          .query({
            secret_token: token
          })
          .send(
            {
              title,
              text
            }
          )    
          expect(statusCode).toBe(200)
          expect(body.data.blog.title).toBe(title)
          expect(body.data.blog.text).toBe(text)
      })
      
    })
    describe("given the blog does exist", ()=>{
      beforeAll(async ()=>{
        let {body} = await request(app)
          .post("/blog")
          .query({
            secret_token: token
          })
          .send(
            {
              title: "sample title",
              text: "sample text",
            }
          )    
        blogId = body.data.blog._id
      })
      it("should return a 200 status and more than 0 results when getting all blogs", async ()=>{
        let {body, statusCode} = await request(app).get("/blog")
        expect(statusCode).toBe(200)  
        expect(body.data.blogs.length).not.toBe(0)
      })
      it("should return a 200 status and the correct blog when getting one blog", async()=> {
        let {body, statusCode} = await request(app).get(`/blog/${blogId}`)
        expect(statusCode).toBe(200)  
        expect(body.data.blog._id).toBe(blogId)
        expect(body.data.blog.title).toBe(title)
        expect(body.data.blog.text).toBe(text)
      })
      describe("when updated", ()=>{
        it("should return a 200 status and updated the blog", async()=>{
          updatedTitle = "updated title"
          updatedText = "updated text"
          
          let {body, statusCode} = await request(app).put(`/blog/${blogId}`)
          .send(
            {
              title: updatedTitle,
              text: updatedText
            }
          );
          expect(statusCode).toBe(200)  
          expect(body.data.blog.title).toBe(updatedTitle)
          expect(body.data.blog.text).toBe(updatedText)
        });
      })
      describe("when deleted", ()=>{
        it("should return a 200 status and success message when deleted", async()=>{
          let {body, statusCode} = await request(app).delete(`/blog/${blogId}`)
          expect(statusCode).toBe(200)  
        })
        it("should return a 200 status and no results when querying for deleted blog", async()=>{
          let {body, statusCode} = await request(app).get(`/blog/${blogId}`)
          expect(statusCode).toBe(200) 
          expect(body.data.blog).toBe(null)
        })
      })
    })
  })
});


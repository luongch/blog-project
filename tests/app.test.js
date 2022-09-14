const blogRouter = require('../routes/blog');
const request = require("supertest");
const createServer = require('../utils/server')
// const {MongoClient} = require('mongodb');

const {MongoMemoryServer} = require('mongodb-memory-server')

const dotenv = require('dotenv');
dotenv.config();




describe('blog module', ()=>{
  // let connection;
  // let db;
  let app;
  let instance;
    
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
  describe("get blog", ()=>{
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
          console.log(body) 
      })
      it("should return a 200 status", async ()=>{
        let {body, statusCode} = await request(app).get("/blog")
        expect(statusCode).toBe(200)  
        expect(body.data.blogs.length).toBe(1)
      })
    })
  })
  test("testing jest works", (done) => {
    request(app)
      .get("/blog/test/test/")
      .expect(200, done)
  })
});




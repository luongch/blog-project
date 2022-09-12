const blogRouter = require('../routes/blog');
const request = require("supertest");
const createServer = require('../utils/server')
const dotenv = require('dotenv');
dotenv.config();

const localDB = process.env.MONGODB_LOCAL_URI;    
const app = createServer(localDB);

app.use(express.urlencoded({ extended: false }));
app.use("/blog", blogRouter);


describe('blog module', ()=>{
  // beforeAll(async()=>{

  // })
  afterAll(async()=>{
    //need to delete all the data after, maybe this should be afterEach?
  })
  describe("get blog", ()=>{
    describe("given the blog does exist", ()=>{
      beforeAll(async ()=>{
        let blog = await request(app)
          .post("/blog")
          .send(
            {
              title: "sample title",
              text: "sample text",
            }
          )          
      })
      it("should return a 200 status", async ()=>{
        let {body, statusCode} = await request(app).get("/blog")
        console.log(body)
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




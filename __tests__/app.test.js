process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require("supertest");
const jsonschema = require('jsonschema');
const bookSchema = require('../schemas/bookSchema.json');
const Book = require('../models/book');
const db = require('../db.js')

describe("", function(){

  beforeEach(async function(){
    await Book.create({
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Lane",
      language: "english",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
      year: 2017
    })
  })

  afterEach(async function(){
    await db.query(`DELETE FROM books`);
  })

  test("GET /books/:id", async function(){
    const resp = await request(app).get('/books/0691161518');
    expect(resp.statusCode).toBe(200);
    const book = resp.body.book;
    expect(jsonschema.validate(book, bookSchema).valid).toBe(true);
  })


  test("GET /books", async function(){
    const resp = await request(app).get('/books');
    expect(resp.statusCode).toBe(200);
    expect(resp.body.books.every(book => jsonschema.validate(book, bookSchema).valid));
  })

  test("POST /books - good", async function(){
    const resp = await request(app).post('/books').send({
      isbn: "0123456789",
      amazon_url: "http://a.co/eobPt434X2",
      author: "Thor Fakau",
      language: "english",
      pages: 1000,
      publisher: "Penguin",
      title: "Aloha from Moscow",
      year: 1987
    })

    const book = resp.body.book;
    expect(resp.statusCode).toBe(201);
    expect(jsonschema.validate(book, bookSchema).valid).toBe(true);

  })

  test("POST /books - bad", async function(){
    const resp = await request(app).post('/books').send({
      isbn: 123456789,
      amazon_url: "http://a.co/eobPt434X2",
      author: "Thor Fakau",
      language: "english",
      pages: 1000,
      publisher: "Penguin",
      title: "Aloha from Moscow",
      year: 1987
    })

    expect(resp.statusCode).toBe(400);
  })

  test("POST /books - bad", async function(){
    const resp = await request(app).post('/books').send({
      isbn: "0123456789",
      amazon_url: "http://a.co/eobPt434X2",
      author: "Thor Fakau",
      language: "english",
      pages: 1000,
      publisher: "Penguin",
      title: "Aloha from Moscow",
      year: "1987"
    })

    expect(resp.statusCode).toBe(400);
  })

  test("POST /books - bad", async function(){
    const resp = await request(app).post('/books').send({
      isbn: "0123456789",
      amazon_url: "http://a.co/eobPt434X2",
      language: "english",
      pages: 1000,
      publisher: "Penguin",
      title: "Aloha from Moscow",
      year: 1987
    })

    expect(resp.statusCode).toBe(400);
  })

  test("PUT /books - good", async function(){
    const resp = await request(app).put('/books/0691161518').send({
      isbn: "0123456789",
      amazon_url: "http://a.co/eobPt434X2",
      author: "Thor Fakau",
      language: "english",
      pages: 1000,
      publisher: "Penguin",
      title: "Aloha from Moscow",
      year: 1987
    })

    const book = resp.body.book;
    expect(resp.statusCode).toBe(200);
    expect(jsonschema.validate(book, bookSchema).valid).toBe(true);
  })

  test("PUT /books - bad", async function(){
    const resp = await request(app).put('/books/0691161518').send({
      isbn: 123456789,
      amazon_url: "http://a.co/eobPt434X2",
      author: "Thor Fakau",
      language: "english",
      pages: 1000,
      publisher: "Penguin",
      title: "Aloha from Moscow",
      year: 1987
    })

    expect(resp.statusCode).toBe(400);
  })

  test("PUT /books - bad", async function(){
    const resp = await request(app).put('/books/0691161518').send({
      isbn: "0123456789",
      amazon_url: "http://a.co/eobPt434X2",
      author: "Thor Fakau",
      language: "english",
      pages: 1000,
      publisher: "Penguin",
      title: "Aloha from Moscow",
      year: "1987"
    })

    expect(resp.statusCode).toBe(400);
  })

  test("PUT /books - bad", async function(){
    const resp = await request(app).put('/books/0691161518').send({
      isbn: "0123456789",
      amazon_url: "http://a.co/eobPt434X2",
      author: "Thor Fakau",
      language: "english",
      pages: 1000,
      title: "Aloha from Moscow",
      year: 1987
    })

    expect(resp.statusCode).toBe(400);
  })

})
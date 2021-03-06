const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');

chai.use(chaiHttp);

let token,movieId;


describe('/api/movies tests',() => {

    // Taking token before tests
    before((done) => {
        chai.request(server)
            .post('/authenticate')
            .send({
                username: 'test',
                password: 'test123'
            })
            .end((err,res) => {
                token = res.body.token;
                done()
            });
    });

    // GET test
    describe('/GET movies',() => {
        it('it should GET all the movies', (done) => {
            chai.request(server)
                .get('/api/movies')
                .set('x-access-token',token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                })
        })
    });

    // POST test
    describe('/POST movie',() => {
        it('it should POST a movie',(done) => {
            const movie = {
                title: 'Test',
                director_id : "5d41a0e69624c22b4cfc4b44",
                category: 'test_category',
                country: 'test_country',
                year: 1950,
                imdb_score: 9
            };

            chai.request(server)
                .post('/api/movies')
                .send(movie)
                .set('x-access-token',token)
                .end((err,res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    movieId = res.body._id;
                    done();
                })
        });
    });

    // GET test
    describe('/GET/:movie_id movie', () => {
        it('it should GET a movie by the given id',(done) => {
            chai.request(server)
                .get('/api/movies/'+movieId)
                .set('x-access-token',token)
                .end((err,res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    res.body.should.have.property('_id').eql(movieId);
                    done();
                })
        })
    });

    // PUT test
    describe('/PUT/:movie_id  movie', () => {
        it('it should UPDATE a movie given by id',(done) => {
            const movie = {
                title: 'put_test',
                director_id : "5d41a0e69624c22b4cfc4b42",
                category: 'test_category_put',
                country: 'test_country_put',
                year: 1970,
                imdb_score: 8
            };

            chai.request(server)
                .put('/api/movies/'+movieId)
                .send(movie)
                .set('x-access-token',token)
                .end((err,res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title').eql(movie.title);
                    res.body.should.have.property('director_id').eql(movie.director_id);
                    res.body.should.have.property('category').eql(movie.category);
                    res.body.should.have.property('country').eql(movie.country);
                    res.body.should.have.property('year').eql(movie.year);
                    res.body.should.have.property('imdb_score').eql(movie.imdb_score);
                    done();
                });
        });
    });

    // DELETE test
    describe('/DELETE/:movie_id  movie', () => {
        it('it should DELETE a movie given by id', (done) => {
        
            chai.request(server)
                .delete('/api/movies/'+movieId)
                .set('x-access-token',token)
                .end((err,res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(1);
                    done();
                });
        });
    });
});